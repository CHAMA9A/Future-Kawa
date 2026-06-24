# FutureKawa — Supervision des stocks de café vert

Plateforme de monitoring centralisé pour la gestion des stocks de café vert, avec connectivité IoT (MQTT) pour les relevés de température et d'humidité dans les entrepôts.

## Architecture

```
                    +-------------------+
                    |     Frontend      |
                    |    (React/Vite)   |
                    |    Port 5173      |
                    +--------+----------+
                             |
                    +--------+----------+
                    |  Backend Central   |
                    |     (NestJS)       |
                    |    Port 3002       |
                    +--------+----------+
                             |
          +------------------+------------------+
          |                  |                  |
+---------+--------+ +------+--------+ +------+--------+
| brazil-service   | | ecuador-serv. | | colombia-serv.|
| (NestJS) 3001    | | (NestJS) 3011 | | (NestJS) 3012 |
+---------+--------+ +------+--------+ +------+--------+
| Postgres | Mosq. | | Postgres|Mosq.| | Postgres|Mosq.|
|  :5432   | :1883 | |  :5433  |:1884| |  :5434  |:1885|
+---------+--------+ +------+--------+ +------+--------+
```

### Services

| Service | Technologie | Port |
|---|---|---|
| **frontend** | React + Vite + TypeScript | 5173 |
| **backend-central** | NestJS (siège) | 3002 |
| **brazil-service** | NestJS + Prisma + PostgreSQL | 3001 |
| **ecuador-service** | NestJS + Prisma + PostgreSQL | 3011 |
| **colombia-service** | NestJS + Prisma + PostgreSQL | 3012 |
| **postgres-*** | PostgreSQL 15 | 5432-5434 |
| **mosquitto-*** | Eclipse Mosquitto (MQTT) | 1883-1885 |

## Démarrage

```bash
docker compose up -d --build
```

Accès : http://localhost:5173

## Testing

### Tests unitaires automatisés

Chaque service dispose de tests automatisés :

```bash
# Backends pays
cd backend-country/brazil-service && npm test
cd backend-country/ecuador-service && npm test
cd backend-country/colombia-service && npm test

# Backend central
cd backend-central && npm test

# Frontend
cd frontend && npm test
```

### Tests manuels

Les scénarios de test manuels complets sont documentés dans :

➡️ [docs/tests.md](docs/tests.md)

Ils couvrent :
- Test Docker Compose (démarrage des containers)
- Création de lots (POST /api/lots)
- Récupération FIFO (GET /api/lots/fifo)
- Publication MQTT (mosquitto_pub)
- Vérification des alertes et seuils
- Backend central (routes d'agrégation)
- Frontend (dashboard, sélection pays, données)

## CI/CD with Jenkins

Un pipeline Jenkins est configuré pour valider automatiquement le projet.

### Jenkinsfile

Le fichier [Jenkinsfile](Jenkinsfile) à la racine définit le pipeline complet.

### Résumé des stages

| Stage | Description |
|---|---|
| Checkout | Récupération du code depuis Git |
| Environment Information | Affichage des versions (Node.js, npm, Docker) |
| Install Dependencies | `npm ci` dans chaque service (parallèle) |
| Generate Prisma Clients | `npx prisma generate` pour chaque backend pays (parallèle) |
| Run Backend Tests | `npm test` dans les 4 backends (parallèle, `jest --runInBand`) |
| Run Frontend Tests | `npm run test -- --run` (vitest) |
| Build Frontend | `npm run build` (TypeScript + Vite) |
| Validate Docker Compose | `docker compose config` |
| Docker Build Check | `docker compose build` (optionnel, activable via `BUILD_DOCKER=true`) |

### Commande principale des tests exécutée par le pipeline

```bash
# Backends pays
npm --prefix backend-country/brazil-service test
npm --prefix backend-country/ecuador-service test
npm --prefix backend-country/colombia-service test
npm --prefix backend-central test
npm --prefix frontend run test -- --run
```

Tous les tests utilisent `jest --runInBand` pour éviter les problèmes mémoire.

### Documentation complète

➡️ [docs/jenkins-ci.md](docs/jenkins-ci.md)

## IoT Sensor Prototype

Un prototype IoT basé sur **Arduino UNO + DHT11** permet la mesure en temps
réel de la température et de l'humidité dans les entrepôts de stockage.

### Caractéristiques

- Capteur DHT11 (température 0–50°C, humidité 20–90%)
- Pin data utilisée : D7
- Communication série à 9600 bauds
- Code embarqué dans `iot/arduino-dht11-sensor/futurekawa_dht11_serial.ino`

### Contenu du dossier IoT

```
iot/arduino-dht11-sensor/
├── futurekawa_dht11_serial.ino           # Code Arduino
├── futurekawa_dht11_mqtt_bridge_template.md  # Passerelle série → MQTT
├── README.md                             # Documentation du prototype
├── installation-guide.md                 # Installation Arduino IDE
├── wiring-diagram.md                     # Schéma de câblage
├── libraries.md                          # Librairies requises
├── mqtt-payload.md                       # Format des messages MQTT
└── simulation-without-arduino.md         # Simulation MQTT sans carte
```

### Real-time Serial-to-MQTT integration

La passerelle Serial-to-MQTT dans `serial-to-mqtt-bridge/` permet
d'intégrer les mesures physiques du capteur DHT11 directement dans
la chaîne applicative FutureKawa sans modifier le backend.

Le PC lit les données série envoyées par l'Arduino UNO via USB
puis les publie dans Mosquitto au format JSON attendu par les
services pays.

Documentation complète : [serial-to-mqtt-bridge/README.md](iot/arduino-dht11-sensor/serial-to-mqtt-bridge/README.md)

### Limite actuelle

L'Arduino UNO ne possède pas de module Wi-Fi intégré.
Pour publier vers Mosquitto, une passerelle série est nécessaire
(script PC Serial-to-MQTT, module ESP8266, ou remplacement par ESP32).

### Simulation sans Arduino

La chaîne MQTT complète peut être testée sans matériel :

```powershell
'{"warehouseName":"Warehouse Colombia 1","temperature":30,"humidity":85}' | docker exec -i mosquitto-colombia mosquitto_pub -h localhost -t futurekawa/colombia/warehouse-1/measurements -l
```

### Documentation

- Documentation technique : [docs/iot-sensor.md](docs/iot-sensor.md)
- Simulation : [iot/arduino-dht11-sensor/simulation-without-arduino.md](iot/arduino-dht11-sensor/simulation-without-arduino.md)

## Technical Documentation

| Document | Description |
|---|---|
| [Architecture](docs/architecture.md) | Architecture microservices, flux de données, ports et rôles |
| [Base de données](docs/database.md) | Modèles PostgreSQL, Prisma ORM, enums, règles FIFO et péremption |
| [MQTT / IoT](docs/mqtt-documentation.md) | Protocole MQTT, Mosquitto, topics, simulation et Arduino |
| [Frontend](docs/frontend.md) | Dashboard React, composants, communication API |
| [Docker / Déploiement](docs/docker-deployment.md) | Docker Compose, conteneurs, ports, volumes et troubleshooting |
| [Tests](docs/testing.md) | Stratégie de tests, commandes d'exécution |
| [API / Swagger](docs/api-documentation.md) | Documentation Swagger, routes et endpoints |
| [Choix techniques](docs/technical-choices.md) | Justification des technologies et perspectives d'évolution |

## User and Project Documentation

| Document | Description |
|---|---|
| [Guide utilisateur](docs/user-guide.md) | Prise en main de l'application, navigation dans le dashboard, dépannage simple |
| [Questionnaire phase 2](docs/phase-2-questionnaire.md) | Questionnaire de préparation à l'évolution du projet |
| [Schéma d'automatisation](docs/automation-schema.md) | Vision future de l'automatisation des actionneurs et de la régulation |
| [Accompagnement au changement](docs/change-management.md) | Stratégie de déploiement, formation et adoption par les utilisateurs |

## Projet

Projet développé dans le cadre du programme FutureKawa — Étape 9 : Jenkins CI/CD.