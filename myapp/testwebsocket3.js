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
const mongoose = require("mongoose");

const DeliverySchema = new mongoose.Schema({
  package_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Package",
    required: true,
  },
  driver_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", 
  },
  pickup_time: {
    type: Date,
    required: true,
  },
  start_time: {
    type: Date,
  },
  end_time: {
    type: Date,
  },
  location: {
    type: {
      lat: Number,
      lng: Number,
    },
    required: true,
  },
  status: {
    type: String,
    enum: ["open", "picked-up", "in-transit", "delivered", "failed"],
    default: "open",
  },

}, {
  timestamps: true,
});

const Delivery = mongoose.model("Delivery", DeliverySchema);

module.exports = Delivery;
const mongoose = require("mongoose");

const PackageSchema = new mongoose.Schema({
  active_delivery_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Delivery",
    default: null,
  },
  description: {
    type: String,
  },
  weight: {
    type: Number,
    required: true,
  },
  width: {
    type: Number,
    required: true,
  },
  height: {
    type: Number,
    required: true,
  },
  depth: {
    type: Number,
    required: true,
  },
  from_name: {
    type: String,
  },
  from_address: {
    type: String,
  },
  from_location: {
    type: {
      lat: { type: Number },
      lng: { type: Number },
    },
  },
  to_name: {
    type: String,
  },
  to_address: {
    type: String,
  },
  to_location: {
    type: {
      lat: { type: Number },
      lng: { type: Number },
    },
  },
}, {
  timestamps: true,
});

const Package = mongoose.model("Package", PackageSchema);

module.exports = Package;
 voici mes nodeles. je veux creer une page admin en angular qui puisse permettre a l'admin de creer un package, et une livraison au niveau de la livraison, nous devons avoir un  bouton qui permet de selectionner directement l'id du package pour lequel on veut creer la livraison.const express = require('express');
const router = express.Router();
const auth = require("../middleware/auth.middleware"); // Middleware d'authentification
const adminAuth = require("../middleware/admin.middleware"); // Middleware d'autorisation pour les administrateurs
const DeliveryControllerV2 = require('../controllers/delivery.controller');
const deliveryController = new DeliveryControllerV2();

// Créer une livraison
router.post('/deliveries', auth,adminAuth, deliveryController.createDelivery);

// Mettre à jour une livraison par ID
router.put('/deliveries/:delivery_id',auth,adminAuth, deliveryController.updateDelivery);

// Supprimer une livraison par ID
router.delete('/deliveries/:delivery_id',auth,adminAuth, deliveryController.deleteDelivery);

// Récupérer toutes les livraisons
router.get('/deliveries',auth,adminAuth, deliveryController.getAllDeliveries);

// Récupérer une livraison par ID
router.get('/deliveries/:delivery_id', deliveryController.getDeliveryById);
router.put("/deliveries/assign/:delivery_id", deliveryController.assignDeliveryToDriver)

module.exports = router;
const express = require('express');
const router = express.Router();
const auth = require("../middleware/auth.middleware"); // Middleware d'authentification
const adminAuth = require("../middleware/admin.middleware"); // Middleware d'autorisation pour les administrateurs

const PackageControllerV = require('../controllers/package.controller');
const packageController = new PackageControllerV();

router.post('/packages',auth, packageController.createPackage);

router.put('/packages/:package_id',auth,adminAuth, packageController.updatePackage);

router.delete('/packages/:package_id',auth,adminAuth, packageController.deletePackage);

router.get('/packages',auth,adminAuth, packageController.getAllPackages);


router.get('/packages/:package_id', packageController.getPackageById);

module.exports = router;
 voici les routes disponibles