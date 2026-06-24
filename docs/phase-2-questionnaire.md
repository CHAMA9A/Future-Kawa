# Questionnaire phase 2 — Préparation de l'évolution FutureKawa

## Objectif

Ce questionnaire accompagne la **phase 2** du projet FutureKawa. Les réponses permettront d'orienter les développements futurs vers une automatisation plus poussée du suivi du stockage du café vert.

Chaque thème aborde un aspect différent de l'évolution : métier, automatisation, sécurité, exploitation, données, infrastructure et accompagnement.

---

## A. Besoins métier

### 1. Quels indicateurs sont prioritaires pour les responsables d'entrepôt ?

- [ ] Température moyenne par entrepôt
- [ ] Humidité moyenne par entrepôt
- [ ] Nombre d'alertes par jour/semaine/mois
- [ ] Taux de rotation des stocks (FIFO respecté ou non)
- [ ] Volume total stocké par variété de café
- [ ] Âge moyen des lots en stock
- [ ] Temps de réaction aux alertes
- [ ] Autre : \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

### 2. Quels seuils doivent être personnalisables ?

- [ ] Température minimale et maximale
- [ ] Humidité minimale et maximale
- [ ] Durée maximale de stockage (péremption)
- [ ] Fréquence minimale de réception des mesures capteurs
- [ ] Autre : \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

### 3. Les seuils doivent-ils être identiques par pays, entrepôt ou type de lot ?

- [ ] Par pays uniquement
- [ ] Par entrepôt
- [ ] Par type de café / variété de lot
- [ ] Autre : \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

### 4. Quels rapports sont nécessaires ?

- [ ] Rapport hebdomadaire des alertes
- [ ] Rapport mensuel des lots périmés
- [ ] Rapport de conformité par entrepôt
- [ ] Historique des températures minimales et maximales
- [ ] Rapport FIFO : lots en attente de sortie depuis plus de X jours
- [ ] Autre : \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

---

## B. Automatisation

### 5. Quelles actions doivent être automatisées en cas d'alerte ?

- [ ] Notification par email
- [ ] Notification par SMS
- [ ] Notification push dans le dashboard
- [ ] Déclenchement d'un actionneur physique
- [ ] Escalade vers un responsable
- [ ] Création d'un ticket dans un outil de ticketing
- [ ] Autre : \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

### 6. Faut-il déclencher une ventilation automatique ?

- [ ] Oui, sans validation humaine
- [ ] Oui, mais seulement après validation humaine
- [ ] Non
- [ ] À définir

### 7. Faut-il déclencher une humidification ?

- [ ] Oui, sans validation humaine
- [ ] Oui, mais seulement après validation humaine
- [ ] Non
- [ ] À définir

### 8. Faut-il déclencher un chauffage ou refroidissement ?

- [ ] Oui, sans validation humaine
- [ ] Oui, mais seulement après validation humaine
- [ ] Non
- [ ] À définir

### 9. Faut-il toujours demander une validation humaine avant action ?

- [ ] Oui, pour toute action
- [ ] Uniquement pour les actions à fort impact (chauffage, refroidissement)
- [ ] Non, tout doit être automatique
- [ ] Autre : \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

---

## C. Sécurité

### 10. Qui peut modifier les seuils ?

- [ ] Administrateurs uniquement
- [ ] Responsables d'entrepôt
- [ ] Équipe qualité
- [ ] Tous les utilisateurs
- [ ] Autre : \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

### 11. Qui peut valider une action automatique ?

- [ ] Responsable d'entrepôt
- [ ] Équipe qualité
- [ ] Direction
- [ ] Administrateur technique
- [ ] Autre : \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

### 12. Faut-il une traçabilité des actions ?

- [ ] Oui, complète (qui a fait quoi, quand)
- [ ] Oui, limitée aux alertes et actions automatisées
- [ ] Non
- [ ] Autre : \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

### 13. Faut-il des rôles utilisateurs ?

- [ ] Oui (administrateur, responsable, technicien, observateur)
- [ ] Oui, mais simples (administrateur et utilisateur)
- [ ] Non, accès identique pour tous
- [ ] Autre : \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

---

## D. Exploitation et maintenance

### 14. Qui surveille les alertes ?

- [ ] Responsable d'entrepôt
- [ ] Équipe qualité
- [ ] Équipe technique (maintenance)
- [ ] Direction
- [ ] Personnel dédié à la supervision
- [ ] Autre : \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

### 15. À quelle fréquence les capteurs doivent-ils envoyer les mesures ?

- [ ] Toutes les 1 minute
- [ ] Toutes les 5 minutes
- [ ] Toutes les 15 minutes
- [ ] Toutes les 30 minutes
- [ ] Toutes les heures
- [ ] Autre : \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

### 16. Que faire si un capteur est indisponible ?

- [ ] Alerter un technicien automatiquement
- [ ] Attendre X minutes avant de déclencher une alerte
- [ ] Basculer sur un capteur de secours
- [ ] Ignorer et continuer la surveillance
- [ ] Autre : \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

### 17. Comment gérer une panne MQTT ou backend ?

- [ ] File d'attente locale sur le capteur (replay automatique)
- [ ] Notification d'urgence à l'équipe technique
- [ ] Basculement vers un broker secondaire
- [ ] Mise en cache des dernières données valides
- [ ] Autre : \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

---

## E. Données et reporting

### 18. Quelle durée de conservation des mesures ?

- [ ] 3 mois
- [ ] 6 mois
- [ ] 1 an
- [ ] 2 ans
- [ ] Illimité
- [ ] Autre : \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

### 19. Quels exports sont nécessaires ?

- [ ] Export CSV des mesures
- [ ] Export CSV des alertes
- [ ] Export PDF des rapports
- [ ] Export Excel des lots
- [ ] API pour connexion à un outil externe (ERP)
- [ ] Autre : \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

### 20. Quels KPI doivent apparaître dans le dashboard ?

- [ ] Température moyenne
- [ ] Humidité moyenne
- [ ] Nombre d'alertes actives
- [ ] Lots périmés (quantité et valeur)
- [ ] Taux de conformité des lots
- [ ] Temps moyen entre alerte et action corrective
- [ ] Autre : \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

### 21. Faut-il des rapports mensuels ?

- [ ] Oui, générés automatiquement
- [ ] Oui, mais à la demande uniquement
- [ ] Non
- [ ] Autre : \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

---

## F. Infrastructure

### 22. L'application doit-elle être déployée dans le cloud ?

- [ ] Oui, sur AWS
- [ ] Oui, sur Azure
- [ ] Oui, sur Google Cloud
- [ ] Non, en local (on-premise)
- [ ] Non, hybride (cloud + local)
- [ ] À définir
- [ ] Autre : \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

### 23. Faut-il Kubernetes ?

- [ ] Oui, pour l'orchestration des microservices
- [ ] Oui, pour la scalabilité automatique
- [ ] Non, Docker Compose suffit
- [ ] À définir
- [ ] Autre : \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

### 24. Faut-il Grafana / Prometheus ?

- [ ] Oui, pour la supervision des serveurs
- [ ] Oui, pour les métriques applicatives
- [ ] Non
- [ ] À définir

### 25. Faut-il une supervision temps réel ?

- [ ] Oui, avec alerting (PagerDuty, OpsGenie)
- [ ] Oui, sans alerting
- [ ] Non
- [ ] À définir

---

## G. Accompagnement au changement

### 26. Quels utilisateurs doivent être formés ?

- [ ] Responsables d'entrepôt
- [ ] Technicients de maintenance
- [ ] Équipe qualité
- [ ] Équipe logistique
- [ ] Direction
- [ ] Administrateurs système
- [ ] Autre : \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

### 27. Quels supports sont nécessaires ?

- [ ] Guide utilisateur papier
- [ ] Guide utilisateur PDF
- [ ] Tutoriel vidéo
- [ ] Session de démonstration en direct
- [ ] FAQ en ligne
- [ ] Support chat / hotline
- [ ] Autre : \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

### 28. Quels risques d'adoption sont identifiés ?

- [ ] Réticence à utiliser un outil numérique
- [ ] Crainte de perte d'emploi liée à l'automatisation
- [ ] Difficultés techniques pour les utilisateurs non familiers
- [ ] Manque de temps pour la formation
- [ ] Méfiance envers les alertes automatiques (fausses alertes)
- [ ] Autre : \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

### 29. Quel planning de déploiement progressif ?

- [ ] Pilote sur un seul pays, puis extension
- [ ] Pilote sur un seul entrepôt, puis extension
- [ ] Déploiement complet immédiat
- [ ] Par phase : dashboard d'abord, puis automatisation
- [ ] Autre : \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

---

## Conclusion

Ce questionnaire constitue la première étape de la **phase 2** du projet FutureKawa. Les réponses collectées auprès des parties prenantes (métier, technique, direction) permettront de :

1. **Prioriser** les fonctionnalités à développer
2. **Définir** les règles d'automatisation adaptées à chaque pays
3. **Concevoir** l'architecture de sécurité et de traçabilité
4. **Planifier** le déploiement et l'accompagnement au changement

Une fois ce questionnaire renseigné, une session de travail sera organisée pour consolider les réponses et établir la feuille de route de la phase 2.