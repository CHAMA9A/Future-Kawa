# Intégration ERP / progiciel

## Objectif

FutureKawa expose des API REST documentées (Swagger) qui permettent son intégration dans un système d'information existant, qu'il s'agisse d'un ERP complet (SAP, Odoo, Microsoft Dynamics) ou d'un progiciel métier spécialisé.

Cette documentation décrit comment un système externe peut interagir avec FutureKawa pour exploiter ses données de supervision des stocks de café vert.

## Positionnement

FutureKawa **n'est pas un ERP complet**. Il ne couvre pas la comptabilité, les achats, les ventes, la paie ou la gestion des ressources humaines.

FutureKawa est une **application métier spécialisée** dans :

- le suivi des lots de café vert (tragabilité, statut, date d'entrée)
- la supervision des mesures IoT (température, humidité)
- la gestion des alertes qualité (dépassement de seuils, lots périmés)
- la sortie FIFO (premier entré, premier sorti)
- la configuration des seuils d'alerte par pays

FutureKawa peut être utilisé comme **brique métier intégrable** dans un système d'information plus large, apportant une couche de supervision qualité et IoT spécialisée pour le stockage du café vert.

## Architecture d'intégration

```
ERP / Progiciel externe
        │
        │ API REST (HTTP/JSON)
        ▼
┌─────────────────────────────┐
│   Backend Central (NestJS)  │  ← Point d'entrée unique pour l'ERP
│   Port 3002                 │
└────────────┬────────────────┘
             │
    ┌────────┼────────┐
    ▼        ▼        ▼
┌──────┐ ┌──────┐ ┌──────┐
│Brazil│ │Ecuador│ │Colomb│  ← Backends pays
│:3001 │ │:3011  │ │:3012 │
└──┬───┘ └──┬───┘ └──┬───┘
   │        │        │
   ▼        ▼        ▼
  PGSQL    PGSQL    PGSQL    ← Bases de données pays
  Mosq.    Mosq.    Mosq.    ← Brokers MQTT (IoT)
```

L'ERP externe interroge uniquement le **backend central** (port 3002). Ce dernier route les appels vers les services pays concernés. Cela permet à l'ERP de n'avoir qu'un seul point d'accès pour les trois pays.

## APIs utilisables par un ERP

| Besoin ERP | Endpoint FutureKawa | Description |
| ---------- | ------------------- | ----------- |
| Consulter les pays disponibles | `GET /api/central/countries` | Retourne la liste des pays avec leur URL de service et leur statut |
| Consulter les lots par pays | `GET /api/central/:country/lots` | Liste tous les lots de café vert d'un pays, du plus récent au plus ancien |
| Consulter la sortie FIFO | `GET /api/central/:country/lots/fifo` | Liste les lots triés par date d'entrée (FIFO) pour prioriser les sorties |
| Consulter les mesures IoT | `GET /api/central/:country/measurements` | Retourne les relevés de température et d'humidité d'un entrepôt |
| Consulter les alertes qualité | `GET /api/central/:country/alerts` | Liste les alertes qualité (température, humidité, lots périmés) |
| Consulter les seuils d'alerte | `GET /api/central/:country/thresholds` | Retourne les seuils de température et d'humidité configurés |
| Modifier les seuils d'alerte | `PUT /api/central/:country/thresholds` | Met à jour les seuils d'alerte d'un pays |
| Réinitialiser les seuils | `POST /api/central/:country/thresholds/reset` | Réinitialise les seuils aux valeurs par défaut |
| Ajouter un lot | `POST /api/lots` | Crée un nouveau lot dans le backend pays concerné |

Tous ces endpoints sont documentés via Swagger :

- Backend central : `http://localhost:3002/api/docs`
- Brazil : `http://localhost:3001/api/docs`
- Ecuador : `http://localhost:3011/api/docs`
- Colombia : `http://localhost:3012/api/docs`

## Exemple de scénario d'intégration

### Sortie FIFO déclenchée par un ERP

1. Un ERP externe souhaite connaître les lots à sortir en priorité d'un entrepôt colombien
2. Il appelle : `GET /api/central/colombia/lots/fifo`
3. FutureKawa retourne la liste des lots triés du plus ancien au plus récent
4. L'ERP exploite cette liste pour préparer une opération logistique (ordre de sortie, étiquetage, expédition)

### Détection d'alerte qualité

1. Un ERP reçoit une information de dépassement de seuil de température
2. Il interroge les dernières mesures : `GET /api/central/colombia/measurements`
3. Il ajuste les seuils si nécessaire : `PUT /api/central/colombia/thresholds`
4. Il déclenche une action corrective dans son propre système (blocage de lot, alerte opérateur)

## Apport pour l'entreprise

- **Centralisation des données qualité** : Toutes les données IoT et alertes sont accessibles depuis un point d'entrée unique
- **Meilleure traçabilité** : Les lots sont suivis de l'entrée en stock jusqu'à la sortie, avec historisation des conditions de conservation
- **Interconnexion avec le système d'information** : Les API REST permettent d'alimenter un ERP, un datalake ou un outil de BI
- **Réduction des saisies manuelles** : Les données IoT sont collectées automatiquement (capteurs + MQTT), sans intervention humaine
- **Préparation à une intégration ERP future** : L'architecture API-first et la documentation Swagger facilitent le raccordement à un ERP lors d'un déploiement en production
- **Meilleure exploitation des données IoT** : Les mesures de température et d'humidité sont interprétées, seuillées et traduites en alertes exploitables par un système tiers

## Limites actuelles

- **Pas de connecteur ERP prêt à l'emploi** : L'intégration repose sur les API REST brutes ; aucun connecteur spécifique (Odoo, SAP, etc.) n'est encore développé
- **Pas d'authentification API avancée** : Les endpoints ne sont pas protégés par token ou clé API ; l'authentification est à prévoir avant une mise en production connectée à un ERP
- **Pas de synchronisation bidirectionnelle** : FutureKawa expose ses données mais ne reçoit pas de mises à jour depuis un ERP (pas de webhooks entrants, pas de synchronisation automatisée des lots)
- **Pas de mapping complet avec un ERP réel** : Les données FutureKawa (lots, mesures, alertes) ne sont pas encore mappées aux objets métier d'un ERP standard

## Évolutions possibles

- **Connecteur Odoo** : Module Odoo pour synchroniser automatiquement les lots et les alertes
- **Connecteur SAP** : Interface RFC/REST pour intégrer FutureKawa dans un environnement SAP
- **Synchronisation automatique des lots** : Création et mise à jour des lots depuis l'ERP vers FutureKawa
- **Export CSV/JSON** : Export des données (lots, mesures, alertes) aux formats standards pour import dans un ERP ou un outil de BI
- **Authentification API par token** : Protection des endpoints par clé API ou JWT pour sécuriser les échanges avec un ERP
- **Webhooks** : Notification automatique vers un ERP lors de la création d'une alerte (température, humidité, lot périmé)
- **Stockage des seuils en base de données** : Persistance des seuils d'alerte pour qu'ils survivent aux redémarrages des conteneurs

## Conclusion

FutureKawa répond partiellement à la compétence ERP / progiciel de la grille d'évaluation. Il expose une **architecture API-first** complète, documentée via Swagger, et peut être intégré dans un système d'information existant grâce à ses **endpoints REST**. Les données de supervision des stocks (lots, mesures IoT, alertes, seuils) sont accessibles depuis un point d'entrée unique (backend central), ce qui facilite le raccordement à un ERP ou à un progiciel tiers. Les limites actuelles (absence d'authentification, pas de connecteurs prêts à l'emploi, synchronisation unidirectionnelle) sont clairement identifiées et peuvent être levées dans une évolution future du projet.