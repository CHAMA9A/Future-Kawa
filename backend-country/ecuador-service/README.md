# Ecuador Service - FutureKawa

Backend NestJS pour le suivi des stocks de café vert en Équateur.

## Stack

- **Framework** : NestJS
- **Langage** : TypeScript
- **Base de données** : PostgreSQL
- **ORM** : Prisma
- **MQTT** : Mosquitto

## Structure

```
backend-country/ecuador-service/
├── prisma/schema.prisma          # Modèles de données (CoffeeLot, SensorMeasurement, Alert)
├── src/
│   ├── main.ts                   # Point d'entrée
│   ├── app.module.ts             # Module racine
│   ├── prisma/                   # Module Prisma (connexion DB)
│   ├── lots/                     # Module Lots de café
│   ├── measurements/             # Module Mesures IoT (température, humidité)
│   ├── alerts/                   # Module Alertes (seuils + lots périmés)
│   └── mqtt/                     # Module MQTT (réception via Mosquitto)
├── .env                          # Variables d'environnement
├── .env.example                  # Exemple de configuration
└── Dockerfile                    # Build Docker
```

## Modèles de données

- **CoffeeLot** : lot de café (id, lotCode, country, warehouseName, storageDate, status, createdAt)
- **SensorMeasurement** : mesure IoT (id, warehouseName, temperature, humidity, measuredAt)
- **Alert** : alerte (id, type, message, status, createdAt)

## Routes API

| Méthode | Route | Description |
|---------|-------|-------------|
| POST | `/api/lots` | Créer un lot |
| GET | `/api/lots` | Lister tous les lots |
| GET | `/api/lots/fifo` | Lister les lots triés FIFO |
| POST | `/api/measurements` | Créer une mesure (déclenche alerte si hors seuil) |
| GET | `/api/measurements` | Lister toutes les mesures |
| GET | `/api/measurements/warehouse/:name` | Filtrer les mesures par entrepôt |
| GET | `/api/alerts` | Lister toutes les alertes |
| POST | `/api/alerts/check-expired-lots` | Vérifier les lots périmés |

## Lancer le projet

```bash
# 1. Démarrer PostgreSQL et Mosquitto
docker compose up -d postgres-ecuador mosquitto-ecuador

# 2. Installer les dépendances
cd backend-country/ecuador-service
npm install

# 3. Appliquer les migrations Prisma
npx prisma migrate dev --name init

# 4. Lancer le serveur en mode développement
npm run start:dev
```

Le serveur démarre sur http://localhost:3011.

## MQTT

### Variables d'environnement

| Variable | Description | Valeur par défaut |
|---|---|---|
| `MQTT_BROKER_URL` | URL du broker Mosquitto | `mqtt://localhost:1884` |
| `MQTT_TOPIC` | Topic MQTT à écouter | `futurekawa/ecuador/warehouse-1/measurements` |

### Fonctionnement

Le service MQTT se connecte automatiquement au démarrage du backend. Il écoute le topic configuré et traite les messages au format JSON contenant `warehouseName`, `temperature` et `humidity`. Les mesures sont enregistrées en base et les alertes sont déclenchées automatiquement si les seuils sont dépassés.

### Tester avec mosquitto_pub (PowerShell)

```powershell
'{"warehouseName":"Warehouse Ecuador 1","temperature":35,"humidity":65}' | docker exec -i mosquitto-ecuador mosquitto_pub -h localhost -t futurekawa/ecuador/warehouse-1/measurements -l
```

### Logs attendus dans la console

```
[MQTT] Connexion au broker réussie
[MQTT] Abonnement au topic : futurekawa/ecuador/warehouse-1/measurements
[MQTT] Message reçu : {"warehouseName":"Warehouse Ecuador 1","temperature":35,"humidity":65}
[Mesure] Mesure enregistrée : 35°C, 65% (Warehouse Ecuador 1)
[MQTT] Mesure enregistrée depuis MQTT
[Alert] ALERTE CRÉÉE : TEMPERATURE - Température hors seuil...
[Alert] 📧 EMAIL SIMULÉ ENVOYÉ À ecuador.manager@futurekawa.com
```

## Seuils Équateur

| Mesure | Idéal | Tolérance | Plage acceptable |
|---|---|---|---|
| Température | 31°C | ±3°C | 28°C – 34°C |
| Humidité | 60% | ±2% | 58% – 62% |

### Tester avec curl

```bash
# Créer un lot
curl -X POST http://localhost:3011/api/lots \
  -H "Content-Type: application/json" \
  -d '{
    "lotCode": "EC-LOT-001",
    "country": "Ecuador",
    "warehouseName": "Warehouse Ecuador 1",
    "storageDate": "2025-01-10"
  }'

# Lister tous les lots
curl http://localhost:3011/api/lots

# Lister les lots triés FIFO
curl http://localhost:3011/api/lots/fifo

# Créer une mesure (sans alerte)
curl -X POST http://localhost:3011/api/measurements \
  -H "Content-Type: application/json" \
  -d '{"warehouseName":"Warehouse Ecuador 1","temperature":30,"humidity":60}'

# Créer une mesure (avec alerte température)
curl -X POST http://localhost:3011/api/measurements \
  -H "Content-Type: application/json" \
  -d '{"warehouseName":"Warehouse Ecuador 1","temperature":35,"humidity":60}'

# Consulter les alertes
curl http://localhost:3011/api/alerts

# Vérifier les lots périmés
curl -X POST http://localhost:3011/api/alerts/check-expired-lots
```