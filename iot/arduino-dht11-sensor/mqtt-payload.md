# FutureKawa — Payload MQTT

## Topic MQTT

Topic principal pour le prototype (Colombia) :

```
futurekawa/colombia/warehouse-1/measurements
```

Topics par pays :

| Pays | Topic | Port MQTT |
|---|---|---|
| Brazil | `futurekawa/brazil/warehouse-1/measurements` | 1883 |
| Ecuador | `futurekawa/ecuador/warehouse-1/measurements` | 1884 |
| Colombia | `futurekawa/colombia/warehouse-1/measurements` | 1885 |

## Format JSON

Le payload doit être un objet JSON avec trois champs :

```json
{
  "warehouseName": "Warehouse Colombia 1",
  "temperature": 30,
  "humidity": 85
}
```

### Description des champs

| Champ | Type | Unité | Description |
|---|---|---|---|
| `warehouseName` | string | — | Nom de l'entrepôt (ex. "Warehouse Colombia 1") |
| `temperature` | number | °C | Température mesurée |
| `humidity` | number | % | Humidité relative mesurée |

## Seuils d'alerte par pays

Chaque backend pays déclenche une alerte si une mesure dépasse les seuils
définis :

| Pays | Température acceptable | Humidité acceptable |
|---|---|---|
| **Brazil** | 26°C – 32°C | 53% – 57% |
| **Ecuador** | 28°C – 34°C | 58% – 62% |
| **Colombia** | 23°C – 29°C | 78% – 82% |

### Exemples

Une température de **34°C** pour le **Brazil** (max 32°C) déclenche une
alerte de type `TEMPERATURE`.

Une humidité de **85%** pour la **Colombia** (max 82%) déclenche une
alerte de type `HUMIDITY`.

## Réception côté backend

Quand un backend pays reçoit une mesure via MQTT :

1. La mesure est sauvegardée en base PostgreSQL
2. Les seuils sont vérifiés
3. Si un seuil est dépassé, une alerte est créée (type TEMPERATURE ou HUMIDITY)
4. Le backend central peut récupérer les données via son API REST
5. Le frontend affiche les mesures et alertes dans le dashboard