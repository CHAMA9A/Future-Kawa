# Tests automatisés — FutureKawa

## Stratégie de tests

FutureKawa applique une stratégie de **tests unitaires automatisés** sur l'ensemble des services backend et frontend. Chaque service dispose de sa propre suite de tests, exécutée de manière indépendante.

L'objectif est de valider le bon fonctionnement de chaque composant avant déploiement, dans le cadre du pipeline CI/CD Jenkins.

---

## Technologies utilisées

| Couche | Framework de test | Assertions |
|---|---|---|
| Backend (NestJS) | Jest | Expect (Jest) |
| Frontend (React) | Vitest + React Testing Library | Expect (Vitest) |

---

## Services testés

### Backend pays

Chaque service pays (Brazil, Ecuador, Colombia) teste :

- **LotsService** — création, liste, tri FIFO
- **MeasurementsService** — création, seuils, déclenchement d'alertes
- **AlertsService** — liste, vérification des lots périmés

### Backend central

- **CentralService** — agrégation des données depuis chaque pays, gestion des erreurs (pays injoignable)
- **CentralController** — routes API, réponses HTTP

### Frontend

- **Navbar** — navigation, sélecteur de pays, statut en ligne/hors ligne
- **DashboardCards** — affichage des cartes récapitulatives
- **TablesEmpty** — affichage des tableaux vides
- **DashboardError** — affichage des erreurs

---

## Nombre de tests

**96 tests automatisés** répartis comme suit :

| Service | Nombre de tests |
|---|---|
| Brazil Service | 20 |
| Ecuador Service | 17 |
| Colombia Service | 14 |
| Backend Central | 23 |
| Frontend | 22 |
| **Total** | **96** |

---

## Logs d'erreur attendus dans backend-central

Certains tests du backend central **simulent volontairement** l'indisponibilité d'un ou plusieurs services pays. Ces tests vérifient que le backend central :

- Gère correctement les erreurs HTTP (timeout, connexion refusée)
- Retourne un message d'erreur approprié
- Ne crée pas de panique ou de crash

Il est donc **normal** de voir des logs d'erreur de type `ECONNREFUSED` ou `request failed` lors de l'exécution des tests du backend central. Ces logs sont le signe que la gestion des erreurs fonctionne comme attendu.

---

## Commande globale de test (PowerShell)

```powershell
foreach ($p in @(".\backend-country\brazil-service", ".\backend-country\ecuador-service", ".\backend-country\colombia-service", ".\backend-central")) {
  Write-Host "`n===== TEST $p =====" -ForegroundColor Cyan
  npm --prefix $p test
  if ($LASTEXITCODE -ne 0) {
    Write-Host "`n❌ Tests failed in $p" -ForegroundColor Red
    break
  }
}

Write-Host "`n===== TEST FRONTEND =====" -ForegroundColor Cyan
npm --prefix .\frontend run test -- --run
```

### Commande build frontend

```powershell
npm --prefix .\frontend run build
```

---

## Exécution individuelle

```bash
# Backend pays
cd backend-country/brazil-service && npm test
cd backend-country/ecuador-service && npm test
cd backend-country/colombia-service && npm test

# Backend central
cd backend-central && npm test

# Frontend
cd frontend && npm run test -- --run
```

Tous les tests backend utilisent `jest --runInBand` pour éviter les problèmes mémoire en environnement CI.