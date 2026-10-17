#include <Servo.h>

const uint8_t TRIGGER_PIN = 2;
const uint8_t SERVO_PIN   = 9;
const uint8_t ONBOARD_LED = 13;

const int REST_ANGLE    = 0;
const int CONTACT_ANGLE = 60;

enum State { WAIT_FOR_TRIGGER, RUNNING, RETURNING };
State state = WAIT_FOR_TRIGGER;

unsigned long actionStartTime = 0;
const unsigned long RUN_DURATION_MS = 9400UL;

Servo switchServo;

void moveToAngle(int angle) {
  switchServo.attach(SERVO_PIN);
  switchServo.write(angle);
  delay(600);
  switchServo.detach();
}

void setup() {
  Serial.begin(9600);
  Serial.println("\n[SOLARIQ] Servo Controller Ready.");

  pinMode(TRIGGER_PIN, INPUT);
  pinMode(ONBOARD_LED, OUTPUT);
  digitalWrite(ONBOARD_LED, LOW);

  switchServo.attach(SERVO_PIN);
  switchServo.detach();

  Serial.println("[WAIT] Idle. Servo silent. Waiting for trigger...");
}

void loop() {
  int triggerState = digitalRead(TRIGGER_PIN);

  switch (state) {

    case WAIT_FOR_TRIGGER:
      if (triggerState == HIGH) {
        delay(30);
        if (digitalRead(TRIGGER_PIN) == HIGH) {
          state = RUNNING;
          actionStartTime = millis();
          digitalWrite(ONBOARD_LED, HIGH);
          Serial.println("\n[RUN] Trigger received! Closing switch...");
          moveToAngle(CONTACT_ANGLE);
          Serial.println("[RUN] Contact made. Motor ON!");
        }
      }
      break;

    case RUNNING:
      if (millis() - actionStartTime >= RUN_DURATION_MS) {
        state = RETURNING;
        Serial.println("[TIMER] 9.4s done. Returning servo to REST...");
        moveToAngle(REST_ANGLE);
        digitalWrite(ONBOARD_LED, LOW);
        Serial.println("[RETURN] Servo at REST. Motor OFF. Waiting for pin to go LOW...");
      }
      break;

    case RETURNING:
      if (triggerState == LOW) {
        state = WAIT_FOR_TRIGGER;
        Serial.println("[READY] Pin LOW confirmed. Ready for next command!\n");
      }
      break;
  }

  delay(20);
}
