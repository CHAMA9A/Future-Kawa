# Base de données — FutureKawa

## Séparation des bases par pays

FutureKawa utilise **une base de données PostgreSQL dédiée par pays**. Cette approche permet d'isoler les données de chaque pays et de garantir une indépendance totale entre les trois environnements de stockage (Brésil, Équateur, Colombie).

| Base de données | Service | Container | Port |
|---|---|---|---|
| `futurekawa_brazil` | Brazil Service | `postgres-brazil` | 5432 |
| `futurekawa_ecuador` | Ecuador Service | `postgres-ecuador` | 5433 |
| `futurekawa_colombia` | Colombia Service | `postgres-colombia` | 5434 |

---

## PostgreSQL via Docker

Chaque instance PostgreSQL utilise l'image officielle `postgres:15-alpine`, configurée dans `docker-compose.yml` avec :

- Un utilisateur et mot de passe dédiés (`futurekawa` / `futurekawa123`)
- Un volume persistant pour conserver les données entre les redémarrages
- Un healthcheck (`pg_isready`) pour garantir que le service n'est déclaré opérationnel qu'une fois la base prête

Exemple de configuration pour le Brésil :

```yaml
postgres-brazil:
  image: postgres:15-alpine
  container_name: postgres-brazil
  environment:
    POSTGRES_USER: futurekawa
    POSTGRES_PASSWORD: futurekawa123
    POSTGRES_DB: futurekawa_brazil
  ports:
    - "5432:5432"
  volumes:
    - postgres-brazil-data:/var/lib/postgresql/data
  healthcheck:
    test: ["CMD-SHELL", "pg_isready -U futurekawa -d futurekawa_brazil"]
    interval: 5s
    timeout: 5s
    retries: 5
```

---

## Prisma ORM

Chaque backend pays utilise **Prisma** comme ORM (Object-Relational Mapping) pour interagir avec PostgreSQL. Le schéma Prisma définit les modèles de données, les enums et les relations.

Le fichier de schéma se trouve dans chaque service pays :

```
backend-country/brazil-service/prisma/schema.prisma
backend-country/ecuador-service/prisma/schema.prisma
backend-country/colombia-service/prisma/schema.prisma
```

---

## Modèles principaux

### CoffeeLot

Représente un lot de café vert stocké dans un entrepôt.

| Champ | Type | Description |
|---|---|---|
| `id` | Int (auto-incrément) | Identifiant unique |
| `lotCode` | String (unique) | Code du lot |
| `country` | String | Pays d'origine |
| `warehouseName` | String | Nom de l'entrepôt |
| `storageDate` | DateTime | Date d'entrée en stock |
| `status` | LotStatus | État du lot |
| `createdAt` | DateTime | Date de création en base |

### SensorMeasurement

Représente une mesure de température et d'humidité relevée par un capteur IoT.

| Champ | Type | Description |
|---|---|---|
| `id` | Int (auto-incrément) | Identifiant unique |
| `warehouseName` | String | Entrepôt concerné |
| `temperature` | Float | Température en °C |
| `humidity` | Float | Humidité en % |
| `measuredAt` | DateTime | Horodatage de la mesure |

### Alert

Représente une alerte générée automatiquement en cas de dépassement de seuil ou de lot périmé.

| Champ | Type | Description |
|---|---|---|
| `id` | Int (auto-incrément) | Identifiant unique |
| `type` | AlertType | Type d'alerte |
| `message` | String | Description de l'alerte |
| `status` | String | Statut (défaut : `NEW`) |
| `createdAt` | DateTime | Date de création |

---

## Enums

### LotStatus

| Valeur | Description |
|---|---|
| `CONFORME` | Lot dans les normes |
| `EN_ALERTE` | Lot signalé (condition de stockage dégradée) |
| `PERIME` | Lot périmé (plus de 365 jours en stock) |

### AlertType

| Valeur | Description |
|---|---|
| `TEMPERATURE` | Température hors seuil |
| `HUMIDITY` | Humidité hors seuil |
| `EXPIRED_LOT` | Lot périmé (âge > 365 jours) |

---

## Règle FIFO (First In, First Out)

La fonctionnalité FIFO permet de visualiser les lots triés par date de stockage croissante (`storageDate`). Cela correspond à la logique de gestion des stocks où les lots les plus anciens doivent être traités en priorité.

La requête est implémentée dans chaque service pays :

```typescript
// lots.service.ts
async findFifo() {
  return this.prisma.coffeeLot.findMany({
    orderBy: { storageDate: 'asc' },
  });
}
```

---

## Règle de péremption

Un lot est considéré comme **périmé** si plus de **365 jours** se sont écoulés depuis sa date de stockage (`storageDate`). La vérification est déclenchée via :

```
POST /api/alerts/check-expired-lots
```

Cette route parcourt tous les lots, identifie ceux dont l'âge dépasse 365 jours, crée une alerte de type `EXPIRED_LOT` et met à jour leur statut en `PERIME`.

---

## Avantages de la séparation des bases

| Avantage | Description |
|---|---|
| **Isolation des données** | Chaque pays a ses propres données : aucun risque de mélange ou fuite entre pays |
| **Résilience** | Une panne sur la base d'un pays n'affecte pas les autres pays |
| **Adaptation multi-pays** | Chaque pays peut avoir ses propres seuils, configurations et évolutions |
| **Maintenance** | Les schémas sont identiques mais indépendants : mise à jour possible pays par pays |