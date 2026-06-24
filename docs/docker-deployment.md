# Déploiement Docker — FutureKawa

## Présentation

FutureKawa utilise **Docker Compose** pour orchestrer l'ensemble des services localement. Chaque composant (base de données, broker MQTT, backend, frontend) s'exécute dans son propre conteneur, ce qui garantit un environnement reproductible et isolé.

---

## Rôle du fichier docker-compose.yml

Le fichier `docker-compose.yml` à la racine du projet définit l'infrastructure complète :

- **12 conteneurs** au total
- **Réseaux** : les conteneurs communiquent entre eux via le réseau interne Docker, par leurs noms de service
- **Volumes** : les données PostgreSQL et Mosquitto sont persistées
- **Healthchecks** : les bases PostgreSQL ne sont déclarées opérationnelles qu'après validation
- **Ordre de démarrage** : `depends_on` avec conditions garantit que les dépendances sont prêtes

---

## Liste des conteneurs

| Conteneur | Image | Ports exposés | Dépend de |
|---|---|---|---|
| `postgres-brazil` | postgres:15-alpine | 5432 | — |
| `postgres-ecuador` | postgres:15-alpine | 5433 | — |
| `postgres-colombia` | postgres:15-alpine | 5434 | — |
| `mosquitto-brazil` | eclipse-mosquitto:2 | 1883, 9001 | — |
| `mosquitto-ecuador` | eclipse-mosquitto:2 | 1884, 9002 | — |
| `mosquitto-colombia` | eclipse-mosquitto:2 | 1885, 9003 | — |
| `brazil-service` | build local | 3001 | postgres-brazil (healthy) |
| `ecuador-service` | build local | 3011 | postgres-ecuador (healthy) |
| `colombia-service` | build local | 3012 | postgres-colombia (healthy) |
| `backend-central` | build local | 3002 | brazil, ecuador, colombia |
| `frontend` | build local | 5173 | backend-central |

---

## Commandes utiles

### Démarrer tous les services

```bash
docker compose up -d --build
```

- `-d` : mode détaché (arrière-plan)
- `--build` : reconstruit les images avant de démarrer

### Arrêter tous les services

```bash
docker compose down
```

Ajoutez `-v` pour supprimer également les volumes (données perdues) :

```bash
docker compose down -v
```

### Voir les conteneurs en cours d'exécution

```bash
docker ps
```

### Consulter les logs d'un service

```bash
# Logs d'un conteneur spécifique
docker logs brazil-service

# Logs en temps réel (follow)
docker logs -f brazil-service

# Logs de tous les services
docker compose logs
```

### Reconstruire sans cache

```bash
docker compose build --no-cache
```

---

## Ports exposés

| Port machine hôte | Port conteneur | Service |
|---|---|---|
| 5173 | 5173 | Frontend (Vite) |
| 3002 | 3002 | Backend Central |
| 3001 | 3001 | Brazil Service |
| 3011 | 3011 | Ecuador Service |
| 3012 | 3012 | Colombia Service |
| 5432 | 5432 | PostgreSQL Brésil |
| 5433 | 5432 | PostgreSQL Équateur |
| 5434 | 5432 | PostgreSQL Colombie |
| 1883 | 1883 | Mosquitto Brésil |
| 1884 | 1883 | Mosquitto Équateur |
| 1885 | 1883 | Mosquitto Colombie |
| 9001 | 9001 | Mosquitto WebSocket Brésil |
| 9002 | 9001 | Mosquitto WebSocket Équateur |
| 9003 | 9001 | Mosquitto WebSocket Colombie |

> Note : les trois bases PostgreSQL exposent des ports différents sur l'hôte mais le port 5432 en interne. De même pour Mosquitto.

---

## Volumes PostgreSQL

Les données persistent grâce à des volumes Docker nommés :

```yaml
volumes:
  postgres-brazil-data:
  postgres-ecuador-data:
  postgres-colombia-data:
```

Ces volumes sont conservés même après `docker compose down`. Pour les supprimer, utilisez `docker compose down -v`.

---

## Communication entre conteneurs

Les conteneurs communiquent entre eux via le **réseau interne Docker** en utilisant le nom du service comme hostname :

- `brazil-service` accède à PostgreSQL via `postgres-brazil:5432`
- `brazil-service` accède à Mosquitto via `mosquitto-brazil:1883`
- `backend-central` accède à `brazil-service:3001`, `ecuador-service:3011`, `colombia-service:3012`
- Le frontend accède au backend central via `backend-central:3002` (interne) ou `localhost:3002` (externe)

---

## Troubleshooting

### "container name already in use"

Un conteneur du même nom existe déjà (arrêté). Supprimez-le :

```bash
docker rm <container-name>
```

Ou arrêtez et supprimez tous les conteneurs :

```bash
docker compose down
```

### "port already allocated"

Un autre processus utilise déjà le port. Vérifiez avec :

```bash
# Identifier le processus
netstat -ano | findstr :<PORT>
# ou sur Linux
lsof -i :<PORT>
```

Solutions :
- Arrêter le processus conflictuel
- Modifier le port dans `docker-compose.yml`

### Backend not reachable

Le backend central ne parvient pas à joindre un service pays.

1. Vérifiez que le service est en cours d'exécution : `docker ps`
2. Consultez les logs : `docker logs <service-name>`
3. Vérifiez que le service a bien démarré (attendez le healthcheck PostgreSQL)

### Frontend unable to load data

Le frontend affiche "Unable to load data from central backend".

1. Vérifiez que `backend-central` tourne : `docker ps | grep backend-central`
2. Testez directement l'API : `curl http://localhost:3002/api/central/countries`
3. Vérifiez la variable `VITE_API_BASE_URL` dans le build frontend

### Database connection issue

Un service pays ne peut pas se connecter à PostgreSQL.

1. Vérifiez que PostgreSQL est healthy : `docker ps` (statut `healthy`)
2. Vérifiez les logs PostgreSQL : `docker logs postgres-brazil`
3. Vérifiez la chaîne de connexion `DATABASE_URL` dans la configuration du service