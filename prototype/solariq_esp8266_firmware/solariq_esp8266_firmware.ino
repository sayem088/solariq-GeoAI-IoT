#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>
#include <WiFiClientSecureBearSSL.h>
#include <ArduinoJson.h>
#include <memory>

const char* WIFI_SSID     = "Labonno";
const char* WIFI_PASSWORD = "Farhana@israt";

const char* API_BASE_URL = "http://192.168.0.106:3000";

const char* DEVICE_TOKEN = "solariq-kurigram-token-2027";
const char* DEVICE_ID    = "irrigation-01";

const uint8_t PUMP_IN1 = D1;
const uint8_t PUMP_IN2 = D2;
const uint8_t LED_PIN  = D6;
const uint8_t SOIL_PIN = A0;

const unsigned long WATERING_DURATION_MS = 40000UL;

const unsigned long COMMAND_POLL_MS      = 3000UL;
const unsigned long STATUS_REPORT_MS     = 5000UL;
const unsigned long WIFI_RETRY_MS        = 10000UL;

bool pumpRunning = false;
bool ledOn = false;
int selectedGrid = 1;

unsigned long pumpStartedAt  = 0;
unsigned long lastCommandPoll = 0;
unsigned long lastStatusReport = 0;
unsigned long lastWiFiAttempt = 0;

String lastCommandId = "";

int simulatedMoisture = 28;

void pumpOff() {
  digitalWrite(PUMP_IN1, LOW);
  digitalWrite(PUMP_IN2, LOW);
  pumpRunning = false;
  Serial.println("[PUMP] Shut off executed. Power diverted to grid export.");
}

void pumpOn(int targetGrid) {
  if (pumpRunning) {
    Serial.println("[PUMP] Pump already running. Ignoring duplicate start.");
    return;
  }

  selectedGrid = targetGrid;
  digitalWrite(PUMP_IN1, HIGH);
  digitalWrite(PUMP_IN2, LOW);

  pumpStartedAt = millis();
  pumpRunning = true;

  Serial.printf("[PUMP] Pump ENGAGED for Plot %d. Starting 40-sec AWD timer.\n", selectedGrid);
}

void setLed(bool state) {
  ledOn = state;
  digitalWrite(LED_PIN, state ? HIGH : LOW);
  Serial.printf("[LED] State: %s\n", state ? "ON" : "OFF");
}

unsigned long remainingSeconds() {
  if (!pumpRunning) {
    return 0;
  }
  unsigned long elapsed = millis() - pumpStartedAt;
  if (elapsed >= WATERING_DURATION_MS) {
    return 0;
  }
  return (WATERING_DURATION_MS - elapsed + 999UL) / 1000UL;
}

int readSoilMoisture() {
  int rawAdc = analogRead(SOIL_PIN);

  if (rawAdc < 900) {

    int mapped = map(rawAdc, 900, 350, 0, 100);
    return constrain(mapped, 0, 100);
  }

  if (pumpRunning) {
    unsigned long elapsed = millis() - pumpStartedAt;
    float progress = (float)elapsed / (float)WATERING_DURATION_MS;
    simulatedMoisture = 28 + (int)(progress * 32.0);
  } else if (simulatedMoisture > 28 && millis() % 15000 < 500) {
    simulatedMoisture--;
  }
  return constrain(simulatedMoisture, 0, 100);
}

bool beginHttpRequest(
  HTTPClient& http,
  WiFiClient& plainClient,
  std::unique_ptr<BearSSL::WiFiClientSecure>& secureClient,
  const String& path
) {
  if (WiFi.status() != WL_CONNECTED) {
    return false;
  }

  String url = String(API_BASE_URL) + path;
  bool isHttps = url.startsWith("https://");

  if (isHttps) {
    secureClient.reset(new BearSSL::WiFiClientSecure());
    secureClient->setInsecure();
    secureClient->setBufferSizes(512, 512);
    secureClient->setTimeout(5000);

    if (!http.begin(*secureClient, url)) {
      Serial.println("[HTTPS] Failed to initialize request.");
      return false;
    }
  } else {
    plainClient.setTimeout(5000);
    if (!http.begin(plainClient, url)) {
      Serial.println("[HTTP] Failed to initialize request.");
      return false;
    }
  }

  http.setTimeout(6000);
  http.setReuse(false);
  http.addHeader("Authorization", String("Bearer ") + DEVICE_TOKEN);
  http.addHeader("X-Device-ID", DEVICE_ID);

  return true;
}

bool acknowledgeCommand(const String& commandId, const String& result) {
  if (commandId.length() == 0) {
    return false;
  }

  WiFiClient plainClient;
  std::unique_ptr<BearSSL::WiFiClientSecure> secureClient;
  HTTPClient http;

  if (!beginHttpRequest(http, plainClient, secureClient, "/api/iot/device/commands/ack")) {
    return false;
  }

  http.addHeader("Content-Type", "application/json");

  JsonDocument doc;
  doc["deviceId"] = DEVICE_ID;
  doc["commandId"] = commandId;
  doc["result"] = result;

  String body;
  serializeJson(doc, body);

  int code = http.POST(body);
  bool success = (code >= 200 && code < 300);

  if (success) {
    Serial.printf("[ACK] Command %s confirmed (%s)\n", commandId.c_str(), result.c_str());
  } else {
    Serial.printf("[ACK] Failed to acknowledge %s. HTTP %d\n", commandId.c_str(), code);
  }

  http.end();
  return success;
}

void processCommand(JsonDocument& doc) {
  if (doc["commandId"].isNull()) {
    return;
  }

  String commandId = doc["commandId"].as<String>();
  String action = doc["action"] | "";
  int grid = doc["grid"] | 1;

  if (commandId.length() == 0 || action == "none") {
    return;
  }

  if (commandId == lastCommandId) {
    return;
  }

  String result = "rejected";

  if (action == "pump_on") {
    if (grid < 1 || grid > 6) {
      result = "invalid_grid";
    } else if (pumpRunning) {
      result = "pump_already_running";
    } else {
      pumpOn(grid);
      setLed(true);
      result = "started";
    }
  }
  else if (action == "pump_off") {
    pumpOff();
    setLed(false);
    result = "stopped";
  }
  else if (action == "led_on") {
    setLed(true);
    result = "led_on";
  }
  else if (action == "led_off") {
    setLed(false);
    result = "led_off";
  }
  else {
    result = "unknown_action";
  }

  lastCommandId = commandId;

  acknowledgeCommand(commandId, result);
}

void pollCommands() {
  if (WiFi.status() != WL_CONNECTED) {
    return;
  }

  WiFiClient plainClient;
  std::unique_ptr<BearSSL::WiFiClientSecure> secureClient;
  HTTPClient http;

  if (!beginHttpRequest(http, plainClient, secureClient, "/api/iot/device/commands")) {
    return;
  }

  int code = http.GET();

  if (code == 200) {
    String response = http.getString();
    JsonDocument doc;
    DeserializationError error = deserializeJson(doc, response);

    if (error) {
      Serial.printf("[POLL] JSON parse error: %s\n", error.c_str());
    } else {
      processCommand(doc);
    }
  } else {
    Serial.printf("[POLL] HTTP GET /api/iot/device/commands returned %d\n", code);
  }

  http.end();
}

void reportStatus() {
  if (WiFi.status() != WL_CONNECTED) {
    return;
  }

  WiFiClient plainClient;
  std::unique_ptr<BearSSL::WiFiClientSecure> secureClient;
  HTTPClient http;

  if (!beginHttpRequest(http, plainClient, secureClient, "/api/iot/device/status")) {
    return;
  }

  http.addHeader("Content-Type", "application/json");

  JsonDocument doc;
  doc["deviceId"]         = DEVICE_ID;
  doc["pump"]             = pumpRunning;
  doc["led"]              = ledOn;
  doc["selectedGrid"]     = selectedGrid;
  doc["remainingSeconds"] = remainingSeconds();
  doc["moisture"]         = readSoilMoisture();
  doc["rssi"]             = WiFi.RSSI();

  String body;
  serializeJson(doc, body);

  int code = http.POST(body);

  if (code >= 200 && code < 300) {
    Serial.printf("[TELEMETRY] Sent: Pump=%s, Grid=%d, Left=%lus, Moisture=%d%%\n",
      pumpRunning ? "ON" : "OFF",
      selectedGrid,
      remainingSeconds(),
      doc["moisture"].as<int>()
    );
  } else {
    Serial.printf("[TELEMETRY] HTTP POST /api/iot/device/status returned %d\n", code);
  }

  http.end();
}

void connectWiFi() {
  WiFi.mode(WIFI_STA);
  WiFi.hostname("SolariQ-NodeMCU");
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  lastWiFiAttempt = millis();

  Serial.printf("\n[WIFI] Connecting to '%s' ...\n", WIFI_SSID);
}

void maintainWiFi() {
  if (WiFi.status() == WL_CONNECTED) {
    return;
  }

  unsigned long now = millis();
  if (now - lastWiFiAttempt >= WIFI_RETRY_MS) {
    lastWiFiAttempt = now;
    Serial.println("[WIFI] Connection lost. Reconnecting to Wi-Fi...");
    WiFi.disconnect();
    WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  }
}

void setup() {
  Serial.begin(115200);
  delay(200);

  Serial.println("\n========================================================");
  Serial.println("  SolariQ Adaptive Canal-Agri IoT Prototype Firmware");
  Serial.println("  NodeMCU ESP8266 (ESP-12E) Controller");
  Serial.println("========================================================");

  digitalWrite(PUMP_IN1, LOW);
  digitalWrite(PUMP_IN2, LOW);
  digitalWrite(LED_PIN, LOW);

  pinMode(PUMP_IN1, OUTPUT);
  pinMode(PUMP_IN2, OUTPUT);
  pinMode(LED_PIN, OUTPUT);
  pinMode(SOIL_PIN, INPUT);

  pumpOff();
  setLed(false);

  connectWiFi();
}

void loop() {

  if (pumpRunning && (millis() - pumpStartedAt >= WATERING_DURATION_MS)) {
    pumpOff();
    setLed(false);
    Serial.println("[SAFETY] AWD 40-sec cycle complete -> Auto-latched pump OFF.");
  }

  maintainWiFi();

  if (WiFi.status() != WL_CONNECTED) {
    delay(10);
    return;
  }

  static bool announced = false;
  if (!announced) {
    announced = true;
    Serial.printf("[WIFI] Connected! Node IP: %s | Gateway: %s\n",
      WiFi.localIP().toString().c_str(),
      WiFi.gatewayIP().toString().c_str()
    );
    Serial.printf("[CONFIG] Backend Target: %s\n", API_BASE_URL);
  }

  unsigned long now = millis();

  if (now - lastCommandPoll >= COMMAND_POLL_MS) {
    lastCommandPoll = now;
    pollCommands();
  }

  if (now - lastStatusReport >= STATUS_REPORT_MS) {
    lastStatusReport = now;
    reportStatus();
  }

  delay(5);
}
