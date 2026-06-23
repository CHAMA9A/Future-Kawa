# FutureKawa — IoT Sensor Prototype (Arduino UNO + DHT11)

## Rôle dans le projet

Le prototype IoT Arduino UNO + DHT11 permet de mesurer la température et
l'humidité d'un environnement de stockage. Le code embarqué lit les données
du capteur et les affiche via le moniteur série. L'architecture FutureKawa
est prête à recevoir ces mesures via MQTT, soit par une passerelle
série-vers-MQTT, soit par une évolution vers une carte ESP32.

## Matériel utilisé

| Composant | Référence | Rôle |
|---|---|---|
| Carte | Arduino UNO | Microcontrôleur de lecture |
| Capteur | DHT11 (module 3 broches) | Mesure température + humidité |
| Câble | USB A → USB B | Liaison PC ↔ Arduino |
| Pin data | D7 | Signal du capteur |

## Câblage général

```
DHT11 +  → Arduino 5V
DHT11 OUT → Arduino D7
DHT11 -   → Arduino GND
```

## Code Arduino

Le fichier `futurekawa_dht11_serial.ino` contient le programme embarqué :

- Initialisation du capteur DHT11 sur la broche D7
- Lecture de l'humidité et de la température chaque 500 ms
- Affichage des valeurs dans le Serial Monitor (9600 bauds)

## Lecture des valeurs

1. Brancher l'Arduino UNO en USB
2. Ouvrir le Serial Monitor (Arduino IDE ou outil série)
3. Régler le débit à **9600 bauds**
4. Observer les relevés :

```
Humidity: 65.00%  Temperature: 24.00°C
Humidity: 65.00%  Temperature: 24.00°C
```

## Vers MQTT

**Limite actuelle :** L'Arduino UNO ne dispose pas de Wi-Fi intégré. Il ne
peut pas publier directement sur le broker Mosquitto.

Pour intégrer les mesures dans FutureKawa, deux options :

1. **Passerelle série** : un script Node.js sur le PC lit le port série et
   publie vers Mosquitto (solution recommandée avec le matériel actuel)
2. **Évolution ESP32** : remplacer l'Arduino UNO par une carte ESP32 qui
   peut publier directement en MQTT

### Passerelle Serial-to-MQTT (disponible)

Un bridge Node.js prêt à l'emploi se trouve dans `serial-to-mqtt-bridge/` :

```bash
cd serial-to-mqtt-bridge
cp .env.example .env
# Modifier SERIAL_PORT dans .env
npm install
npm start
```

Le script lit automatiquement les lignes du Serial Monitor, extrait la
température et l'humidité, et publie le payload JSON vers Mosquitto.

Voir `serial-to-mqtt-bridge/README.md` pour les détails.

Voir `futurekawa_dht11_mqtt_bridge_template.md` pour les alternatives.

## Structure du dossier

```
iot/arduino-dht11-sensor/
├── futurekawa_dht11_serial.ino           # Code Arduino
├── futurekawa_dht11_mqtt_bridge_template.md  # Passerelle MQTT
├── README.md                             # Ce fichier
├── installation-guide.md                 # Guide d'installation
├── wiring-diagram.md                     # Schéma de câblage
├── libraries.md                          # Librairies requises
├── mqtt-payload.md                       # Format MQTT
├── simulation-without-arduino.md         # Simulation sans carte
└── serial-to-mqtt-bridge/               # Pont série → MQTT
    ├── package.json
    ├── .env.example
    ├── serial-to-mqtt.js
    └── README.md
```