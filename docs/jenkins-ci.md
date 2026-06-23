# Jenkins CI — FutureKawa

Ce document explique la configuration et l'exécution du pipeline Jenkins CI pour le projet FutureKawa.

## Objectif du pipeline

Le pipeline Jenkins valide automatiquement le projet à chaque push :

- Installation des dépendances (npm ci)
- Génération des clients Prisma
- Exécution des **95 tests unitaires** (backends pays, backend central, frontend)
- Build du frontend
- Validation du fichier `docker-compose.yml`
- Build Docker optionnel

Le pipeline ne déploie rien. Il s'arrête après la validation.

## Prérequis Jenkins

### Agents / Exécuteurs

- Jenkins Master (ou agent) avec accès à **Node.js 20+**, **npm**, **Docker** et **Docker Compose**
- Environ 4 Go de RAM disponibles (les tests Jest en `--runInBand` limitent la consommation mémoire)

### Outils système requis

| Outil | Version minimale | Utilisation |
|---|---|---|
| Node.js | 20.x | Exécution des tests et build |
| npm | 10.x | Gestion des dépendances |
| Docker | 24+ | Validation Docker Compose |
| Docker Compose | 2.x | Validation et build optionnel |

## Plugins Jenkins utiles

| Plugin | Utilité |
|---|---|
| **Pipeline** (inclus dans "Pipeline Suite") | Exécution du Jenkinsfile |
| **Git** | Checkout du dépôt |
| **JUnit** | Publication des résultats de tests |
| **NodeJS** | Gestion des versions de Node.js (optionnel) |
| **Docker Pipeline** | Build Docker (optionnel) |
| **Blue Ocean** | Interface visuelle du pipeline (recommandé) |
| **Workspace Cleanup** | Nettoyage après le build |

## Configuration d'un job Pipeline

### 1. Créer un nouveau job

1. Depuis Jenkins, cliquer sur **New Item**
2. Saisir un nom (ex: `FutureKawa-CI`)
3. Choisir **Pipeline**
4. Cliquer **OK**

### 2. Configurer le Pipeline

1. Section **Pipeline** → **Definition** → **Pipeline script from SCM**
2. **SCM** → **Git**
3. **Repository URL** → URL du dépôt GitHub
4. **Branch** → `*/master` (ou la branche souhaitée)
5. **Script Path** → `Jenkinsfile`
6. Sauvegarder

### 3. (Optionnel) Configurer un Webhook GitHub

Pour déclencher le pipeline automatiquement à chaque push :

1. Dans le dépôt GitHub : **Settings → Webhooks → Add webhook**
2. **Payload URL** : `http://<jenkins-url>/github-webhook/`
3. **Content type** : `application/json`
4. **Events** : Sélectionner "Just the push event"
5. Ajouter le webhook

### 4. Variables d'environnement

| Variable | Valeur par défaut | Description |
|---|---|---|
| `BUILD_DOCKER` | `false` | Mettre à `true` pour exécuter `docker compose build` |

## Pipeline complet — Étapes détaillées

```
Checkout
   ↓
Environment Information (node --version, npm --version, docker info)
   ↓
Install Dependencies [parallèle 5 branches]
   ├── Brazil Service   → npm ci
   ├── Ecuador Service  → npm ci
   ├── Colombia Service → npm ci
   ├── Backend Central  → npm ci
   └── Frontend         → npm ci
   ↓
Generate Prisma Clients [parallèle 3 branches]
   ├── Brazil   → npx prisma generate
   ├── Ecuador  → npx prisma generate
   └── Colombia → npx prisma generate
   ↓
Run Backend Tests [parallèle 4 branches]
   ├── Brazil Tests   → npm test (jest --runInBand)
   ├── Ecuador Tests  → npm test (jest --runInBand)
   ├── Colombia Tests → npm test (jest --runInBand)
   └── Central Tests  → npm test (jest --runInBand)
   ↓
Run Frontend Tests → npm run test -- --run
   ↓
Build Frontend → npm run build
   ↓
Validate Docker Compose → docker compose config
   ↓
Docker Build Check (optionnel, BUILD_DOCKER=true) → docker compose build
   ↓
Post → nettoyage + rapport
```

## Commandes exécutées

### Backends pays (brazil, ecuador, colombia)

```bash
cd backend-country/<service>
npm ci
npx prisma generate
npm test                        # jest --runInBand
```

### Backend central

```bash
cd backend-central
npm ci
npm test                        # jest --runInBand
```

### Frontend

```bash
cd frontend
npm ci
npm run test -- --run           # vitest run
npm run build                   # tsc + vite build
```

### Validation Docker Compose

```bash
docker compose config           # vérifie la syntaxe du YAML
docker compose build            # build optionnel (tous les services)
```

## Interprétation des résultats

### Build réussi ✅

Le pipeline est **vert** (succès) quand :

1. Toutes les dépendances sont installées sans erreur
2. Les clients Prisma sont générés
3. Les **95 tests** passent (19 + 17 + 14 + 23 + 22)
4. Le frontend build sans erreur
5. `docker compose config` retourne un code de sortie 0

### Build échoué ❌

Le pipeline est **rouge** (échec) quand une ou plusieurs étapes échouent.

| Symptôme | Cause probable | Action |
|---|---|---|
| `npm ci` échoue | Package.json modifié, package-lock.json manquant | Vérifier les dépendances |
| `npx prisma generate` échoue | Schéma Prisma invalide | Vérifier `schema.prisma` |
| Test Jest échoue | Assertion non respectée | Consulter le rapport JUnit |
| `npm run build` échoue | Erreur TypeScript ou Vite | Corriger le code frontend |
| `docker compose config` échoue | Syntaxe YAML invalide dans docker-compose.yml | Vérifier l'indentation |

### Rapports JUnit

Les résultats des tests sont publiés dans Jenkins via le plugin JUnit. Vous pouvez :

- Voir la tendance historique des tests
- Identifier les tests qui échouent
- Voir la durée d'exécution de chaque test

## Lancer tous les tests localement (PowerShell)

```powershell
cd C:\Users\sav\Downloads\Future-Kawa
foreach ($p in @(".\backend-country\brazil-service", ".\backend-country\ecuador-service", ".\backend-country\colombia-service", ".\backend-central")) {
    npm --prefix $p test
    if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
}
npm --prefix .\frontend run test -- --run
```

## Sécurité

- Le Jenkinsfile **ne contient aucun secret** (mot de passe, token, clé API)
- Aucun fichier `.env` n'est inclus
- Les variables sensibles doivent être gérées via les **credentials Jenkins** si nécessaire
- Le build Docker peut être activé/désactivé via la variable `BUILD_DOCKER` sans secret