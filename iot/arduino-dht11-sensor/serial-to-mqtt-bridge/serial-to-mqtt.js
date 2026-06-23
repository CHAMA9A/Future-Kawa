/**
 * FutureKawa — Serial-to-MQTT Bridge
 *
 * Cette passerelle lit les données de température et d'humidité
 * envoyées par l'Arduino UNO via le port série USB, puis les publie
 * vers Mosquitto MQTT au format JSON attendu par les backends pays.
 *
 * Architecture :
 *   Arduino UNO + DHT11 → USB Serial → Node.js bridge → Mosquitto MQTT
 *   → backend pays → PostgreSQL → backend central → frontend
 *
 * Format attendu depuis l'Arduino (Serial Monitor à 9600 bauds) :
 *   Humidity: 42.00%  Temperature: 27.50°C
 *
 * Payload JSON publié vers MQTT :
 *   {"warehouseName":"Warehouse Colombia 1","temperature":27.5,"humidity":42}
 *
 * Utilisation :
 *   1. Copier .env.example en .env et ajuster les paramètres
 *   2. npm install
 *   3. npm start
 */

const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const mqtt = require('mqtt');
require('dotenv').config();

// ─── Configuration ────────────────────────────────────────────────────────

const SERIAL_PORT = process.env.SERIAL_PORT || 'COM4';
const SERIAL_BAUD_RATE = parseInt(process.env.SERIAL_BAUD_RATE, 10) || 9600;
const MQTT_URL = process.env.MQTT_URL || 'mqtt://localhost:1885';
const MQTT_TOPIC = process.env.MQTT_TOPIC || 'futurekawa/colombia/warehouse-1/measurements';
const WAREHOUSE_NAME = process.env.WAREHOUSE_NAME || 'Warehouse Colombia 1';

// ─── Regex pour parser les lignes Arduino ────────────────────────────────

const ARDUINO_LINE_REGEX = /Humidity:\s*([\d.]+)%\s*Temperature:\s*([\d.]+)/;

// ─── Connexion MQTT ──────────────────────────────────────────────────────

const mqttClient = mqtt.connect(MQTT_URL);

mqttClient.on('connect', () => {
  console.log(`MQTT connected to ${MQTT_URL}`);
});

mqttClient.on('error', (err) => {
  console.error(`MQTT error: ${err.message}`);
});

// ─── Connexion série ─────────────────────────────────────────────────────

let serialPort;
let parser;

async function connectSerial() {
  try {
    serialPort = new SerialPort({
      path: SERIAL_PORT,
      baudRate: SERIAL_BAUD_RATE,
    });

    parser = serialPort.pipe(new ReadlineParser({ delimiter: '\r\n' }));

    serialPort.on('open', () => {
      console.log(`Serial connected on ${SERIAL_PORT} at ${SERIAL_BAUD_RATE} baud`);
    });

    serialPort.on('error', (err) => {
      console.error(`Serial error: ${err.message}`);
    });

    parser.on('data', (line) => {
      console.log(`Arduino line: ${line}`);

      const match = line.match(ARDUINO_LINE_REGEX);
      if (match) {
        const humidity = parseFloat(match[1]);
        const temperature = parseFloat(match[2]);

        const payload = JSON.stringify({
          warehouseName: WAREHOUSE_NAME,
          temperature,
          humidity,
        });

        mqttClient.publish(MQTT_TOPIC, payload);
        console.log(`Published to ${MQTT_TOPIC}: ${payload}`);
      }
    });
  } catch (err) {
    console.error(`Failed to connect to serial port ${SERIAL_PORT}: ${err.message}`);
    console.error('Vérifiez que :');
    console.error('  1. L\'Arduino est branché en USB');
    console.error('  2. Le port COM est correct (vérifier dans Arduino IDE)');
    console.error('  3. Le Serial Monitor Arduino est fermé (il bloque le port)');
    process.exit(1);
  }
}

connectSerial();

// ─── Gestion de l'arrêt ──────────────────────────────────────────────────

process.on('SIGINT', () => {
  console.log('\nShutting down...');
  if (serialPort && serialPort.isOpen) {
    serialPort.close();
  }
  mqttClient.end();
  process.exit(0);
});