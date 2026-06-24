# Frontend — FutureKawa

## Présentation

Le frontend FutureKawa est une application web **React + TypeScript** construite avec **Vite**. Il sert de dashboard centralisé pour visualiser et superviser les stocks de café vert, les mesures IoT et les alertes pour l'ensemble des pays.

---

## Rôle du dashboard

Le dashboard permet à l'utilisateur de :

- Sélectionner un pays (Brésil, Équateur, Colombie)
- Consulter les lots en stock et leur statut (conforme, en alerte, périmé)
- Visualiser la file FIFO (lots à sortir en priorité)
- Afficher les mesures de température et d'humidité des capteurs
- Voir les alertes actives
- Analyser les données via des graphiques

---

## Communication avec backend-central

Le frontend communique exclusivement avec le **backend-central** via HTTP. Il n'interroge jamais directement les services pays.

L'URL de base de l'API est configurée via la variable d'environnement `VITE_API_BASE_URL` :

```typescript
// frontend/src/api/centralApi.ts
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3002';
```

En développement local, le frontend cible `http://localhost:3002` par défaut. En production Docker, le backend-central est accessible via le nom du service Docker.

Appels API effectués :

```typescript
fetchCountries()               // GET  /api/central/countries
fetchLots(country)             // GET  /api/central/:country/lots
fetchFifoLots(country)         // GET  /api/central/:country/lots/fifo
fetchMeasurements(country)     // GET  /api/central/:country/measurements
fetchAlerts(country)           // GET  /api/central/:country/alerts
```

---

## Composants principaux

### App

Point d'entrée de l'application. Monte le composant `Dashboard`.

```
frontend/src/
├── App.tsx
├── main.tsx
├── api/
│   └── centralApi.ts
├── components/
│   ├── Navbar.tsx
│   ├── HeroSection.tsx
│   ├── CountryOverview.tsx
│   ├── DashboardCards.tsx
│   ├── LotsTable.tsx
│   ├── FifoLotsTable.tsx
│   ├── MeasurementsTable.tsx
│   ├── AlertsTable.tsx
│   ├── MeasurementsChart.tsx
│   └── AlertsChart.tsx
├── pages/
│   └── Dashboard.tsx
├── types/
│   └── index.ts
├── test/
│   ├── DashboardCards.test.tsx
│   ├── DashboardError.test.tsx
│   ├── Navbar.test.tsx
│   └── TablesEmpty.test.tsx
└── utils.tsx
```

### Dashboard

Composant principal qui orchestre l'ensemble des données. Il :

1. Charge la liste des pays depuis le backend central au montage
2. Charge les données (lots, FIFO, mesures, alertes) pour le pays sélectionné
3. Gère les états : chargement, erreur, données chargées
4. Propose une navigation par sections (dashboard, lots, mesures, alertes) avec défilement fluide

### Navbar

Barre de navigation avec :

- Logo FutureKawa
- Onglets de navigation : Dashboard, Lots, Mesures IoT, Alertes
- Sélecteur de pays (liste dynamique depuis l'API)
- Indicateur de statut du service (en ligne / hors ligne)
- Informations utilisateur (Admin, Super Admin)

### DashboardCards

Affiche des cartes récapitulatives avec les indicateurs clés :

- Nombre total de lots
- Lots FIFO à sortir
- Dernières mesures (température, humidité)
- Alertes actives

### LotsTable

Tableau listant tous les lots avec leur code, entrepôt, date de stockage et statut.

### FifoLotsTable

Tableau des lots triés par date de stockage croissante (FIFO), indiquant l'ordre de sortie prioritaire.

### MeasurementsTable

Tableau des mesures de température et d'humidité, trié de la plus récente à la plus ancienne.

### AlertsTable

Tableau des alertes avec le type, le message et la date de création.

### MeasurementsChart

Graphique (bibliothèque de charting) affichant l'évolution de la température et de l'humidité dans le temps.

### AlertsChart

Graphique montrant la répartition des alertes par type (température, humidité, lots périmés).

### HeroSection / CountryOverview

Sections d'en-tête et de présentation du pays sélectionné avec des informations contextuelles.

---

## Fonctionnalités visibles

| Fonctionnalité | Description |
|---|---|
| Sélection du pays | Menu déroulant pour basculer entre Brésil, Équateur, Colombie |
| Consultation des lots | Liste complète des lots avec leur statut |
| Affichage FIFO | Lots triés par ancienneté pour prioriser les sorties |
| Mesures capteurs | Relevés de température et humidité |
| Alertes | Liste des alertes générées automatiquement |
| Graphiques | Évolution temporelle des mesures et répartition des alertes |

---

## Commandes

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement (port 5173)
npm run dev

# Build de production
npm run build

# Exécuter les tests
npm run test -- --run
```