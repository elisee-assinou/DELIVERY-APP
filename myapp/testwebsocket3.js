const WebSocket = require('ws');

const client = new WebSocket('ws://localhost:3000/websocket'); // Remplacez l'URL par l'URL de votre serveur WebSocket

client.on('open', () => {
  console.log('Connexion WebSocket établie');

  // Exemple d'événement 'delivery_updated'
  const deliveryEvent = {
    event: 'delivery_updated',
    delivery_id: '6526fb2befcf3327252ec274',
  };

  // Envoyer l'événement au serveur
  client.send(JSON.stringify(deliveryEvent));
});

client.on('message', (message) => {
  const messageData = JSON.parse(message);
  console.log('Message reçu du serveur:', messageData);
  // Vous devriez recevoir des confirmations du serveur pour les différents événements ici.
});

client.on('close', () => {
  console.log('Connexion WebSocket fermée');
});
