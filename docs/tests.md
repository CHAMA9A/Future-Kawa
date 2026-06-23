# Tests — FutureKawa

Ce document décrit les scénarios de test manuels et automatisés pour le projet FutureKawa.

## Tests unitaires automatisés

### Backend pays (brazil-service, ecuador-service, colombia-service)

Chaque service pays dispose de tests Jest couvrant les services principaux :

| Service | Fichier de test | Scénarios |
|---|---|---|
| LotsService | `src/lots/lots.service.spec.ts` | Création d'un lot, récupération de tous les lots, récupération FIFO |
| MeasurementsService | `src/measurements/measurements.service.spec.ts` | Création de mesure dans les seuils, création avec déclenchement d'alerte (température/haute/basse, humidité, les deux), findAll, findByWarehouse |
| AlertsService | `src/alerts/alerts.service.spec.ts` | Récupération de toutes les alertes, détection de lots périmés, aucun lot périmé |

Lancer les tests :

```bash
cd backend-country/brazil-service
npm test

cd backend-country/ecuador-service
npm test

cd backend-country/colombia-service
npm test
```

### Backend central

Le backend central dispose de tests Jest couvrant :

| Service | Fichier de test | Scénarios |
|---|---|---|
| CentralService | `src/central/central.service.spec.ts` | Liste des pays (3 pays), appels HTTP vers chaque pays, gestion d'erreur si service indisponible, NotFoundException pour pays inconnu |
| CentralController | `src/central/central.controller.spec.ts` | Toutes les routes GET (countries, lots, fifo, measurements, alerts) |

Lancer les tests :

```bash
cd backend-central
npm test
```

### Frontend

Le frontend utilise Vitest + React Testing Library. Tests disponibles :

| Composant | Fichier de test | Scénarios |
|---|---|---|
| Navbar (CountrySelector) | `src/test/Navbar.test.tsx` | Affichage des pays dans le select, sélection par défaut, changement de pays, indicateur en ligne/hors ligne |
| DashboardCards | `src/test/DashboardCards.test.tsx` | Affichage de toutes les cartes, compteurs lots/FIFO/mesures/alertes, statut service |
| LotsTable / FifoLotsTable / MeasurementsTable / AlertsTable | `src/test/TablesEmpty.test.tsx` | Affichage du message "Aucune donnée disponible" quand les tableaux sont vides, rendu avec données |
| Dashboard | `src/test/DashboardError.test.tsx` | Affichage du chargement initial |

Lancer les tests :

```bash
cd frontend
npm test
```

---

## A. Test Docker Compose

Vérifier que tous les containers démarrent correctement :

```bash
docker compose up -d --build
```

**Résultat attendu** : Tous les containers sont `Up` :

| Container | Port |
|---|---|
| `frontend` | 5173 |
| `backend-central` | 3002 |
| `brazil-service` | 3001 |
| `ecuador-service` | 3011 |
| `colombia-service` | 3012 |
| `postgres-brazil` | 5432 |
| `postgres-ecuador` | 5433 |
| `postgres-colombia` | 5434 |
| `mosquitto-brazil` | 1883 |
| `mosquitto-ecuador` | 1884 |
| `mosquitto-colombia` | 1885 |

Vérification rapide :

```powershell
docker ps --format "table {{.Names}}\t{{.Status}}"
```

---

## B. Test création de lots

### Brazil

```powershell
$body = @{
    lotCode = "BRA-2024-001"
    country = "Brazil"
    warehouseName = "Warehouse Brazil 1"
    storageDate = "2024-06-01T00:00:00Z"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3001/api/lots" -Method Post -Body $body -ContentType "application/json"
```

### Ecuador

```powershell
$body = @{
    lotCode = "ECU-2024-001"
    country = "Ecuador"
    warehouseName = "Warehouse Ecuador 1"
    storageDate = "2024-06-01T00:00:00Z"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3011/api/lots" -Method Post -Body $body -ContentType "application/json"
```

### Colombia

```powershell
$body = @{
    lotCode = "COL-2024-001"
    country = "Colombia"
    warehouseName = "Warehouse Colombia 1"
    storageDate = "2024-06-01T00:00:00Z"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3012/api/lots" -Method Post -Body $body -ContentType "application/json"
```

**Résultat attendu** : Retourne le lot créé avec `"status": "CONFORME"` et un `id` auto-généré.

---

## C. Test FIFO

### Récupération des lots triés par date de stockage (FIFO)

```powershell
# Brazil
Invoke-RestMethod -Uri "http://localhost:3001/api/lots/fifo" -Method Get

# Ecuador
Invoke-RestMethod -Uri "http://localhost:3011/api/lots/fifo" -Method Get

# Colombia
Invoke-RestMethod -Uri "http://localhost:3012/api/lots/fifo" -Method Get
```

**Résultat attendu** : Les lots les plus anciens (date de stockage la plus ancienne) doivent apparaître en premier dans la réponse.

---

## D. Test MQTT

### Publier une mesure via Mosquitto

```powershell
# Brazil
mosquitto_pub -h localhost -p 1883 -t "futurekawa/brazil/warehouse-1/measurements" -m '{"warehouseName":"Warehouse Brazil 1","temperature":30,"humidity":85}'

# Ecuador
mosquitto_pub -h localhost -p 1884 -t "futurekawa/ecuador/warehouse-1/measurements" -m '{"warehouseName":"Warehouse Ecuador 1","temperature":32,"humidity":60}'

# Colombia
mosquitto_pub -h localhost -p 1885 -t "futurekawa/colombia/warehouse-1/measurements" -m '{"warehouseName":"Warehouse Colombia 1","temperature":26,"humidity":80}'
```

**Format JSON attendu :**
```json
{
  "warehouseName": "Warehouse Colombia 1",
  "temperature": 30,
  "humidity": 85
}
```

**Résultat attendu** : La mesure est enregistrée en base. Si les seuils sont dépassés, une alerte est automatiquement créée (visible dans les logs du service).

---

## E. Test alertes

### Seuils par pays

| Pays | Température acceptable | Humidité acceptable |
|---|---|---|
| **Brazil** | 26°C – 32°C | 53% – 57% |
| **Ecuador** | 28°C – 34°C | 58% – 62% |
| **Colombia** | 23°C – 29°C | 78% – 82% |

### Vérification des alertes

```powershell
# Brazil
Invoke-RestMethod -Uri "http://localhost:3001/api/alerts" -Method Get

# Ecuador
Invoke-RestMethod -Uri "http://localhost:3011/api/alerts" -Method Get

# Colombia
Invoke-RestMethod -Uri "http://localhost:3012/api/alerts" -Method Get
```

**Résultat attendu** : Si une mesure dépasse les seuils, une alerte est créée avec :
- Type `TEMPERATURE` pour une température hors seuil
- Type `HUMIDITY` pour une humidité hors seuil
- Type `EXPIRED_LOT` pour un lot périmé (> 365 jours de stockage)

---

## F. Test backend central

### Routes disponibles

```powershell
# Liste des pays
Invoke-RestMethod -Uri "http://localhost:3002/api/central/countries" -Method Get

# Lots Brazil
Invoke-RestMethod -Uri "http://localhost:3002/api/central/brazil/lots" -Method Get

# Lots Ecuador
Invoke-RestMethod -Uri "http://localhost:3002/api/central/ecuador/lots" -Method Get

# Lots Colombia
Invoke-RestMethod -Uri "http://localhost:3002/api/central/colombia/lots" -Method Get

# Alertes Brazil
Invoke-RestMethod -Uri "http://localhost:3002/api/central/brazil/alerts" -Method Get

# Alertes Ecuador
Invoke-RestMethod -Uri "http://localhost:3002/api/central/ecuador/alerts" -Method Get

# Alertes Colombia
Invoke-RestMethod -Uri "http://localhost:3002/api/central/colombia/alerts" -Method Get
```

**Résultat attendu** :
- `/api/central/countries` retourne les 3 pays (Brazil, Ecuador, Colombia)
- Chaque route `/api/central/{country}/lots` retourne les lots du pays correspondant
- Si un service pays est indisponible, la réponse doit être : `{ "country": "brazil", "status": "unavailable", "message": "Country service is unavailable" }`

---

## G. Test frontend

### URL

```
http://localhost:5173
```

### Vérifications

1. **Dashboard visible** : La page d'accueil s'affiche avec le logo FutureKawa
2. **Sélection de pays** : Le sélecteur permet de choisir Brazil / Ecuador / Colombia
3. **Cartes statistiques** : Les 6 cartes (Pays, Lots, FIFO, Mesures, Alertes, Statut) sont affichées
4. **Lots affichés** : La section "Lots en stock" montre les lots du pays sélectionné
5. **Mesures affichées** : La section "Mesures capteurs" montre les relevés IoT
6. **Alertes affichées** : La section "Alertes" montre les alertes actives
7. **Pas d'erreur** : Le message "Unable to load data from central backend" ne doit pas apparaître si le backend central fonctionne