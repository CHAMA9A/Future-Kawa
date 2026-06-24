# Choix techniques — FutureKawa

## NestJS (Backend)

| Critère | Description |
|---|---|
| **Pourquoi ce choix** | Framework Node.js structuré (modules, contrôleurs, services, injection de dépendances) |
| **Avantage principal** | Architecture modulaire, TypeScript natif, écosystème mature et documentation riche |
| **Limite** | Courbe d'apprentissage initiale pour les débutants ; plus verbeux qu'Express |

NestJS est utilisé pour les **quatre services backend** (central + trois pays). Il permet une organisation claire du code avec des modules indépendants (lots, mesures, alertes, MQTT).

---

## React + TypeScript (Frontend)

| Critère | Description |
|---|---|
| **Pourquoi ce choix** | Bibliothèque frontend la plus répandue, grande communauté, écosystème riche |
| **Avantage principal** | Re-rendus optimisés via le DOM virtuel, TypeScript pour la robustesse, composants réutilisables |
| **Limite** | Boilerplate pour la gestion d'état ; nécessite des outils complémentaires (Vite, React Testing Library) |

Le frontend utilise **Vite** comme bundler pour des temps de build rapides et un rechargement à chaud (HMR) efficace.

---

## PostgreSQL (Base de données)

| Critère | Description |
|---|---|
| **Pourquoi ce choix** | Base relationnelle fiable, mature, open-source, idéale pour des données structurées |
| **Avantage principal** | Requêtes SQL puissantes, intégrité des données (ACID), excellente stabilité |
| **Limite** | Plus lourd qu'une base embarquée (SQLite) ; nécessite un conteneur ou une installation dédiée |

Chaque pays dispose de sa propre instance PostgreSQL, ce qui permet une isolation totale des données.

---

## Prisma (ORM)

| Critère | Description |
|---|---|
| **Pourquoi ce choix** | ORM moderne avec auto-complétion, migrations et typage fort |
| **Avantage principal** | Génération automatique du client TypeScript, schéma déclaratif, validation au compile-time |
| **Limite** | Requêtes complexes parfois moins flexibles que du SQL brut ; couche d'abstraction supplémentaire |

Prisma est utilisé dans les trois services pays pour interagir avec PostgreSQL. Les schémas sont identiques entre pays.

---

## Mosquitto / MQTT (IoT)

| Critère | Description |
|---|---|
| **Pourquoi ce choix** | Protocole IoT léger, standard de l'industrie, adapté aux capteurs à faible bande passante |
| **Avantage principal** | Communication publish/subscribe en temps réel, très faible empreinte mémoire |
| **Limite** | Nécessite un broker ; pas de mécanisme de requête/réponse natif (uniquement publish/subscribe) |

Un broker Mosquitto par pays isole les flux IoT. Le `MqttService` de chaque backend pays s'abonne au topic et traite les messages reçus en temps réel.

---

## Docker Compose (Environnement local)

| Critère | Description |
|---|---|
| **Pourquoi ce choix** | Déploiement local reproductible, pas de dépendances d'infrastructure externe |
| **Avantage principal** | Un seul fichier pour décrire toute l'infrastructure, démarrage en une commande, isolation réseau |
| **Limite** | Pas adapté pour un déploiement en production multi-serveurs ; nécessite Docker |

Docker Compose orchestre 11 conteneurs (bases de données, brokers MQTT, backends, frontend) avec un réseau interne, des volumes persistants et des healthchecks.

---

## Swagger (Documentation API)

| Critère | Description |
|---|---|
| **Pourquoi ce choix** | Standard de documentation d'API REST, interface interactive |
| **Avantage principal** | Génération automatique depuis les décorateurs NestJS, test des endpoints directement depuis le navigateur |
| **Limite** | Maintenir les décorateurs à jour avec le code ; pas de validation automatique de la spec |

Chaque backend expose Swagger sur `/api/docs` et la spécification JSON sur `/api/docs-json`.

---

## Jest / Vitest (Tests)

| Critère | Description |
|---|---|
| **Pourquoi ce choix** | Frameworks de test standards pour JavaScript/TypeScript |
| **Avantage principal** | Jest : mature, large écosystème, adapté à NestJS. Vitest : compatible Jest, plus rapide, intégré à Vite |
| **Limite** | Tests backend dépendants de la base de données (nécessitent Prisma) |

Les backends utilisent Jest (via le module `@nestjs/testing`). Le frontend utilise Vitest + React Testing Library pour les tests de composants.

---

## Jenkins (CI/CD)

| Critère | Description |
|---|---|
| **Pourquoi ce choix** | Solution de CI/CD open-source largement déployée, extensible par plugins |
| **Avantage principal** | Pipeline parallélisé (dépendances, tests backend en parallèle), intégration Git, rapports JUnit |
| **Limite** | Configuration déclarative parfois verbeuse ; maintenance du serveur Jenkins |

Le pipeline Jenkins exécute en séquence : checkout → install → génération Prisma → tests backend (parallèle) → tests frontend → build frontend → validation Docker Compose → (optionnel) build Docker.

---

## Future improvements

| Piste d'amélioration | Description |
|---|---|
| **Bridge Serial-to-MQTT complet** | Intégration physique complète du capteur Arduino UNO dans la chaîne applicative |
| **Migration ESP32** | Remplacer Arduino UNO par ESP32 (Wi-Fi intégré) pour supprimer le besoin de bridge série |
| **Monitoring Grafana** | Ajouter Grafana + Prometheus pour la supervision en temps réel des métriques et alertes |
| **Déploiement cloud** | Déployer l'infrastructure sur AWS, Azure ou GCP avec bases de données gérées (RDS) |
| **Kubernetes** | Orchester les microservices avec Kubernetes pour la scalabilité et la résilience en production |