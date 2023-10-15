/*
const WebSocket = require('ws');

const socket = new WebSocket('ws://localhost:3000/websocket'); // Remplacez l'URL par celle de votre serveur WebSocket.

socket.on('open', () => {
  console.log('Connexion WebSocket établie.');

  // Vous pouvez envoyer des messages ici si nécessaire.
  socket.send('Hello, serveur WebSocket!');
});

socket.on('message', (data) => {
    const message = data.toString('utf8'); // Décodez le message en utilisant l'encodage UTF-8.
  
    console.log('Message reçu :', message);
  
    // Traitez le message ici comme un objet JavaScript.
    try {
      const messageObj = JSON.parse(message);
      console.log('Message décodé :', messageObj);
  
      // Maintenant, vous pouvez accéder aux propriétés de l'objet messageObj.
    } catch (error) {
      console.error('Erreur lors de la lecture du message JSON :', error);
    }
  });
  

socket.on('close', () => {
  console.log('Connexion WebSocket fermée.');
});

socket.on('error', (error) => {
  console.error('Erreur WebSocket :', error);
});
*/
/*
ws.on('message', (data) => {
  // Réception d'un message du serveur
  console.log('Message reçu :', data);
});*/


const WebSocket = require('ws');

const client = new WebSocket('ws://localhost:3000/websocket'); // Remplacez l'URL par l'URL de votre serveur WebSocket

client.on('open', () => {
  console.log('Connexion WebSocket établie.');
});

client.on('message', (message) => {
  console.log('Message reçu du serveur:', message);
});

client.on('close', () => {
  console.log('Connexion WebSocket fermée.');
});
