# FutureKawa — Schéma de câblage DHT11 + Arduino UNO

## Tableau des connexions

| DHT11 module | Arduino UNO | Rôle         |
| ------------ | ----------- | ------------ |
| +            | 5V          | Alimentation |
| OUT          | D7          | Signal data  |
| -            | GND         | Masse        |

## Schéma visuel

```
┌─────────────────────┐
│     Arduino UNO     │
│                     │
│  5V  ───────────────┼─── DHT11 +
│  D7  ───────────────┼─── DHT11 OUT
│  GND ───────────────┼─── DHT11 -
│                     │
└─────────────────────┘
```

## Notes

- Le module utilisé est un **DHT11 3 broches** (+, OUT, -).
  Avec un DHT11 4 broches, le câblage peut varier et une résistance
  pull-up (10 kΩ) entre la broche data et l'alimentation peut être
  nécessaire.
- La broche D7 correspond à la pin digitale 7 sur l'Arduino UNO.
- Le capteur peut être alimenté en 5V (Arduino) ou 3.3V selon le module.
  Les modules 3 broches fonctionnent généralement en 5V.
- Éviter les câbles longs (plus de 50 cm) entre le capteur et l'Arduino
  pour réduire les interférences.