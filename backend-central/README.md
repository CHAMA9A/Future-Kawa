# Backend Central - FutureKawa (Siège)

Backend NestJS du "siège" qui agrège les données des backends pays (Brésil, Équateur, Colombie).

## Stack

- **Framework** : NestJS
- **Langage** : TypeScript
- **HTTP Client** : @nestjs/axios (Axios)

## Structure

```
backend-central/
├── src/
│   ├── main.ts                      # Point d'entrée (port 3002)
│   ├── app.module.ts                # Module racine
│   └── central/
│       ├── central.module.ts        # Module central (importe HttpModule)
│       ├── central.service.ts       # Appels HTTP vers les backends pays
│       └── central.controller.ts    # Routes API exposées
├── .env                             # Variables d'environnement
├── .env.example                     # Exemple de configuration
└── Dockerfile                       # Build Docker
```

## Routes API

| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/api/central/countries` | Liste des pays disponibles |
| GET | `/api/central/:country/lots` | Lots d'un pays (brazil, ecuador, colombia) |
| GET | `/api/central/:country/lots/fifo` | Lots FIFO d'un pays |
| GET | `/api/central/:country/measurements` | Mesures d'un pays |
| GET | `/api/central/:country/alerts` | Alertes d'un pays |

### Exemples

```
GET /api/central/brazil/lots
GET /api/central/ecuador/measurements
GET /api/central/colombia/alerts
GET /api/central/brazil/lots/fifo
```

## Lancer le projet

```bash
# Avec Docker Compose (depuis la racine)
docker compose up -d backend-central

# Ou en mode développement
cd backend-central
npm install
npm run start:dev
```

Le serveur démarre sur http://localhost:3002.

## Variables d'environnement

| Variable | Description | Valeur par défaut |
|---|---|---|
| `PORT` | Port du serveur | `3002` |
| `BRAZIL_SERVICE_URL` | URL du backend Brésil | `http://localhost:3001` |
| `ECUADOR_SERVICE_URL` | URL du backend Équateur | `http://localhost:3011` |
| `COLOMBIA_SERVICE_URL` | URL du backend Colombie | `http://localhost:3012` |

## Route countries

`GET /api/central/countries` retourne :

```json
[
  { "code": "brazil", "name": "Brazil", "status": "available", "serviceUrl": "http://localhost:3001" },
  { "code": "ecuador", "name": "Ecuador", "status": "available", "serviceUrl": "http://localhost:3011" },
  { "code": "colombia", "name": "Colombia", "status": "available", "serviceUrl": "http://localhost:3012" }
]
```

## Gestion d'erreur

Si un backend pays ne répond pas, la route retourne :

```json
{ "country": "brazil", "status": "unavailable", "message": "Country service is unavailable" }
```

## Tester avec PowerShell

```powershell
# Liste des pays
Invoke-RestMethod -Uri "http://localhost:3002/api/central/countries" -Method Get

# Lots
Invoke-RestMethod -Uri "http://localhost:3002/api/central/brazil/lots" -Method Get
Invoke-RestMethod -Uri "http://localhost:3002/api/central/ecuador/lots" -Method Get
Invoke-RestMethod -Uri "http://localhost:3002/api/central/colombia/lots" -Method Get

# Mesures
Invoke-RestMethod -Uri "http://localhost:3002/api/central/brazil/measurements" -Method Get
Invoke-RestMethod -Uri "http://localhost:3002/api/central/ecuador/measurements" -Method Get
Invoke-RestMethod -Uri "http://localhost:3002/api/central/colombia/measurements" -Method Get

# Alertes
Invoke-RestMethod -Uri "http://localhost:3002/api/central/brazil/alerts" -Method Get
Invoke-RestMethod -Uri "http://localhost:3002/api/central/ecuador/alerts" -Method Get
Invoke-RestMethod -Uri "http://localhost:3002/api/central/colombia/alerts" -Method Get
```