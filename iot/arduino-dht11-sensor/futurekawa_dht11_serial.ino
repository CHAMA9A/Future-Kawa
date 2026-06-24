/**
 * FutureKawa — DHT11 Sensor Reader
 *
 * Ce programme lit la température et l'humidité depuis un capteur DHT11
 * branché sur un Arduino UNO et affiche les valeurs dans le Serial Monitor.
 *
 * Matériel :
 *   - Arduino UNO
 *   - Capteur DHT11 (module 3 broches)
 *
 * Connexions :
 *   DHT11 +  → Arduino 5V
 *   DHT11 OUT → Arduino D7
 *   DHT11 -   → Arduino GND
 *
 * Débit série : 9600 bauds
 *
 * Architecture FutureKawa :
 *   Les données lues ici sont destinées à être transmises vers Mosquitto MQTT
 *   via une passerelle série (Serial-to-MQTT) ou une évolution vers ESP32.
 */

#include <DHT.h>

#define DHTPIN 7
#define DHTTYPE DHT11

DHT dht(DHTPIN, DHTTYPE);

void setup() {
  Serial.begin(9600);
  dht.begin();
}

void loop() {
  float h = dht.readHumidity();
  float t = dht.readTemperature();

  Serial.print("Humidity: ");
  Serial.print(h);
  Serial.print("%  Temperature: ");
  Serial.print(t);
  Serial.println("°C");

  delay(500);
}