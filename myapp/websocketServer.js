const WebSocket = require('ws');
const mongoose = require('mongoose');
const Delivery = require('./models/delivery');

function setupWebSocket(server) {
  const wss = new WebSocket.Server({ noServer: true });

  wss.on('connection', (ws) => {
    console.log('Nouvelle connexion WebSocket établie');

    ws.on('message', async (message) => {
      try {
        const data = JSON.parse(message);

        if (data.event === 'location_changed') {
          if (data.delivery_id && data.location) {
            // Mise à jour de la localisation dans la base de données
            const delivery = await Delivery.findById(data.delivery_id);
            
            if (delivery) {
              delivery.location = data.location;
              await delivery.save();

              // Envoi d'une confirmation au client
              const locationConfirmation = {
                event: 'location_updated',
                delivery_id: data.delivery_id,
                location: data.location,
              };
              ws.send(JSON.stringify(locationConfirmation));
            } else {
              throw new Error('Livraison introuvable');
            }
          } else {
            throw new Error('Paramètres manquants pour la mise à jour de la localisation');
          }
        } else if (data.event === 'status_changed') {
          if (data.delivery_id && data.status) {
            // Mise à jour du statut de la livraison
            const delivery = await Delivery.findById(data.delivery_id);

            if (delivery) {
              delivery.status = data.status;
              await delivery.save();

              // Envoi d'une confirmation au client
              const statusConfirmation = {
                event: 'status_updated',
                delivery_id: data.delivery_id,
                status: data.status,
              };
              ws.send(JSON.stringify(statusConfirmation));
            } else {
              throw new Error('Livraison introuvable');
            }
          } else {
            throw new Error('Paramètres manquants pour la mise à jour du statut');
          }
        } else if (data.event === 'delivery_updated') {
          if (data.delivery_id) {
            // Envoi d'une confirmation au client
            const deliveryConfirmation = {
              event: 'delivery_updated',
              delivery_id: data.delivery_id,
            };
            ws.send(JSON.stringify(deliveryConfirmation));
          } else {
            throw new Error('Paramètres manquants pour la mise à jour de la livraison');
          }
        } else {
          throw new Error('Événement non géré');
        }
      } catch (error) {
        // Envoi d'un message d'erreur au client en cas de problème
        const errorMessage = {
          event: 'error',
          message: error.message,
        };
        ws.send(JSON.stringify(errorMessage));
      }
    });

    ws.on('close', () => {
      console.log('Connexion WebSocket fermée');
    });
  });

  return wss;
}

module.exports = setupWebSocket;
