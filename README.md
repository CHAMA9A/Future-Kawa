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

## Projet

Projet développé dans le cadre du programme FutureKawa — Étape 9 : Jenkins CI/CD.