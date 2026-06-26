# Guide utilisateur — FutureKawa

## Objectif de ce guide

Ce guide vous explique comment utiliser l'application **FutureKawa** pour suivre le stockage du café vert dans les entrepôts de plusieurs pays. Il est destiné aux utilisateurs non techniques : responsables d'entrepôt, équipes qualité et logistique.

---

## Présentation de FutureKawa

FutureKawa est une application de **supervision du stockage du café vert**. Elle permet de :

- Consulter les **lots de café** stockés par entrepôt
- Suivre la **règle FIFO** (First In, First Out) pour connaître l'ordre de sortie des lots
- Visualiser les **mesures de température et d'humidité** en temps réel
- Recevoir des **alertes** en cas de dépassement des seuils de conservation

L'application couvre trois pays producteurs de café : **Brésil**, **Équateur** et **Colombie**.

---

## Accès à l'application

L'application est accessible depuis un navigateur web à l'adresse :

```
http://localhost:5173
```

> **Prérequis** : L'application doit être lancée avec Docker. Voir la section "Comment lancer l'application" plus bas.

---

## Présentation du dashboard

Le dashboard est l'écran principal de FutureKawa. Il se compose de plusieurs sections :

| Section | Description |
|---|---|
| **Vue d'ensemble** | Indicateurs clés : nombre de lots, mesures, alertes |
| **Température & Humidité** | Graphique d'évolution des mesures dans le temps |
| **Répartition des alertes** | Graphique circulaire montrant la répartition par type d'alerte |
| **Lots en stock** | Tableau détaillant tous les lots présents dans l'entrepôt |
| **Sortie FIFO** | Liste des lots triés par date d'entrée (du plus ancien au plus récent) |
| **Mesures capteurs** | Tableau chronologique des mesures de température et humidité |
| **Alertes** | Liste des alertes générées |
| **Navigation** | Barre de navigation permettant de sauter rapidement à chaque section |

---

## Choisir un pays

FutureKawa couvre trois pays. Pour changer de pays :

1. Utilisez le **sélecteur de pays** dans la barre de navigation (en haut de l'écran)
2. Cliquez sur le pays souhaité :

   - **Brazil**
   - **Ecuador**
   - **Colombia**

Le dashboard se met à jour automatiquement pour afficher les données du pays sélectionné.

---

## Consulter les lots

La section **"Lots en stock"** affiche un tableau avec les informations suivantes :

| Colonne | Description |
|---|---|
| Identifiant | Numéro unique du lot |
| Entrepôt | Entrepôt de stockage |
| Type de café | Variété de café (Arabica, Robusta, etc.) |
| Poids | Quantité en kilogrammes |
| Date d'entrée | Date d'arrivée dans l'entrepôt |
| Statut | CONFORME, EN_ALERTE ou PERIME |

---

## Consulter les lots FIFO

La section **"Sortie FIFO"** (First In, First Out) présente la liste des lots triés du **plus ancien** au **plus récent**. Cela permet de savoir quels lots doivent sortir en priorité pour respecter la règle de gestion des stocks : les premiers arrivés sont les premiers à être expédiés.

---

## Consulter les mesures capteurs

La section **"Mesures capteurs"** affiche l'historique des relevés de température et d'humidité provenant des capteurs IoT installés dans les entrepôts.

Chaque ligne indique :

- La **date et l'heure** de la mesure
- L'**entrepôt** concerné
- La **température** en °C
- L'**humidité** en %

Les données sont également visibles sous forme de **graphique d'évolution** dans la section "Température & Humidité".

---

## Consulter les alertes

La section **"Alertes"** liste tous les événements anormaux détectés automatiquement :

| Type d'alerte | Signification | Cause possible |
|---|---|---|
| **TEMPERATURE** | La température dépasse les seuils autorisés | Équipement de réfrigération défectueux, porte d'entrepôt ouverte |
| **HUMIDITY** | L'humidité dépasse les seuils autorisés | Problème de ventilation, infiltration |
| **EXPIRED_LOT** | Un lot de café est stocké depuis plus de 365 jours | Lot oublié ou non priorisé en sortie |

### Interpréter les alertes

- Une alerte **TEMPERATURE** signifie que la température de l'entrepôt n'est plus dans la plage recommandée pour la conservation du café vert.
- Une alerte **HUMIDITY** indique un taux d'humidité trop élevé ou trop bas, ce qui peut dégrader la qualité du café.
- Une alerte **EXPIRED_LOT** signale qu'un lot a dépassé la durée de conservation maximale d'un an.

Les seuils exacts varient par pays en fonction des conditions climatiques locales.

---

## Tester l'API avec Swagger

Swagger est une interface qui permet de tester les API directement depuis le navigateur, sans outil supplémentaire.

### Accès Swagger par service

| Service | URL Swagger |
|---|---|
| Brésil | http://localhost:3001/api/docs |
| Équateur | http://localhost:3011/api/docs |
| Colombie | http://localhost:3012/api/docs |
| Central | http://localhost:3002/api/docs |

Depuis Swagger, vous pouvez :

- Voir la liste complète des endpoints disponibles
- Lire la description de chaque endpoint
- Tester un appel API en cliquant sur **"Try it out"**
- Voir la réponse JSON renvoyée par le serveur

---

## Lancer l'application localement

### Prérequis

- **Docker** et **Docker Compose** installés sur votre machine

### Commandes

```powershell
# Démarrer tous les services
docker compose up -d --build
```

```powershell
# Vérifier que tous les services tournent
docker ps
```

```powershell
# Arrêter tous les services
docker compose down
```

Après le démarrage, attendez environ **30 à 60 secondes** que tous les services soient prêts, puis ouvrez `http://localhost:5173` dans votre navigateur.

> **Conseil** : Pour éviter de perdre les données, ne lancez `docker compose down -v` que si vous souhaitez réinitialiser complètement les bases de données.

---

## Dépannage simple

### "Le frontend est inaccessible"

1. Vérifiez que Docker Compose est en cours d'exécution : `docker ps`
2. Vérifiez que le conteneur `frontend` apparaît dans la liste
3. Attendez quelques secondes et rechargez la page

### "Le backend est indisponible"

- Le message "Unable to load data from central backend" s'affiche sur le dashboard
- Vérifiez que le conteneur `backend-central` tourne : `docker ps | grep backend-central`
- Attendez la fin du démarrage complet de tous les conteneurs

### "Aucune donnée n'est affichée"

- Si le dashboard est vide mais que le sélecteur de pays fonctionne, il n'y a peut-être pas encore de données
- Lancez une simulation MQTT (voir documentation [MQTT](mqtt-documentation.md))
- La page se recharge automatiquement après quelques secondes

### "Docker n'est pas lancé"

- Ouvrez Docker Desktop ou lancez le moteur Docker
- Réexécutez `docker compose up -d --build`

### "Conflit de port"

- Si vous voyez une erreur "port already allocated", un autre service utilise déjà le port nécessaire
- Vérifiez quel processus occupe le port avec :

  ```powershell
  netstat -ano | findstr :<PORT>
  ```

- Arrêtez le processus conflictuel ou modifiez la configuration Docker

---

## En cas de doute

Consultez les documentations complémentaires dans le dossier `docs/` ou contactez votre administrateur technique.