const express = require('express');
const router = express.Router();
const auth = require("../middleware/auth.middleware"); // Middleware d'authentification
const adminAuth = require("../middleware/admin.middleware"); // Middleware d'autorisation pour les administrateurs
const DeliveryControllerV2 = require('../controllers/delivery.controller');
const deliveryController = new DeliveryControllerV2();

// Créer une livraison
router.post('/deliveries',  deliveryController.createDelivery);

router.put('/deliveries/:delivery_id', deliveryController.updateDelivery);

router.delete('/deliveries/:delivery_id', deliveryController.deleteDelivery);

router.get('/deliveries', deliveryController.getAllDeliveries);

router.get('/deliveries/:delivery_id', deliveryController.getDeliveryById);
router.put("/deliveries/assign/:delivery_id", deliveryController.assignDeliveryToDriver)

module.exports = router;
