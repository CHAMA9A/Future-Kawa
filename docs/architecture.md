# Architecture — FutureKawa

## Présentation générale

FutureKawa est une plateforme de **supervision centralisée** pour la gestion des stocks de café vert. Elle permet de suivre les lots de café entreposés dans plusieurs pays (Brésil, Équateur, Colombie), de collecter des mesures de température et d'humidité via des capteurs IoT, et de déclencher des alertes en cas de dépassement des seuils de conservation.

L'architecture repose sur une approche **microservices**, où chaque pays dispose de son propre backend, de sa propre base de données et de son propre broker MQTT. Un backend central (siège) agrège les données et les expose au frontend.

---

## Architecture microservices

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

### Flux des données (IHM)

```
Frontend  →  Backend Central  →  Country Service  →  PostgreSQL
```

1. L'utilisateur sélectionne un pays dans le dashboard.
2. Le frontend interroge le backend central (`/api/central/:country/...`).
3. Le backend central contacte le service du pays correspondant via HTTP.
4. Le service pays interroge sa propre base PostgreSQL et retourne les données.

### Flux des données (IoT)

```
Arduino / simulation MQTT  →  Mosquitto  →  Country Service  →  PostgreSQL
                                                                     ↓
                                                              Backend Central
                                                                     ↓
                                                                Frontend
```

1. Un capteur (ou script de simulation) publie une mesure sur le topic MQTT du pays.
2. Le broker Mosquitto du pays reçoit le message.
3. Le service pays, abonné au topic, traite la mesure : enregistrement en base et vérification des seuils.
4. Si un seuil est dépassé, une alerte est automatiquement créée.
5. Le frontend récupère les données via le backend central.

---

## Rôle de chaque service

### Frontend

- Application React + TypeScript avec Vite.
- Dashboard de visualisation des lots, mesures, alertes et graphiques.
- Communication avec le backend central via `VITE_API_BASE_URL`.

### Backend Central (siège)

- Service NestJS qui agit comme **passerelle d'agrégation**.
- Interroge les trois services pays et expose des routes unifiées.
- Routes :
  - `GET /api/central/countries` — liste des pays disponibles
  - `GET /api/central/:country/lots` — lots d'un pays
  - `GET /api/central/:country/lots/fifo` — lots triés par FIFO
  - `GET /api/central/:country/measurements` — mesures d'un pays
  - `GET /api/central/:country/alerts` — alertes d'un pays

### Brazil Service

- Backend NestJS dédié au Brésil.
- Gère les lots, mesures et alertes pour les entrepôts brésiliens.
- Connecté à sa propre base PostgreSQL (`futurekawa_brazil`) et son broker Mosquitto.
- Seuils de température : **26°C – 32°C** (29°C ± 3°C)
- Seuils d'humidité : **53% – 57%** (55% ± 2%)

### Ecuador Service

- Backend NestJS dédié à l'Équateur.
- Connecté à sa propre base PostgreSQL (`futurekawa_ecuador`) et son broker Mosquitto.
- Seuils de température : **28°C – 34°C** (31°C ± 3°C)
- Seuils d'humidité : **58% – 62%** (60% ± 2%)

### Colombia Service

- Backend NestJS dédié à la Colombie.
- Connecté à sa propre base PostgreSQL (`futurekawa_colombia`) et son broker Mosquitto.
- Seuils de température : **23°C – 29°C** (26°C ± 3°C)
- Seuils d'humidité : **78% – 82%** (80% ± 2%)

### PostgreSQL

- Base de données relationnelle, une instance par pays.
- Contient les tables : `CoffeeLot`, `SensorMeasurement`, `Alert`.
- Chaque service pays utilise Prisma ORM pour l'accès aux données.

### Mosquitto MQTT

- Broker MQTT, une instance par pays.
- Reçoit les mesures IoT publiées par les capteurs ou scripts de simulation.
- Les services pays sont abonnés aux topics pour traiter les messages en temps réel.

### Arduino / IoT prototype

- Prototype basé sur **Arduino UNO + capteur DHT11** (température & humidité).
- Code embarqué : `iot/arduino-dht11-sensor/futurekawa_dht11_serial.ino`
- Communication série à 9600 bauds.
- Un bridge Serial-to-MQTT permet de relire les données série et de les publier vers Mosquitto.

---

## Ports utilisés

| Service | Port |
|---|---|
| Frontend (Vite) | 5173 |
| Backend Central | 3002 |
| Brazil Service | 3001 |
| Ecuador Service | 3011 |
| Colombia Service | 3012 |
| PostgreSQL Brésil | 5432 |
| PostgreSQL Équateur | 5433 |
| PostgreSQL Colombie | 5434 |
| Mosquitto Brésil | 1883 |
| Mosquitto Équateur | 1884 |
| Mosquitto Colombie | 1885 |