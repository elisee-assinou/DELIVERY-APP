/*const WebSocket = require('ws');

const client = new WebSocket('ws://localhost:3000/websocket'); // Remplacez l'URL par l'URL de votre serveur WebSocket

client.on('open', () => {
  console.log('Connexion WebSocket établie');

  // Exemple d'événement 'location_changed'
  const locationEvent = {
    event: 'location_changed',
    delivery_id: '652a7152ba10469b80186b55',
    location: {
      lat: 12.80,
      lng: 12.80,
    },
  };
  
  // Envoyer l'événement au serveur
  client.send(JSON.stringify(locationEvent));
});

client.on('message', (message) => {
  const messageData = JSON.parse(message);
  console.log('Message reçu du serveur:', messageData);
  // Vous devriez recevoir des confirmations du serveur pour les différents événements ici.
});

client.on('close', () => {
  console.log('Connexion WebSocket fermée');
});

*/
/*
const WebSocket = require('ws');

const client = new WebSocket('ws://localhost:3000/websocket'); // Remplacez l'URL par l'URL de votre serveur WebSocket

client.on('open', () => {
  console.log('Connexion WebSocket établie');
});

client.on('message', (message) => {
  const messageData = JSON.parse(message);
  console.log('Message reçu du serveur:', messageData);

  if (messageData.event === 'location_changed') {
    console.log("ok");
  }
});

client.on('close', () => {
  console.log('Connexion WebSocket fermée');
});
*/

/*

const WebSocket = require('ws')
// Create WebSocket connection.
const socket = new WebSocket("ws://localhost:3000/websocket");

// Listen for messages
socket.addEventListener("message", (event) => {
  console.log("Message from server ", event.data);
});
*/
const WebSocket = require('ws');

const client2 = new WebSocket('ws://localhost:3000/websocket'); // Remplacez l'URL par l'URL de votre serveur WebSocket

client2.on('open', () => {
  console.log('Connexion WebSocket établie.');

  // Envoie d'un message au serveur
  const message = {
    event: 'location_changed',
    delivery_id: '652a7152ba10469b80186b55', // Remplacez par l'ID de la livraison
    location: {
      lat: 123.456,
      lng: 789.012
    }
  };

  if (message) {
    client2.send(JSON.stringify(message));
    console.log("message envoye");
  }
  
});
