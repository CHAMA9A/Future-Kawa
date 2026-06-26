# Documentation MQTT — FutureKawa

## Qu'est-ce que MQTT ?

**MQTT (Message Queuing Telemetry Transport)** est un protocole de messagerie léger de type publish/subscribe, conçu pour les environnements à bande passante limitée et les objets connectés (IoT). Il fonctionne sur TCP/IP et repose sur un **broker** central qui achemine les messages entre les émetteurs (publishers) et les récepteurs (subscribers).

## Rôle de Mosquitto

**Eclipse Mosquitto** est un broker MQTT open-source léger. Dans FutureKawa, il fait le lien entre les capteurs IoT (ou les scripts de simulation) et les services backend pays.

---

## Un broker par pays

Chaque pays dispose de **son propre broker Mosquitto** :

| Conteneur | Port MQTT | Port WebSocket | Topic associé |
|---|---|---|---|
| `mosquitto-brazil` | 1883 | 9001 | `futurekawa/brazil/warehouse-1/measurements` |
| `mosquitto-ecuador` | 1884 | 9002 | `futurekawa/ecuador/warehouse-1/measurements` |
| `mosquitto-colombia` | 1885 | 9003 | `futurekawa/colombia/warehouse-1/measurements` |

Cette séparation garantit l'isolation des flux IoT par pays, sans risque de croisement de messages.

---

## Topics utilisés

Format du topic :

```
futurekawa/{country}/{warehouse}/measurements
```

Topics existants :

```
futurekawa/brazil/warehouse-1/measurements
futurekawa/ecuador/warehouse-1/measurements
futurekawa/colombia/warehouse-1/measurements
```

---

## Format du payload JSON

Les messages publiés sur ces topics doivent respecter le format suivant :

```json
{
  "warehouseName": "Warehouse Colombia 1",
  "temperature": 30,
  "humidity": 85
}
```

| Champ | Type | Obligatoire | Description |
|---|---|---|---|
| `warehouseName` | string | Oui | Nom de l'entrepôt |
| `temperature` | number | Oui | Température en degrés Celsius |
| `humidity` | number | Oui | Humidité relative en pourcentage |

---

## Simulation MQTT avec PowerShell

Vous pouvez simuler l'envoi de mesures sans matériel IoT en utilisant `mosquitto_pub` directement dans les conteneurs Docker.

### Brésil

```powershell
'{"warehouseName":"Warehouse Brazil 1","temperature":30,"humidity":85}' | docker exec -i mosquitto-brazil mosquitto_pub -h localhost -t futurekawa/brazil/warehouse-1/measurements -l
```

### Équateur

```powershell
'{"warehouseName":"Warehouse Ecuador 1","temperature":32,"humidity":75}' | docker exec -i mosquitto-ecuador mosquitto_pub -h localhost -t futurekawa/ecuador/warehouse-1/measurements -l
```

### Colombie

```powershell
'{"warehouseName":"Warehouse Colombia 1","temperature":25,"humidity":80}' | docker exec -i mosquitto-colombia mosquitto_pub -h localhost -t futurekawa/colombia/warehouse-1/measurements -l
```

### Test de dépassement de seuil (alerte attendue)

```powershell
'{"warehouseName":"Warehouse Brazil 1","temperature":35,"humidity":90}' | docker exec -i mosquitto-brazil mosquitto_pub -h localhost -t futurekawa/brazil/warehouse-1/measurements -l
```

> La température 35°C dépasse le seuil max du Brésil (32°C) et l'humidité 90% dépasse le seuil max (57%). Une alerte `TEMPERATURE` et une alerte `HUMIDITY` seront automatiquement créées.

---

## Création des mesures et alertes

Lorsqu'un message MQTT est reçu par un service pays :

1. Le service reçoit le message dans son `MqttService`, abonné au topic MQTT du pays.
2. Il **valide** le payload (présence et types des champs obligatoires).
3. Il appelle `MeasurementsService.create()` pour enregistrer la mesure en base.
4. `MeasurementsService` vérifie les **seuils de température et d'humidité** propres au pays.
5. Si un seuil est dépassé, une **alerte** est automatiquement créée en base.
6. Un email de notification est **simulé** dans les logs.

Architecture du traitement :

```
MQTT Message → MqttService (subscribe)
                    ↓
         MeasurementsService.create()
                    ↓
       Enregistrement mesure + vérification seuils
                    ↓
         Création alerte si dépassement
                    ↓
         Email simulé dans les logs
```

---

## Lien avec le prototype Arduino UNO + DHT11

### Matériel

- **Arduino UNO** (microcontrôleur)
- **Capteur DHT11** (température 0–50°C, humidité 20–90%)
- Pin data utilisée : **D7**
- Communication série à **9600 bauds**

### Code embarqué

Le firmware Arduino se trouve dans :

```
iot/arduino-dht11-sensor/futurekawa_dht11_serial.ino
```

Il lit les données du capteur DHT11 toutes les 5 secondes et les envoie sur le port série au format JSON :

```json
{"warehouseName":"Warehouse Brazil 1","temperature":27.5,"humidity":60.2}
```

### Bridge Serial-to-MQTT

L'Arduino UNO ne possédant pas de module Wi-Fi intégré, un **bridge Serial-to-MQTT** est nécessaire. Ce script, exécuté sur un PC connecté à l'Arduino via USB, lit les données série et les publie sur le broker Mosquitto du pays correspondant.

Documentation complète : `iot/arduino-dht11-sensor/serial-to-mqtt-bridge/README.md`

### Simulation sans Arduino

Il est possible de tester la chaîne MQTT complète sans matériel en utilisant les commandes PowerShell décrites plus haut dans cette documentation. Voir également :

```
iot/arduino-dht11-sensor/simulation-without-arduino.md
```

## Seuils d'alerte — Colombie (démonstration IoT réelle)

Les seuils d'alerte du service Colombia ont été temporairement adaptés pour la démonstration locale du prototype IoT réel (Arduino UNO + DHT11) :

| Mesure | Plage acceptable |
|---|---|
| Température | 30°C – 36°C |
| Humidité | 30% – 45% |

Les valeurs réelles observées dans la pièce de démonstration (≈34°C, ≈38%) sont désormais considérées comme normales. Une alerte est créée si la température est inférieure à 30°C ou supérieure à 36°C, ou si l'humidité est inférieure à 30% ou supérieure à 45%.

> **Note** : Ces seuils Colombia sont adaptés pour la démonstration locale du prototype IoT réel. Dans un contexte métier réel, les seuils peuvent être reconfigurés selon les conditions de stockage attendues.