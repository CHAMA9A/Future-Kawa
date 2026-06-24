# FutureKawa — Guide d'installation du prototype IoT

## Prérequis

- Arduino IDE installé (téléchargement : https://www.arduino.cc/en/software)
- Carte Arduino UNO
- Capteur DHT11 (module 3 broches)
- Câble USB A → USB B

## Étapes

### 1. Installer Arduino IDE

Télécharger et installer Arduino IDE depuis le site officiel.
Arduino IDE n'est pas nécessaire pour comprendre ou documenter le prototype,
mais il est nécessaire pour compiler et téléverser le code dans la carte
Arduino.

### 2. Brancher l'Arduino UNO

Connecter l'Arduino UNO au PC via le câble USB.

### 3. Sélectionner la carte

Dans Arduino IDE :
- Menu **Outils → Type de carte → Arduino Uno**

### 4. Sélectionner le port série

- Menu **Outils → Port** : choisir le port où l'Arduino est connecté
  (ex. `COM3` sous Windows, `/dev/ttyACM0` sous Linux)

### 5. Installer les librairies

Voir `libraries.md` pour la liste des librairies nécessaires.

Dans Arduino IDE :
- Menu **Outils → Gérer les bibliothèques**
- Rechercher et installer chaque librairie

### 6. Ouvrir le code

- Menu **Fichier → Ouvrir**
- Sélectionner `futurekawa_dht11_serial.ino`

### 7. Téléverser le programme

- Cliquer sur le bouton **Téléverser** (flèche droite)
- Attendre la fin de la compilation et du transfert

### 8. Ouvrir le Serial Monitor

- Menu **Outils → Moniteur série**
- Régler le débit à **9600 bauds** (coin inférieur droit)

### 9. Vérifier l'affichage

Les données doivent s'afficher toutes les 500 ms :

```
Humidity: 65.00%  Temperature: 24.00°C
Humidity: 65.00%  Temperature: 24.00°C
```

## Dépannage

| Problème | Solution |
|---|---|
| Rien ne s'affiche dans le Serial Monitor | Vérifier le débit (9600 bauds) et le bon port série |
| `Humidity: nan%` | Vérifier le câblage du DHT11 (broche OUT sur D7) |
| Erreur de compilation | Vérifier que les librairies sont installées |
| Le programme ne se téléverse pas | Vérifier que la bonne carte et le bon port sont sélectionnés |