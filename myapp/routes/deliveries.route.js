const express = require('express');
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
