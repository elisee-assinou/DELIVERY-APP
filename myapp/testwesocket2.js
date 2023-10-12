const WebSocket = require('ws');

const client = new WebSocket('ws://localhost:3000/websocket');

client.on('open', () => {
  console.log('Connexion WebSocket établie');


  const statusEvent = {
    event: 'status_changed',
    delivery_id: '6526fb2befcf3327252ec274',
    status: 'picked-up',
  };

  client.send(JSON.stringify(statusEvent));
});

client.on('message', (message) => {
  const messageData = JSON.parse(message);
  console.log('Message reçu du serveur:', messageData);

});

client.on('close', () => {
  console.log('Connexion WebSocket fermée');
});
