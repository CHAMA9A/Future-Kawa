# Brazil Service - FutureKawa

Backend NestJS pour le suivi des stocks de café vert au Brésil.

## Stack

- **Framework** : NestJS
- **Langage** : TypeScript
- **Base de données** : PostgreSQL
- **ORM** : Prisma
- **MQTT** : Mosquitto

## Structure

```
backend-country/brazil-service/
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
docker compose up -d postgres-brazil mosquitto-brazil

# 2. Installer les dépendances
cd backend-country/brazil-service
npm install

# 3. Appliquer les migrations Prisma
npx prisma migrate dev --name init

# 4. Lancer le serveur en mode développement
npm run start:dev
```

Le serveur démarre sur http://localhost:3001.

## MQTT

### Variables d'environnement

| Variable | Description | Valeur par défaut |
|---|---|---|
| `MQTT_BROKER_URL` | URL du broker Mosquitto | `mqtt://localhost:1883` |
| `MQTT_TOPIC` | Topic MQTT à écouter | `futurekawa/brazil/warehouse-1/measurements` |

### Fonctionnement

Le service MQTT se connecte automatiquement au démarrage du backend. Il écoute le topic configuré et traite les messages au format JSON contenant `warehouseName`, `temperature` et `humidity`. Les mesures sont enregistrées en base et les alertes sont déclenchées automatiquement si les seuils sont dépassés.

### Tester avec mosquitto_pub (PowerShell)

```powershell
docker exec mosquitto-brazil mosquitto_pub -h localhost -t futurekawa/brazil/warehouse-1/measurements -m '{"warehouseName":"Warehouse Brazil 1","temperature":34,"humidity":60}'
```

### Logs attendus dans la console

```
[MQTT] Connexion au broker réussie
[MQTT] Abonnement au topic : futurekawa/brazil/warehouse-1/measurements
[MQTT] Message reçu : {"warehouseName":"Warehouse Brazil 1","temperature":34,"humidity":60}
[Mesure] Mesure enregistrée : 34°C, 60% (Warehouse Brazil 1)
[MQTT] Mesure enregistrée depuis MQTT
[Alert] ALERTE CRÉÉE : TEMPERATURE - Température hors seuil...
[Alert] 📧 EMAIL SIMULÉ ENVOYÉ À brazil.manager@futurekawa.com
```

## Seuils Brésil

| Mesure | Idéal | Tolérance | Plage acceptable |
|---|---|---|---|
| Température | 29°C | ±3°C | 26°C – 32°C |
| Humidité | 55% | ±2% | 53% – 57% |

### Tester avec curl

```bash
# Créer un lot
curl -X POST http://localhost:3001/api/lots \
  -H "Content-Type: application/json" \
  -d '{
    "lotCode": "BR-LOT-001",
    "country": "Brazil",
    "warehouseName": "Warehouse Brazil 1",
    "storageDate": "2025-01-10"
  }'

# Lister tous les lots
curl http://localhost:3001/api/lots

# Lister les lots triés FIFO
curl http://localhost:3001/api/lots/fifo

# Créer une mesure (sans alerte)
curl -X POST http://localhost:3001/api/measurements \
  -H "Content-Type: application/json" \
  -d '{"warehouseName":"Warehouse Brazil 1","temperature":28,"humidity":55}'

# Créer une mesure (avec alerte température)
curl -X POST http://localhost:3001/api/measurements \
  -H "Content-Type: application/json" \
  -d '{"warehouseName":"Warehouse Brazil 1","temperature":34,"humidity":55}'

# Consulter les alertes
curl http://localhost:3001/api/alerts

# Vérifier les lots périmés
curl -X POST http://localhost:3001/api/alerts/check-expired-lots
```