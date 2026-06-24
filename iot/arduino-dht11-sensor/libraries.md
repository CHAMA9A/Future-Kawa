# FutureKawa — Librairies Arduino requises

## Librairies principales

Pour compiler et téléverser le code `futurekawa_dht11_serial.ino`,
les librairies suivantes sont nécessaires :

| Librairie | Auteur | Utilité |
|---|---|---|
| **DHT sensor library** | Adafruit | Lecture du capteur DHT11 |
| **Adafruit Unified Sensor** | Adafruit | Dépendance de DHT sensor library |

### Installation

Dans Arduino IDE :
1. Menu **Outils → Gérer les bibliothèques**
2. Rechercher "DHT sensor library"
3. Installer la version d'Adafruit
4. Rechercher "Adafruit Unified Sensor"
5. Installer

### Code

Le programme utilise l'inclusion standard :

```cpp
#include <DHT.h>
```

La directive `#include <DHT.h>` est fournie par la librairie
**DHT sensor library by Adafruit**.

## Alternatives possibles

| Librairie | Note |
|---|---|
| DFRobot_DHT11 | Alternative compatible, interface différente |
| DHT kxn by Adafruit | Ancienne version de la librairie DHT |

Le code fourni utilise l'API de la librairie Adafruit DHT sensor library,
qui est la plus maintenue et documentée.