# Schéma d'automatisation FutureKawa — Phase 2

## Objectif de l'automatisation

L'automatisation vise à passer d'un système de **supervision passive** (relevé de mesures + alertes) à un système de **régulation active** capable de déclencher des actions correctives en temps réel pour maintenir les conditions de stockage du café vert dans les tolérances optimales.

---

## Situation actuelle

Le projet FutureKawa en l'état actuel (phase 1) fonctionne en **supervision uniquement** :

```
Capteurs / Simulation MQTT
       ↓
  Mosquitto (broker MQTT)
       ↓
  Backend pays (MqttService)
       ↓
  MeasurementsService.create()
       ↓
  Sauvegarde de la mesure en base PostgreSQL
       ↓
  Vérification des seuils
       ↓
  Création d'alerte si dépassement
       ↓
  Dashboard (consultation temps réel)
       ↓
  Action humaine (non automatisée)
```

### Composants actuellement fonctionnels

| Composant | Statut |
|---|---|
| Capteurs / simulation MQTT | Fonctionnel (simulation ou Arduino + bridge série) |
| Sauvegarde des mesures | Fonctionnel |
| Vérification des seuils | Fonctionnel |
| Génération d'alertes | Fonctionnel (TEMPERATURE, HUMIDITY, EXPIRED_LOT) |
| Dashboard de supervision | Fonctionnel |
| Action corrective | **Non automatisée** — repose sur l'opérateur humain |

---

## Évolution future — Phase 2

### Schéma cible avec automatisation

```
Capteur température/humidité
       ↓
  MQTT Mosquitto
       ↓
  Backend pays
       ↓
  Moteur de règles (règles conditionnelles)
       ↓
  Création d'alerte
       ↓
  Décision : automatique ou validation humaine ?
     ↙                ↘
  Action directe    Validation requise
       ↓                ↓
  Actionneur        Notification → Validation → Actionneur
       ↓                ↓
  Journalisation    Journalisation
       ↓                ↓
  Dashboard (suivi en temps réel)
```

### Nouveaux composants à intégrer

| Composant | Rôle |
|---|---|
| Moteur de règles | Évalue les conditions (température, humidité, durée) et décide de l'action |
| Actionneurs | Dispositifs physiques connectés (ventilation, chauffage, etc.) |
| Module de validation | Interface de validation humaine pour les actions critiques |
| Journal des actions | Traçabilité complète de toutes les actions automatiques et manuelles |

---

## Exemples d'actionneurs

| Actionneur | Problème traité | Action |
|---|---|---|
| **Ventilation** | Humidité trop élevée | Active l'extraction d'air pour réduire l'humidité |
| **Humidificateur** | Humidité trop basse | Augmente le taux d'humidité ambiant |
| **Déshumidificateur** | Humidité trop élevée | Réduit l'humidité par condensation |
| **Système de refroidissement** | Température trop élevée | Abaisse la température de l'entrepôt |
| **Chauffage** | Température trop basse | Augmente la température de l'entrepôt |

---

## Modes de fonctionnement

### Mode manuel

- Les alertes sont affichées dans le dashboard
- L'opérateur humain décide et déclenche les actions
- Aucune action automatique
- Recommandé pour : phase de test, maintenance

### Mode semi-automatique

- Les actions **non critiques** (ventilation, humidification légère) sont automatiques
- Les actions **critiques** (chauffage, refroidissement intense) nécessitent validation humaine
- L'opérateur reçoit une notification et doit confirmer ou refuser l'action
- Recommandé pour : phase de transition, montée en confiance

### Mode automatique

- Toutes les actions sont déclenchées automatiquement par le moteur de règles
- L'opérateur est notifié mais n'a pas à valider
- La journalisation permet la traçabilité complète
- Recommandé pour : fonctionnement nominal après validation

---

## Gestion des erreurs

| Scénario | Comportement attendu |
|---|---|
| **Capteur indisponible** | Alerte technique après X minutes sans mesure ; bascule sur capteur de secours si disponible |
| **Données incohérentes** | Rejet de la mesure, alerte de qualité de données, maintien du dernier état valide |
| **Actionneur indisponible** | Alerte technique, escalation vers un opérateur humain |
| **MQTT indisponible** | File d'attente locale sur le capteur ; notification d'urgence ; basculement vers broker secondaire si configuré |
| **Backend indisponible** | Dashboard affiche "service indisponible" ; conservation des dernières données valides en cache |

---

## Sécurité

| Mesure | Description |
|---|---|
| **Traçabilité** | Chaque action (automatique ou manuelle) est horodatée et enregistrée avec son contexte (capteur, seuil, valeur, actionneur) |
| **Validation humaine** | Les actions critiques nécessitent une confirmation explicite avant exécution |
| **Seuils modifiables** | Uniquement par les utilisateurs disposant du rôle autorisé (administrateur, responsable qualité) |
| **Historique des actions** | Consultable depuis le dashboard pour audit et analyse |
| **Verrouillage progressif** | En cas d'anomalie détectée (ex : boucle d'actions incorrecte), le système peut repasser en mode manuel |

---

## Limites actuelles

> **Important** : L'automatisation matérielle décrite dans ce document **n'est pas encore implémentée**. Le projet FutureKawa en phase 1 prépare l'architecture logicielle (collecte de données, alertes, dashboard) qui servira de base à cette automatisation future.

Les éléments suivants sont des **cibles de conception pour la phase 2** :

- Le moteur de règles n'existe pas encore
- Les actionneurs ne sont pas connectés
- Le module de validation humaine n'est pas développé
- La journalisation des actions automatiques n'est pas en place

---

## Seuils d'alerte — Colombie (démonstration IoT réelle)

Les seuils d'alerte du service Colombia ont été temporairement adaptés pour la démonstration locale du prototype IoT réel (Arduino UNO + DHT11) :

| Mesure | Plage acceptable |
|---|---|
| Température | 30°C – 36°C |
| Humidité | 30% – 45% |

Les valeurs réelles observées dans la pièce de démonstration (≈34°C, ≈38%) sont désormais considérées comme normales. Une alerte est créée si la température est inférieure à 30°C ou supérieure à 36°C, ou si l'humidité est inférieure à 30% ou supérieure à 45%.

> **Note** : Ces seuils Colombia sont adaptés pour la démonstration locale du prototype IoT réel. Dans un contexte métier réel, les seuils peuvent être reconfigurés selon les conditions de stockage attendues.

## Conclusion

Le schéma d'automatisation FutureKawa décrit la vision d'évolution du projet vers un système de régulation active de l'environnement de stockage du café vert. La phase 1 a posé les fondations : collecte de données, alertes et supervision. La phase 2 devra implémenter le moteur de règles, les actionneurs et les mécanismes de validation pour boucler la boucle **mesure → alerte → décision → action → journalisation**.