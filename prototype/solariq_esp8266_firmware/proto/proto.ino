#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>
#include <WiFiClientSecure.h>
#include <ArduinoJson.h>

const char* WIFI_SSID     = "Labonno";
const char* WIFI_PASSWORD = "Farhana@israt";

const char* API_BASE_URL  = "https://solariq-green.vercel.app";

const char* DEVICE_ID     = "proto-esp-01";

const uint8_t TRIGGER_PIN = D1;
const uint8_t LED_PIN     = D6;

const unsigned long POLL_INTERVAL_MS     = 3000UL;
const unsigned long HEARTBEAT_INTERVAL_MS = 5000UL;

bool       pumpRunning   = false;
unsigned long pumpStartedAt = 0;
unsigned long pumpDurationMs = 0;
String     lastCommandId = "";

unsigned long lastPoll      = 0;
unsigned long lastHeartbeat = 0;

bool beginHttpClient(HTTPClient& http, WiFiClient& plain, WiFiClientSecure& secure, const String& url) {
  if (url.startsWith("https://")) {
    secure.setInsecure();
    return http.begin(secure, url);
  }
  return http.begin(plain, url);
}

void setup() {
  Serial.begin(115200);
  delay(200);

  pinMode(TRIGGER_PIN, OUTPUT);
  pinMode(LED_PIN, OUTPUT);
  digitalWrite(TRIGGER_PIN, LOW);
  digitalWrite(LED_PIN, HIGH);

  Serial.println("\n[SOLARIQ PROTO] Booting...");

  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("[WiFi] Connecting");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.printf("\n[WiFi] Connected! IP: %s\n", WiFi.localIP().toString().c_str());
}

void startPump(unsigned long durationSeconds, const String& commandId) {
  pumpDurationMs  = durationSeconds * 1000UL;
  pumpStartedAt   = millis();
  pumpRunning     = true;
  lastCommandId   = commandId;

  digitalWrite(TRIGGER_PIN, HIGH);
  digitalWrite(LED_PIN, LOW);

  Serial.printf("[PUMP] Started for %lu seconds (cmd: %s)\n", durationSeconds, commandId.c_str());
}

void stopPump() {
  pumpRunning = false;
  digitalWrite(TRIGGER_PIN, LOW);
  digitalWrite(LED_PIN, HIGH);
  Serial.println("[PUMP] Stopped. LED back ON.");
}

void pollCommands() {
  if (WiFi.status() != WL_CONNECTED) return;

  WiFiClient plain;
  WiFiClientSecure secure;
  HTTPClient http;

  String url = String(API_BASE_URL) + "/api/proto/commands";
  if (!beginHttpClient(http, plain, secure, url)) return;
  http.setTimeout(5000);
  http.addHeader("X-Device-ID", DEVICE_ID);

  int code = http.GET();
  if (code == 200) {
    String body = http.getString();
    JsonDocument doc;
    if (!deserializeJson(doc, body)) {
      String action    = doc["action"] | "none";
      String commandId = doc["commandId"] | "";
      unsigned long dur = doc["durationSeconds"] | 0;

      if (action == "run_pump" && commandId.length() > 0 && commandId != lastCommandId && !pumpRunning) {
        Serial.printf("[CMD] run_pump received (dur: %lus, id: %s)\n", dur, commandId.c_str());
        startPump(dur, commandId);

        sendHeartbeat();
      }
    }
  } else {
    Serial.printf("[POLL] HTTP %d\n", code);
  }
  http.end();
}

void sendHeartbeat() {
  if (WiFi.status() != WL_CONNECTED) return;

  WiFiClient plain;
  WiFiClientSecure secure;
  HTTPClient http;

  String url = String(API_BASE_URL) + "/api/proto/status";
  if (!beginHttpClient(http, plain, secure, url)) return;
  http.setTimeout(5000);
  http.addHeader("Content-Type", "application/json");

  unsigned long remaining = 0;
  if (pumpRunning) {
    unsigned long elapsed = millis() - pumpStartedAt;
    remaining = elapsed < pumpDurationMs ? (pumpDurationMs - elapsed) / 1000 : 0;
  }

  JsonDocument doc;
  doc["deviceId"]        = DEVICE_ID;
  doc["running"]         = pumpRunning;
  doc["commandId"]       = lastCommandId;
  doc["remainingSeconds"] = (int)remaining;
  doc["rssi"]            = WiFi.RSSI();

  String body;
  serializeJson(doc, body);

  int code = http.POST(body);
  Serial.printf("[HB] running=%s remaining=%lus HTTP=%d\n",
    pumpRunning ? "YES" : "NO", remaining, code);
  http.end();
}

void loop() {
  unsigned long now = millis();

  if (pumpRunning && (now - pumpStartedAt >= pumpDurationMs)) {
    stopPump();
  }

  if (now - lastPoll >= POLL_INTERVAL_MS) {
    lastPoll = now;
    if (!pumpRunning) {
      pollCommands();
    }
  }

  if (now - lastHeartbeat >= HEARTBEAT_INTERVAL_MS) {
    lastHeartbeat = now;
    sendHeartbeat();
  }
}
