# Alert Thresholds — FutureKawa

## Objectif

Les seuils d'alerte définissent les plages de température et d'humidité acceptables pour chaque pays. Lorsqu'une mesure IoT dépasse ces seuils, une alerte est automatiquement créée et un email simulé est envoyé au manager du pays concerné.

Cette fonctionnalité permet de consulter et modifier manuellement les seuils depuis le dashboard frontend, sans redéploiement.

## Seuils par défaut par pays

| Pays | Température min | Température max | Humidité min | Humidité max |
|------|----------------|----------------|-------------|-------------|
| Brazil | 26°C | 32°C | 53% | 57% |
| Ecuador | 28°C | 34°C | 58% | 62% |
| Colombia | 30°C | 36°C | 30% | 45% |

> **Colombia** : Les seuils sont adaptés pour la démonstration locale du prototype IoT réel (Arduino UNO + DHT11). Les valeurs réelles observées dans la pièce de démonstration sont d'environ 34°C et 38%.

## Interface visuelle frontend

Un composant `ThresholdSettings` est intégré dans le dashboard, sous la section "Country overview" et avant les graphiques.

**Titre :** « Réglage des seuils d'alerte »

**Champs modifiables :**
- Température min (°C)
- Température max (°C)
- Humidité min (%)
- Humidité max (%)

**Boutons :**
- `Save thresholds` — Enregistre les nouveaux seuils
- `Reset defaults` — Réinitialise les seuils aux valeurs par défaut du pays

## Routes API

### Backend pays (ex : Colombia)

| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/api/thresholds` | Récupérer les seuils actuels |
| PUT | `/api/thresholds` | Mettre à jour les seuils |
| POST | `/api/thresholds/reset` | Réinitialiser aux valeurs par défaut |

Exemple de body PUT :

```json
{
  "temperature": { "min": 30, "max": 36 },
  "humidity": { "min": 30, "max": 45 }
}
```

### Backend central (proxy)

Le backend central proxyfie les appels vers les backends pays :

| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/api/central/:country/thresholds` | Récupérer les seuils d'un pays |
| PUT | `/api/central/:country/thresholds` | Mettre à jour les seuils d'un pays |
| POST | `/api/central/:country/thresholds/reset` | Réinitialiser les seuils d'un pays |

## Validation

Lors de la mise à jour des seuils (PUT), les validations suivantes sont appliquées :

- `temperature.min` et `temperature.max` doivent être des nombres
- `humidity.min` et `humidity.max` doivent être des nombres
- `temperature.min` < `temperature.max`
- `humidity.min` < `humidity.max`
- Température comprise entre -20°C et 60°C
- Humidité comprise entre 0% et 100%

Si la validation échoue, une erreur 400 est retournée avec un message clair.

## Documentation Swagger

Les routes sont documentées avec Swagger. Les tags utilisés sont :
- `thresholds` pour les routes des backends pays
- `central` pour les routes du backend central (existantes et nouvelles)

Accès Swagger par backend :
- Brazil : `http://localhost:3001/api/docs`
- Ecuador : `http://localhost:3011/api/docs`
- Colombia : `http://localhost:3012/api/docs`
- Central : `http://localhost:3002/api/docs`

## Limites actuelles

- **Stockage en mémoire** : Les seuils sont stockés dans les variables `currentAlertThresholds` des fichiers `alert-thresholds.ts`. Ils ne sont pas persistés en base de données.
- **Réinitialisation au redémarrage** : Si un container backend redémarre, les seuils reviennent aux valeurs par défaut configurées dans `DEFAULT_ALERT_THRESHOLDS`.
- **Pas d'authentification** : Aucun système d'authentification ou de rôle n'est en place. Toute personne ayant accès au dashboard peut modifier les seuils.
- **Par pays uniquement** : Les seuils sont gérés indépendamment par pays. Il n'y a pas de seuils globaux.

## Améliorations futures possibles

- Stockage des seuils en base de données (table `AlertThreshold` avec Prisma)
- Historique des modifications de seuils
- Rôle admin pour restreindre la modification des seuils
- Seuils globaux avec possibilité de surcharge par pays
- Recharge des seuils depuis la base au démarrage

## Exemple d'utilisation pour démonstration IoT réelle

1. Brancher l'Arduino UNO + DHT11
2. Lancer le bridge Serial-to-MQTT
3. Ouvrir le dashboard FutureKawa
4. Sélectionner « Colombia » dans la barre de navigation
5. Faire défiler jusqu'à « Réglage des seuils d'alerte »
6. Les seuils sont pré-configurés pour la démonstration (30°C – 36°C / 30% – 45%)
7. Les mesures Arduino (≈34°C, ≈38%) sont considérées comme normales
8. En cas de besoin, ajuster les seuils directement depuis l'interface