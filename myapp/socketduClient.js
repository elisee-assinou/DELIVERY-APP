const WebSocket = require("ws");

// Créez un serveur WebSocket sur un certain port (par exemple, 8080)
const wss = new WebSocket.Server({ port: 8080 });

// Une carte pour associer les connexions WebSocket aux colis
const packageWebSockets = new Map();

wss.on("connection", (ws) => {
  // Lorsqu'une connexion WebSocket est établie

  ws.on("message", (message) => {
    // Lorsqu'un message est reçu (par exemple, l'ID du colis)

    const packageId = message; // Supposons que le client envoie l'ID du colis

    if (!packageWebSockets.has(packageId)) {
      packageWebSockets.set(packageId, []);
    }

    packageWebSockets.get(packageId).push(ws);
  });
});

// Fonction pour envoyer des mises à jour de livraison
function sendDeliveryUpdate(packageId, updateData) {
  if (packageWebSockets.has(packageId)) {
    packageWebSockets.get(packageId).forEach((ws) => {
      ws.send(JSON.stringify(updateData));
    });
  }
}

module.exports = sendDeliveryUpdate;
