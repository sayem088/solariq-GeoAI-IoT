#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>
#include <WiFiClientSecure.h>
#include <ArduinoJson.h>

const char* WIFI_SSID     = "caem";
const char* WIFI_PASSWORD = "sayemsarker";

const char* API_BASE_URL  = "http://192.168.9.178:3000";

const char* DEVICE_TOKEN  = "solariq-kurigram-token-2027";
const char* DEVICE_ID     = "work-demo-01";

const uint8_t TRIGGER_PIN = D1;
const uint8_t LED_PIN     = D6;

const unsigned long MOTOR_DURATION_MS  = 10000UL;
const unsigned long POLL_INTERVAL_MS   = 3000UL;
const unsigned long STATUS_INTERVAL_MS = 5000UL;
const unsigned long HEARTBEAT_MS       = 2000UL;

bool motorRunning    = false;
unsigned long motorStartedAt = 0;

unsigned long lastPoll     = 0;
unsigned long lastStatus   = 0;
unsigned long lastBlink    = 0;
bool ledBlinkState = true;

String lastCommandId = "";

void motorOff() {
  digitalWrite(TRIGGER_PIN, LOW);
  motorRunning = false;
  digitalWrite(LED_PIN, HIGH);
  Serial.println("[TRIGGER] Stopped. D6 LED back ON.");
}

void motorOn() {
  if (motorRunning) return;
  digitalWrite(LED_PIN, LOW);
  digitalWrite(TRIGGER_PIN, HIGH);
  motorStartedAt = millis();
  motorRunning = true;
  Serial.println("[TRIGGER] Started for 10 seconds. D6 LED OFF.");
}

bool beginHttpClient(HTTPClient& http, WiFiClient& plainClient, WiFiClientSecure& secureClient, const String& url) {
  if (url.startsWith("https://")) {
    secureClient.setInsecure();
    return http.begin(secureClient, url);
  } else {
    return http.begin(plainClient, url);
  }
}

void pollCommands() {
  if (WiFi.status() != WL_CONNECTED) return;

  WiFiClient plainClient;
  WiFiClientSecure secureClient;
  HTTPClient http;

  String url = String(API_BASE_URL) + "/api/iot/device/commands";
  if (!beginHttpClient(http, plainClient, secureClient, url)) return;
  http.setTimeout(5000);
  http.addHeader("Authorization", String("Bearer ") + DEVICE_TOKEN);
  http.addHeader("X-Device-ID", DEVICE_ID);

  int code = http.GET();

  if (code == 200) {
    String body = http.getString();
    JsonDocument doc;
    if (!deserializeJson(doc, body)) {
      String action = doc["action"] | "none";
      String commandId = doc["commandId"] | "";

      if (action != "none" && commandId.length() > 0 && commandId != lastCommandId) {
        lastCommandId = commandId;

        if (action == "run_motor") {
          Serial.printf("[CMD] run_motor received (id: %s)\n", commandId.c_str());
          motorOn();

          sendAck(commandId, "started");
        }
      }
    }
  } else {
    Serial.printf("[POLL] HTTP %d\n", code);
  }

  http.end();
}

void sendAck(const String& commandId, const String& result) {
  if (WiFi.status() != WL_CONNECTED) return;

  WiFiClient plainClient;
  WiFiClientSecure secureClient;
  HTTPClient http;

  String url = String(API_BASE_URL) + "/api/iot/device/commands/ack";
  if (!beginHttpClient(http, plainClient, secureClient, url)) return;
  http.setTimeout(5000);
  http.addHeader("Content-Type", "application/json");
  http.addHeader("Authorization", String("Bearer ") + DEVICE_TOKEN);

  JsonDocument doc;
  doc["deviceId"]  = DEVICE_ID;
  doc["commandId"] = commandId;
  doc["result"]    = result;

  String body;
  serializeJson(doc, body);
  int code = http.POST(body);
  Serial.printf("[ACK] %s → HTTP %d\n", result.c_str(), code);
  http.end();
}

void reportStatus() {
  if (WiFi.status() != WL_CONNECTED) return;

  WiFiClient plainClient;
  WiFiClientSecure secureClient;
  HTTPClient http;

  String url = String(API_BASE_URL) + "/api/iot/device/status";
  if (!beginHttpClient(http, plainClient, secureClient, url)) return;
  http.setTimeout(5000);
  http.addHeader("Content-Type", "application/json");
  http.addHeader("Authorization", String("Bearer ") + DEVICE_TOKEN);

  unsigned long remaining = 0;
  if (motorRunning) {
    unsigned long elapsed = millis() - motorStartedAt;
    remaining = elapsed < MOTOR_DURATION_MS ? (MOTOR_DURATION_MS - elapsed) / 1000 : 0;
  }

  JsonDocument doc;
  doc["deviceId"]        = DEVICE_ID;
  doc["pump"]            = motorRunning;
  doc["led"]             = !motorRunning;
  doc["selectedGrid"]    = 1;
  doc["remainingSeconds"] = (int)remaining;
  doc["moisture"]        = 0;
  doc["rssi"]            = WiFi.RSSI();

  String body;
  serializeJson(doc, body);

  int code = http.POST(body);
  if (code >= 200 && code < 300) {
    Serial.printf("[STATUS] Motor=%s, LED=%s, WiFi RSSI=%d dBm\n",
      motorRunning ? "ON" : "OFF",
      motorRunning ? "OFF" : "ON",
      WiFi.RSSI()
    );
  }
  http.end();
}

void setup() {
  Serial.begin(115200);
  delay(200);

  Serial.println("\n========================================");
  Serial.println("  SolariQ Work Demo — ESP8266 Firmware");
  Serial.println("========================================");

  digitalWrite(TRIGGER_PIN, LOW);
  digitalWrite(LED_PIN, LOW);

  pinMode(TRIGGER_PIN, OUTPUT);
  pinMode(LED_PIN, OUTPUT);

  WiFi.mode(WIFI_STA);
  WiFi.hostname("SolariQ-WorkDemo");
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  Serial.printf("[WIFI] Connecting to '%s'", WIFI_SSID);
  unsigned long t = millis();
  while (WiFi.status() != WL_CONNECTED && millis() - t < 20000) {
    delay(300);
    Serial.print(".");

    digitalWrite(LED_PIN, !digitalRead(LED_PIN));
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.printf("\n[WIFI] Connected! IP: %s\n", WiFi.localIP().toString().c_str());
    Serial.printf("[CONFIG] API: %s\n", API_BASE_URL);
    digitalWrite(LED_PIN, HIGH);
  } else {
    Serial.println("\n[WIFI] Failed to connect. Running offline (local failsafe only).");

  }
}

void loop() {
  unsigned long now = millis();

  if (motorRunning && (now - motorStartedAt >= MOTOR_DURATION_MS)) {
    motorOff();
    Serial.println("[SAFETY] 10-second motor cycle complete.");
  }

  if (now - lastPoll >= POLL_INTERVAL_MS) {
    lastPoll = now;
    pollCommands();
  }

  if (now - lastStatus >= STATUS_INTERVAL_MS) {
    lastStatus = now;
    reportStatus();
  }

  if (!motorRunning && WiFi.status() == WL_CONNECTED) {
    if (now - lastBlink >= HEARTBEAT_MS) {
      lastBlink = now;
      digitalWrite(LED_PIN, LOW);
      delay(100);
      digitalWrite(LED_PIN, HIGH);
    }
  }

  delay(5);
}
