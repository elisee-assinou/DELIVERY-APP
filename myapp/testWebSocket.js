const WebSocket = require('ws');

const client = new WebSocket('ws://localhost:3000/websocket'); // Remplacez l'URL par l'URL de votre serveur WebSocket

client.on('open', () => {
  console.log('Connexion WebSocket établie');

  // Exemple d'événement 'location_changed'
  const locationEvent = {
    event: 'location_changed',
    delivery_id: '6526fb2befcf3327252ec274',
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
