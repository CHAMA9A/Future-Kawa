# Brazil Service - FutureKawa

Backend NestJS pour le suivi des stocks de café vert au Brésil.

## Stack

- **Framework** : NestJS
- **Langage** : TypeScript
- **Base de données** : PostgreSQL
- **ORM** : Prisma

## Structure

```
backend-country/brazil-service/
├── prisma/schema.prisma    # Modèles de données
├── src/
│   ├── main.ts             # Point d'entrée
│   ├── app.module.ts       # Module racine
│   ├── prisma/             # Module Prisma (connexion DB)
│   └── lots/               # Module Lots de café
│       ├── lots.controller.ts
│       ├── lots.service.ts
│       └── dto/create-lot.dto.ts
├── .env                    # Variables d'environnement
├── .env.example            # Exemple de configuration
└── Dockerfile              # Build Docker
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
```