# MailHog — Notification email FutureKawa

## Objectif

MailHog est un serveur SMTP de test qui capture les emails envoyés par FutureKawa et les rend visibles dans une interface web. Il permet de démontrer la fonctionnalité d'alerte par email sans avoir besoin d'un vrai serveur SMTP.

## Architecture

```
Alerte (température, humidité, lot périmé)
        │
        ▼
EmailService (NestJS - backend central)
        │
        │ SMTP (port 1025)
        ▼
    MailHog (conteneur Docker)
        │
        ▼
Interface web http://localhost:8025
```

## Services

| Service | Port | Description |
|---------|------|-------------|
| SMTP | 1025 | Réception des emails |
| UI | 8025 | Interface web de visualisation |

## Configuration

Dans `docker-compose.yml` :

```yaml
mailhog:
  image: mailhog/mailhog:latest
  container_name: mailhog
  ports:
    - "1025:1025"
    - "8025:8025"
```

Le backend central est configuré avec les variables d'environnement :

```
MAILHOG_HOST=mailhog
MAILHOG_PORT=1025
```

## Endpoints de test

| Méthode | URL | Description |
|---------|-----|-------------|
| GET | `/api/central/email/test-alert` | Envoyer un email de test |
| GET | `/api/central/email/send-temperature-alert` | Simuler une alerte température |
| GET | `/api/central/email/send-humidity-alert` | Simuler une alerte humidité |

## Test rapide

### 1. Vérifier que MailHog est en cours d'exécution

```bash
docker ps | grep mailhog
```

### 2. Envoyer un email test

```bash
curl http://localhost:3002/api/central/email/test-alert
```

### 3. Vérifier dans l'interface MailHog

Ouvrir http://localhost:8025

L'email de test doit apparaître dans la boîte de réception.

### 4. Simuler une alerte température

```bash
curl http://localhost:3002/api/central/email/send-temperature-alert
```

### 5. Simuler une alerte humidité

```bash
curl http://localhost:3002/api/central/email/send-humidity-alert
```

## Alertes automatiques

Les emails d'alerte sont envoyés automatiquement dans les cas suivants :

| Type d'alerte | Destinataire | Objet |
|--------------|-------------|-------|
| Température | `pays@futurekawa.com` | 🔴 ALERTE Température |
| Humidité | `pays@futurekawa.com` | 🔵 ALERTE Humidité |
| Lot périmé | `pays@futurekawa.com` | ⚠️ ALERTE Lot Périmé |

Les destinataires sont formatés automatiquement selon le pays (ex: `colombia@futurekawa.com`).

## Utilisation dans l'application

- **Backend central** (NestJS) : EmailService avec Nodemailer
- **Déclenchement** : via les endpoints de test et lors de la création d'alertes
- **Visualisation** : interface web MailHog sur le port 8025

## Limites

- MailHog est un outil de **test uniquement** : il ne transmet pas les emails
- En production, remplacer par un service SMTP réel (SendGrid, Mailgun, SMTP relay)
- Les destinataires sont mockés (`pays@futurekawa.com`)
- L'envoi automatique lors de la création d'alerte est partiellement implémenté (le déclenchement principal se fait via les endpoints de test)

## Évolution possible

- Intégration Nodemailer dans les backends pays pour envoi direct depuis la création d'alerte
- Configuration des destinataires via l'interface frontend
- Templates HTML professionnels pour les emails
- File d'attente des emails avec reprise automatique