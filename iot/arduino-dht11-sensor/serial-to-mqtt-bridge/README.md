# FutureKawa — Serial-to-MQTT Bridge

## Objectif

Cette passerelle permet d'intégrer les mesures physiques du capteur DHT11
directement dans la chaîne applicative FutureKawa sans modifier le backend.
Le PC lit les données série envoyées par l'Arduino UNO puis les publie
dans Mosquitto au format JSON attendu par les services pays.

## Architecture

```
Arduino UNO + DHT11 → USB Serial → Node.js bridge → Mosquitto MQTT
→ country backend → PostgreSQL → frontend
```

## Installation

```bash
cd iot/arduino-dht11-sensor/serial-to-mqtt-bridge
npm install
```

## Configuration

Copier le fichier d'exemple et ajuster les paramètres :

```bash
cp .env.example .env
```

### Paramètres .env

| Variable | Défaut | Description |
|---|---|---|
| `SERIAL_PORT` | `COM4` | Port série de l'Arduino (ex. COM3, COM5, /dev/ttyACM0) |
| `SERIAL_BAUD_RATE` | `9600` | Débit série (doit correspondre à l'Arduino) |
| `MQTT_URL` | `mqtt://localhost:1885` | URL du broker Mosquitto (port externe Colombia : 1885) |
| `MQTT_TOPIC` | `futurekawa/colombia/warehouse-1/measurements` | Topic MQTT cible |
| `WAREHOUSE_NAME` | `Warehouse Colombia 1` | Nom de l'entrepôt envoyé dans le payload |

### Modification du port COM

1. Brancher l'Arduino UNO en USB
2. Ouvrir Arduino IDE → Menu **Outils → Port**
3. Noter le port affiché (ex. COM3, COM5)
4. Mettre à jour `SERIAL_PORT` dans `.env`

## Lancement

```bash
npm start
```

### Logs attendus

```
Serial connected on COM4 at 9600 baud
MQTT connected to mqtt://localhost:1885
Arduino line: Humidity: 42.00%  Temperature: 27.50°C
Published to futurekawa/colombia/warehouse-1/measurements: {"warehouseName":"Warehouse Colombia 1","temperature":27.5,"humidity":42}
```

## Vérification dans l'application

1. Ouvrir le frontend FutureKawa : http://localhost:5173
2. Choisir **Colombia** dans le sélecteur de pays
3. Aller dans l'onglet **Mesures** : les relevés du capteur doivent apparaître
4. Aller dans l'onglet **Alertes** : si un seuil est dépassé, une alerte est créée

## Note importante

Si l'Arduino IDE Serial Monitor est ouvert, il peut bloquer le port COM.
**Fermer le Serial Monitor** avant de lancer la passerelle.

## Arrêt

Appuyer sur `Ctrl + C` pour arrêter la passerelle proprement.