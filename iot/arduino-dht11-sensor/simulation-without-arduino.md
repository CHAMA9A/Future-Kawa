# FutureKawa — Simulation MQTT sans Arduino

Cette simulation reproduit le comportement d'un capteur MQTT en publiant
directement un payload JSON dans Mosquitto via `docker exec`.

Aucun matériel ni Arduino IDE n'est nécessaire : les données sont publiées
directement depuis le terminal en utilisant la commande `mosquitto_pub`
à l'intérieur de chaque container Mosquitto.

## Prérequis

- Docker et Docker Compose installés
- Les containers Mosquitto doivent être en cours d'exécution :

```powershell
docker compose up -d
```

## Commandes de simulation

### Brazil

```powershell
'{"warehouseName":"Warehouse Brazil 1","temperature":34,"humidity":60}' | docker exec -i mosquitto-brazil mosquitto_pub -h localhost -t futurekawa/brazil/warehouse-1/measurements -l
```

### Ecuador

```powershell
'{"warehouseName":"Warehouse Ecuador 1","temperature":35,"humidity":65}' | docker exec -i mosquitto-ecuador mosquitto_pub -h localhost -t futurekawa/ecuador/warehouse-1/measurements -l
```

### Colombia

```powershell
'{"warehouseName":"Warehouse Colombia 1","temperature":30,"humidity":85}' | docker exec -i mosquitto-colombia mosquitto_pub -h localhost -t futurekawa/colombia/warehouse-1/measurements -l
```

## Résultat attendu

Quand une mesure est publiée, le flux suivant se déclenche :

1. Le backend pays (brazil-service, ecuador-service, colombia-service)
   écoute le topic MQTT et reçoit la mesure
2. La mesure est sauvegardée dans PostgreSQL
3. Les seuils de température et d'humidité sont vérifiés
4. Si un seuil est dépassé → une alerte est créée automatiquement
5. Le backend central récupère les données via son API HTTP
6. Le frontend affiche les mesures et alertes dans le dashboard

## Vérification

Après avoir publié une mesure, vérifier les données :

```powershell
# Voir les mesures
Invoke-RestMethod -Uri "http://localhost:3001/api/measurements" -Method Get

# Voir les alertes
Invoke-RestMethod -Uri "http://localhost:3001/api/alerts" -Method Get
```

## Scénarios de test

| Scénario | Payload | Résultat attendu |
|---|---|---|
| Température normale | `{"temperature":25,"humidity":55}` | Aucune alerte |
| Température trop haute | `{"temperature":35,"humidity":55}` | Alerte TEMPERATURE |
| Humidité trop haute | `{"temperature":25,"humidity":90}` | Alerte HUMIDITY |
| Les deux hors seuil | `{"temperature":35,"humidity":90}` | Alertes TEMPERATURE + HUMIDITY |