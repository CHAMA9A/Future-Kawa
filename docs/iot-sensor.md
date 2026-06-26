# FutureKawa — Documentation technique IoT

## Objectif de la partie IoT

La partie IoT du projet FutureKawa permet de mesurer en temps réel la
température et l'humidité des entrepôts de stockage de café vert.
Les données sont collectées par des capteurs DHT11, transmises via MQTT,
stockées en base PostgreSQL et visualisées dans le dashboard React.

## Matériel utilisé

| Composant | Référence | Quantité |
|---|---|---|
| Carte microcontrôleur | Arduino UNO | 1 |
| Capteur température/humidité | DHT11 (module 3 broches) | 1 |
| Câble USB | USB A → USB B | 1 |

## Architecture IoT

```
Arduino UNO + DHT11
→ Serial-to-MQTT Bridge (Node.js)
→ Mosquitto MQTT
→ backend pays (NestJS)
→ PostgreSQL
→ backend central
→ frontend dashboard
```

### Contrainte matérielle

L'Arduino UNO ne possède pas de module Wi-Fi intégré. Les données lues par
le capteur sont affichées sur le port série USB. Pour les transmettre à
Mosquitto MQTT, une passerelle est nécessaire (script PC Serial-to-MQTT,
module ESP8266, ou remplacement par ESP32).

## Fonctionnement du DHT11

Le DHT11 est un capteur numérique bas coût qui mesure :

- **Température** : plage 0°C à 50°C, précision ±2°C
- **Humidité relative** : plage 20% à 90%, précision ±5%

Il utilise un protocole de communication sur une seule broche data.
La librairie Adafruit DHT sensor library gère ce protocole et retourne
les valeurs directement.

## Lecture via Arduino UNO

Le code Arduino (`futurekawa_dht11_serial.ino`) :

1. Initialise le capteur DHT11 sur la broche D7
2. Lit la température et l'humidité
3. Affiche les valeurs dans le Serial Monitor à 9600 bauds
4. Répète toutes les 500 ms

```cpp
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
```

## Limite Arduino UNO sans Wi-Fi

L'Arduino UNO est une carte performante pour la lecture de capteurs,
mais elle ne peut pas communiquer directement sur un réseau IP.
Pour envoyer les données vers MQTT, trois options :

1. **Script Serial-to-MQTT** sur le PC hôte (solution immédiate)
2. **Module ESP8266** ajouté à l'Arduino UNO
3. **Remplacement par ESP32** (Wi-Fi + MQTT natif)

## Intégration MQTT prévue

Le payload attendu par les backends FutureKawa :

```json
{
  "warehouseName": "Warehouse Colombia 1",
  "temperature": 30,
  "humidity": 85
}
```

Topic MQTT cible : `futurekawa/{country}/warehouse-1/measurements`

## Real-time Serial-to-MQTT integration

La passerelle Serial-to-MQTT permet d'intégrer les mesures physiques du
capteur DHT11 directement dans la chaîne applicative FutureKawa sans
modifier le backend. Le PC lit les données série envoyées par l'Arduino
UNO puis les publie dans Mosquitto au format JSON attendu par les
services pays.

### Fonctionnement

1. L'Arduino UNO lit le capteur DHT11 et affiche les valeurs sur le port
   série USB à 9600 bauds
2. Le script Node.js (`serial-to-mqtt-bridge/serial-to-mqtt.js`) lit ce
   port série en continu
3. Il parse chaque ligne au format `Humidity: XX%  Temperature: YY°C`
4. Il construit le payload JSON `{"warehouseName", "temperature", "humidity"}`
5. Il publie le payload sur le topic MQTT configuré
6. Le backend pays reçoit la mesure, la stocke et vérifie les seuils

### Emplacement du script

```
iot/arduino-dht11-sensor/serial-to-mqtt-bridge/
├── package.json
├── .env.example
├── serial-to-mqtt.js
└── README.md
```

### Utilisation

```bash
cd iot/arduino-dht11-sensor/serial-to-mqtt-bridge
cp .env.example .env
# Modifier SERIAL_PORT dans .env (ex: COM3)
npm install
npm start
```

### Logs attendus

```
Serial connected on COM4 at 9600 baud
MQTT connected to mqtt://localhost:1885
Arduino line: Humidity: 42.00%  Temperature: 27.50°C
Published to futurekawa/colombia/warehouse-1/measurements: {"warehouseName":"Warehouse Colombia 1","temperature":27.5,"humidity":42}
```

Voir la documentation complète dans :
`iot/arduino-dht11-sensor/serial-to-mqtt-bridge/README.md`

## Simulation MQTT actuelle

Sans matériel Arduino, la chaîne complète peut être testée en publiant
directement sur Mosquitto via `docker exec` :

```powershell
'{"warehouseName":"Warehouse Colombia 1","temperature":30,"humidity":85}' | docker exec -i mosquitto-colombia mosquitto_pub -h localhost -t futurekawa/colombia/warehouse-1/measurements -l
```

Voir `iot/arduino-dht11-sensor/simulation-without-arduino.md` pour les
détails.

## Flux FutureKawa complet

```
                    ┌──────────────────┐
                    │   DHT11 Sensor   │
                    │  (temp + hum)    │
                    └────────┬─────────┘
                             │ Pin D7
                    ┌────────▼─────────┐
                    │   Arduino UNO    │
                    │  Serial Monitor  │
                    └────────┬─────────┘
                             │ USB / Serial-to-MQTT Bridge
                    ┌────────▼─────────┐
                    │   Mosquitto MQTT │
                    │   (3 brokers)    │
                    └────────┬─────────┘
                             │ Subscribe
                    ┌────────▼─────────┐
                    │  Backend pays    │
                    │  (NestJS + MQTT) │
                    └────────┬─────────┘
                             │ Prisma
                    ┌────────▼─────────┐
                    │   PostgreSQL     │
                    └────────┬─────────┘
                             │ HTTP REST
                    ┌────────▼─────────┐
                    │ Backend central  │
                    │  (NestJS)        │
                    └────────┬─────────┘
                             │ HTTP REST
                    ┌────────▼─────────┐
                    │   Frontend       │
                    │  (React + Vite)  │
                    └──────────────────┘
```

## Seuils d'alerte — Colombie (démonstration IoT réelle)

Les seuils d'alerte du service Colombia ont été temporairement adaptés pour la démonstration locale du prototype IoT réel (Arduino UNO + DHT11) :

| Mesure | Plage acceptable |
|---|---|
| Température | 30°C – 36°C |
| Humidité | 30% – 45% |

Les valeurs réelles observées dans la pièce de démonstration (≈34°C, ≈38%) sont désormais considérées comme normales.

> **Note** : Ces seuils Colombia sont adaptés pour la démonstration locale du prototype IoT réel. Dans un contexte métier réel, les seuils peuvent être reconfigurés selon les conditions de stockage attendues.

## Documentation connexe

- [Prototype IoT](iot/arduino-dht11-sensor/README.md)
- [Installation](iot/arduino-dht11-sensor/installation-guide.md)
- [Câblage](iot/arduino-dht11-sensor/wiring-diagram.md)
- [Librairies](iot/arduino-dht11-sensor/libraries.md)
- [Payload MQTT](iot/arduino-dht11-sensor/mqtt-payload.md)
- [Passerelle MQTT](iot/arduino-dht11-sensor/futurekawa_dht11_mqtt_bridge_template.md)
- [Serial-to-MQTT Bridge](iot/arduino-dht11-sensor/serial-to-mqtt-bridge/README.md)
- [Simulation](iot/arduino-dht11-sensor/simulation-without-arduino.md)