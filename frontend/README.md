# FutureKawa - Frontend

Interface de suivi des stocks de café vert pour FutureKawa.

## Installation

```bash
cd frontend
npm install
```

## Configuration

Créer un fichier `.env` à la racine du projet :

```
VITE_API_BASE_URL=http://localhost:3002
```

## Lancement local

```bash
cd frontend
npm run dev
```

Ouvrir [http://localhost:5173](http://localhost:5173)

## Lancement avec Docker

```bash
# À la racine du projet
docker compose build frontend
docker compose up -d frontend
```

URL : [http://localhost:5173](http://localhost:5173)

## Routes API utilisées (backend central)

| Route | Description |
|---|---|
| `GET /api/central/countries` | Liste des pays disponibles |
| `GET /api/central/:country/lots` | Lots en stock |
| `GET /api/central/:country/lots/fifo` | Lots triés FIFO |
| `GET /api/central/:country/measurements` | Mesures capteurs |
| `GET /api/central/:country/alerts` | Alertes |

## Structure

```
src/
├── api/centralApi.ts        # Client API
├── components/
│   ├── CountrySelector.tsx   # Sélecteur de pays
│   ├── DashboardCards.tsx    # Cartes statistiques
│   ├── LotsTable.tsx         # Tableau des lots
│   ├── FifoLotsTable.tsx     # Tableau FIFO
│   ├── MeasurementsTable.tsx # Tableau des mesures
│   └── AlertsTable.tsx       # Tableau des alertes
├── pages/
│   └── Dashboard.tsx         # Page principale
├── types/index.ts            # Types TypeScript
└── utils.tsx                 # Utilitaires d'affichage
```