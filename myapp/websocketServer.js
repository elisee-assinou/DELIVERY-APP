const WebSocket = require('ws');
const mongoose = require('mongoose');
const Delivery = require('./models/delivery');

function setupWebSocket(server) {
  const wss = new WebSocket.Server({ server });

  wss.on('connection', (ws) => {
    console.log('Nouvelle connexion WebSocket établie');

    ws.on('message', async (message) => {
      try {
        const data = JSON.parse(message);

        if (data.type === 'incoming') {
          if (data.event === 'location_changed') {
            if (data.delivery_id && data.location) {
              // Mise à jour de la localisation dans la base de données
              const delivery = await Delivery.findById(data.delivery_id);

              if (delivery) {
                delivery.location = data.location;
                await delivery.save();

                // Confirmation au client
                const locationConfirmation = {
                  type: 'incoming',
                  event: 'location_changed',
                  delivery_id: data.delivery_id,
                  location: data.location,
                };
                ws.send(JSON.stringify(locationConfirmation));

                // Envoi de la mise à jour de localisation à tous les clients WebSocket connectés
                wss.clients.forEach((client) => {
                  if (client !== ws && client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(locationConfirmation));
                  }
                });

                console.log("Un événement de type location_changed est venu sur le serveur");
                console.log(JSON.stringify(locationConfirmation));
              } else {
                throw new Error('Livraison introuvable');
              }
            } else {
              throw new Error('Paramètres manquants pour la mise à jour de la localisation');
            }
          } else if (data.event === 'status_changed') {
            if (data.delivery_id && data.status) {
              const delivery = await Delivery.findById(data.delivery_id);

              if (delivery) {
                // Mise à jour du statut de la livraison
                delivery.status = data.status;

                if (data.status === 'picked-up') {
                  delivery.pickup_time = new Date();
                } else if (data.status === 'in-transit') {
                  delivery.start_time = new Date();
                } else if (data.status === 'delivered' || data.status === 'failed') {
                  delivery.end_time = new Date();
                }

                await delivery.save();

                // Envoi d'une confirmation au client
                const statusConfirmation = {
                  type: 'incoming',
                  event: 'status_changed',
                  delivery_id: data.delivery_id,
                  status: data.status,
                };
                ws.send(JSON.stringify(statusConfirmation));

                // Envoyer la mise à jour du statut à tous les clients WebSocket connectés
                wss.clients.forEach((client) => {
                  if (client !== ws && client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(statusConfirmation));
                  }
                });

                console.log("Un événement de type status_changed est venu sur le serveur");
                console.log(JSON.stringify(statusConfirmation));
              } else {
                throw new Error('Livraison introuvable');
              }
            } else {
              throw new Error('Paramètres manquants pour la mise à jour du statut');
            }
          } else {
            throw new Error('Événement non géré');
          }
        } else if (data.type === 'broadcast' && data.event === 'delivery_updated') {
          if (data.delivery_id && data.updatedData) {
            const delivery = await Delivery.findById(data.delivery_id);

            if (delivery) {
              // Mettre à jour les données de livraison en fonction de data.updatedData

              // Envoi d'une confirmation au client
              const updateConfirmation = {
                type: 'broadcast',
                event: 'delivery_updated',
                delivery_id: data.delivery_id,
                updatedData: data.updatedData,
              };

              wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                  client.send(JSON.stringify(updateConfirmation));
                }
              });

              console.log("Un événement de type delivery_updated (broadcast) est venu sur le serveur");
              console.log(JSON.stringify(updateConfirmation));
            } else {
              throw new Error('Livraison introuvable');
            }
          } else {
            throw new Error('Paramètres manquants pour la mise à jour de la livraison');
          }
        }
      } catch (error) {
        // Envoi d'un message d'erreur au client en cas de problème
        const errorMessage = {
          type: 'error',
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
