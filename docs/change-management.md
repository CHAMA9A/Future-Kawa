# Accompagnement au changement — FutureKawa

## Objectif du change management

Ce document présente la stratégie d'accompagnement au changement pour le déploiement de FutureKawa. L'objectif est de faciliter l'adoption de l'outil par l'ensemble des utilisateurs, de minimiser les résistances et d'assurer une transition réussie vers la supervision numérique du stockage du café vert.

---

## Pourquoi l'accompagnement est nécessaire

Le passage d'un suivi manuel (relevés papier, tableaux Excel) à une supervision numérique automatisée représente un changement important dans les habitudes de travail. Sans accompagnement, les risques d'échec d'adoption sont élevés :

- Outil sous-utilisé
- Alertes ignorées
- Retour aux anciennes méthodes
- Perte de confiance dans le système

---

## Utilisateurs concernés

| Profil | Rôle dans le projet | Niveau technique |
|---|---|---|
| **Responsables d'entrepôt** | Utilisateurs principaux du dashboard, gestion des lots et alertes | Faible à moyen |
| **Équipes qualité** | Surveillance des seuils, validation des actions correctives | Moyen |
| **Équipes logistiques** | Gestion FIFO, expédition des lots, suivi des stocks | Faible à moyen |
| **Administrateurs techniques** | Maintenance du système, gestion des utilisateurs, configuration | Élevé |
| **Direction** | Supervision globale, indicateurs de performance, décisions stratégiques | Faible |

---

## Impacts du projet

| Avant FutureKawa | Après FutureKawa |
|---|---|
| Relevés manuels de température (papier) | Capteurs automatiques + dashboard temps réel |
| Alertes détectées tardivement | Alertes en temps réel avec notifications |
| Suivi FIFO approximatif | Tableau FIFO précis et automatisé |
| Données dispersées (Excel, papier) | Centralisation des données par pays |
| Traçabilité limitée | Historique complet et horodaté |
| Décisions correctives lentes | Décisions éclairées par les données en temps réel |

### Nouveautés pour les utilisateurs

- **Consultation d'un dashboard** : les utilisateurs doivent apprendre à naviguer dans l'interface
- **Interprétation des alertes** : comprendre les types d'alertes (température, humidité, lot périmé) et réagir en conséquence
- **Utilisation des données** : les décisions doivent s'appuyer sur les données du système
- **Veille technologique** : s'assurer que le système Docker tourne et que les services sont accessibles

---

## Risques d'adoption

| Risque | Niveau | Mitigation proposée |
|---|---|---|
| **Résistance au changement** | Élevé | Communication en amont, implication des utilisateurs dans le projet |
| **Manque de formation** | Élevé | Sessions de formation adaptées à chaque profil, guide utilisateur |
| **Peur de l'automatisation** | Moyen | Démonstration des limites du système, maintien de la validation humaine |
| **Mauvaise interprétation des alertes** | Moyen | Guide clair sur la signification des alertes, support technique |
| **Dépendance aux outils numériques** | Faible | Procédure de secours en cas d'indisponibilité |

---

## Plan d'accompagnement

Le plan se déroule en **5 phases** :

```
Informer → Communiquer → Former → Impliquer → Accompagner
```

### 1. Informer (avant le déploiement)

- Présentation du projet à l'ensemble des parties prenantes
- Explication des objectifs et des bénéfices attendus
- Calendrier prévisionnel du déploiement
- Réponse aux questions et inquiétudes

### 2. Communiquer (pendant le déploiement)

- Mise à jour régulière de l'avancement
- Canaux de communication dédiés (email, chat)
- Démonstrations régulières du dashboard
- Newsletters ou points d'étape hebdomadaires

### 3. Former (avant la mise en service)

- Sessions de formation adaptées à chaque profil d'utilisateur
- Mise à disposition du [guide utilisateur](user-guide.md)
- Ateliers pratiques sur le dashboard
- Formation spécifique pour les administrateurs techniques

### 4. Impliquer (pendant le pilote)

- Désignation d'ambassadeurs dans chaque équipe
- Recueil des retours utilisateurs
- Ajustements rapides basés sur les retours terrain
- Valorisation des utilisateurs pilotes

### 5. Accompagner (après le déploiement)

- Support technique réactif (hotline, chat)
- Documentation accessible en permanence
- Sessions de suivi à J+30, J+60, J+90
- Amélioration continue basée sur l'usage réel

---

## Actions concrètes

| Action | Public concerné | Période | Durée |
|---|---|---|---|
| **Session de présentation** | Tous | Avant déploiement | 1h |
| **Formation dashboard** | Responsables entrepôt, qualité | Avant mise en service | 2h |
| **Formation administration** | Administrateurs techniques | Avant mise en service | 3h |
| **Guide utilisateur** | Tous | Permanent | — |
| **Démonstration en direct** | Tous | Pendant pilote | 30 min/session |
| **Support technique** | Tous | Pendant et après déploiement | Permanent |
| **Période pilote** | 1 pays pilote | 4 semaines | Continue |
| **Recueil des retours** | Utilisateurs pilotes | J+15, J+30 | 30 min |
| **Session de bilan** | Tous | J+60 | 1h |

---

## Indicateurs de réussite

### KPI quantitatifs

| Indicateur | Cible | Mesure |
|---|---|---|
| Taux d'utilisation du dashboard | > 80 % des utilisateurs | Connexions quotidiennes |
| Nombre d'alertes traitées | > 90 % dans l'heure | Logs d'actions |
| Temps de réaction aux alertes | < 30 minutes | Horodatage alerte → action |
| Réduction des lots périmés | > 50 % en 6 mois | Comparaison avant/après |
| Formation complétée | 100 % des utilisateurs | Feuille de présence |

### KPI qualitatifs

| Indicateur | Méthode de mesure |
|---|---|
| Satisfaction utilisateur | Enquête à J+30 et J+90 |
| Facilité d'utilisation | Tests utilisateurs, observations |
| Confiance dans le système | Nombre de vérifications manuelles parallèles |
| Appropriation de l'outil | Suggestions d'amélioration provenant des utilisateurs |

---

## Phases du déploiement progressif

```
Semaine 1-2 : Préparation et information
   ↓
Semaine 3-4 : Formation des utilisateurs
   ↓
Semaine 5-8 : Pilote sur 1 pays (ex. Brésil)
   ↓ ← Ajustements basés sur les retours
Semaine 9-10 : Déploiement Équateur
   ↓
Semaine 11-12 : Déploiement Colombie
   ↓
Semaine 13+ : Suivi et amélioration continue
```

---

## Conclusion

L'accompagnement au changement est un facteur clé de succès du projet FutureKawa. Au-delà de la qualité technique de l'application, c'est l'adoption par les utilisateurs qui déterminera la valeur réelle apportée au suivi du stockage du café vert.

En combinant information, formation, implication et support, ce plan vise à transformer la transition numérique en opportunité d'amélioration des processus pour toutes les équipes concernées.