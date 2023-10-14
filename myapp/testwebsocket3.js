const WebSocket = require('ws');

const client = new WebSocket('ws://localhost:3000/websocket');

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


location_changed (type:incoming, payload:{event, delivery_id, location}, description:Update the location of a delivery)

status_changed (type:incoming, payload:{event, delivery_id, status}, description:Update the status of a delivery
  When the status changes from open to picked-up, set
  the pickup_time to current time
  When the status changes from picked-up to in-transit,
  set the start_time to current time
  When the status changes from in-transit to delivered
  or failed, set the end_time to current time)


broadcast (type:delivery_updated, payload:{event, delivery_object}, description:Broadcast when a delivery is updated)
