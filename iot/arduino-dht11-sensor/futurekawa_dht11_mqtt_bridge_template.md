# FutureKawa — Serial-to-MQTT Bridge

## Limite de l'Arduino UNO

L'Arduino UNO ne possède pas de module Wi-Fi intégré. Il ne peut donc pas
publier directement des messages MQTT sur le réseau.

Pour connecter le capteur DHT11 à l'infrastructure Mosquitto FutureKawa,
une passerelle est nécessaire.

## Solutions possibles

### 1. Arduino UNO + script PC Serial-to-MQTT (recommandée avec le matériel actuel)

L'Arduino UNO est connecté au PC via USB. Un script (Python, Node.js, etc.)
lit les données depuis le port série et les publie sur le broker MQTT.

```
Arduino UNO + DHT11 → USB Serial → PC → script MQTT → Mosquitto FutureKawa
```

Cette solution ne nécessite aucun matériel supplémentaire.

### 2. Arduino UNO + module Wi-Fi ESP8266

Ajouter un module ESP8266 (ex. ESP-01) à l'Arduino UNO pour lui donner
une connexion Wi-Fi. L'Arduino envoie les données au module via des
commandes AT, et le module les publie en MQTT.

Cette solution nécessite :
- un module ESP8266
- une alimentation supplémentaire (le module consomme plus de courant)

### 3. Remplacement par ESP32 ou ESP8266

Remplacer l'Arduino UNO par une carte disposant du Wi-Fi intégré :
- **ESP32** : Wi-Fi + Bluetooth, double cœur, idéal pour l'IoT
- **ESP8266** : plus simple et moins cher, Wi-Fi uniquement

Ces cartes peuvent publier directement en MQTT sans passerelle.
Le code existant peut être adapté avec la librairie `PubSubClient`.

## Payload MQTT attendu

Quelle que soit la solution choisie, le payload doit respecter le format
attendu par les backends FutureKawa :

```json
{
  "warehouseName": "Warehouse Colombia 1",
  "temperature": 30,
  "humidity": 85
}
```

Topic MQTT cible :

```
futurekawa/colombia/warehouse-1/measurements
```

Port MQTT (Colombia, côté Docker) :

```
1885
```

## Adresse du broker

Ne pas utiliser `localhost` depuis une carte externe. Utiliser l'adresse IP
locale de la machine hébergeant Docker, par exemple :

```
192.168.1.25
```

## Évolution future

L'architecture FutureKawa est conçue pour accepter n'importe quelle source
de mesures respectant le format JSON attendu sur les topics MQTT.
Le pont série-vers-MQTT est la solution la plus rapide à mettre en œuvre
avec le matériel actuel (Arduino UNO + DHT11).