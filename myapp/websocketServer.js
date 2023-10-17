const WebSocket = require('ws');
const mongoose = require('mongoose');
const Delivery = require('./models/delivery');

function setupWebSocket(server) {
  const wss = new WebSocket.Server({ server });
  const clients=new Set();

  wss.on('connection', (ws) => {
    console.log('Nouvelle connexion WebSocket établie');
    clients.add(ws);
    console.log(clients.size);

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

              //confirmation au client
              const locationConfirmation = {
                event: 'location_changed',
                delivery_id: data.delivery_id,
                location: data.location,
              };

              if (wss && wss.clients) {
                console.log(wss.clients.values());
                // Vous pouvez accéder à wss.clients ici en toute sécurité.
                wss.clients.forEach((client) => {
                  if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(locationUpdadte));
                  }
                });
              } else {
                console.error("La propriété 'wss' ou 'wss.clients' est indéfinie ou non valide.");
              }
              console.log("un evenement de type location_changed est venue");
              
              console.log(JSON.stringify(locationConfirmation));
            } else {
              throw new Error('Livraison introuvable');
            }
          } else {
            throw Error('Paramètres manquants pour la mise à jour de la localisation');
          }
        }
        /*debut de statut_changed*/
        else if (data.event === 'status_changed') {
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
              console.log(data);
              // Envoi d'une confirmation au client
              const statusConfirmation = {
                event: 'status_changed',
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
        }

        /*fin de statut_changed*/
        else {
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
      clients.delete(ws);
    });
  });

  return wss;
}

module.exports = setupWebSocket;
