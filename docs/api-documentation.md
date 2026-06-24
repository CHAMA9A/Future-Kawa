# Documentation API — FutureKawa

## Swagger / OpenAPI

FutureKawa utilise **Swagger** (via le module `@nestjs/swagger`) pour documenter et tester les API REST de chaque service.

Swagger génère une interface interactive permettant de :

- Visualiser toutes les routes disponibles
- Connaître les paramètres attendus
- Tester les endpoints directement depuis le navigateur
- Télécharger la spécification OpenAPI au format JSON

---

## URLs Swagger (interface interactive)

| Service | URL |
|---|---|
| Brazil Service | http://localhost:3001/api/docs |
| Ecuador Service | http://localhost:3011/api/docs |
| Colombia Service | http://localhost:3012/api/docs |
| Backend Central | http://localhost:3002/api/docs |

## URLs OpenAPI JSON

| Service | URL |
|---|---|
| Brazil Service | http://localhost:3001/api/docs-json |
| Ecuador Service | http://localhost:3011/api/docs-json |
| Colombia Service | http://localhost:3012/api/docs-json |
| Backend Central | http://localhost:3002/api/docs-json |

---

## Routes API détaillées

### Services pays (Brazil, Ecuador, Colombia)

Chaque service pays expose les mêmes routes, préfixées différemment (ports 3001, 3011, 3012).

#### Lots

| Méthode | Route | Description |
|---|---|---|
| `POST` | `/api/lots` | Créer un nouveau lot de café |
| `GET` | `/api/lots` | Lister tous les lots |
| `GET` | `/api/lots/fifo` | Lister les lots triés par FIFO (plus ancien en premier) |

#### Measurements

| Méthode | Route | Description |
|---|---|---|
| `POST` | `/api/measurements` | Créer une mesure (température/humidité) + alerte auto si hors seuil |
| `GET` | `/api/measurements` | Lister toutes les mesures (triées par date descendante) |
| `GET` | `/api/measurements/warehouse/:warehouseName` | Filtrer les mesures par entrepôt |

#### Alerts

| Méthode | Route | Description |
|---|---|---|
| `GET` | `/api/alerts` | Lister toutes les alertes |
| `POST` | `/api/alerts/check-expired-lots` | Vérifier les lots périmés (> 365 jours) et créer les alertes associées |

### Backend Central (siège)

Le backend central agit comme **passerelle d'agrégation**. Il ne possède pas de base de données propre mais interroge les trois services pays.

| Méthode | Route | Description |
|---|---|---|
| `GET` | `/api/central/countries` | Liste des pays disponibles |
| `GET` | `/api/central/:country/lots` | Lots du pays spécifié |
| `GET` | `/api/central/:country/lots/fifo` | Lots FIFO du pays spécifié |
| `GET` | `/api/central/:country/measurements` | Mesures du pays spécifié |
| `GET` | `/api/central/:country/alerts` | Alertes du pays spécifié |

> **Paramètre `:country`** : valeurs acceptées — `brazil`, `ecuador`, `colombia`

---

## Exemple d'utilisation

### Créer un lot (Brésil)

```bash
curl -X POST http://localhost:3001/api/lots \
  -H "Content-Type: application/json" \
  -d '{
    "lotCode": "BRA-2025-001",
    "country": "Brazil",
    "warehouseName": "Warehouse Brazil 1",
    "storageDate": "2025-01-15T00:00:00.000Z"
  }'
```

### Récupérer les mesures de l'Équateur via le backend central

```bash
curl http://localhost:3002/api/central/ecuador/measurements
```

### Vérifier les lots périmés (Colombie)

```bash
curl -X POST http://localhost:3012/api/alerts/check-expired-lots
```