const express = require('express');
const router = express.Router();
const auth = require("../middleware/auth.middleware"); // Middleware d'authentification
const adminAuth = require("../middleware/admin.middleware"); // Middleware d'autorisation pour les administrateurs

const PackageControllerV = require('../controllers/package.controller');
const packageController = new PackageControllerV();

router.post('/packages',auth, packageController.createPackage);

// Mettre à jour un package par ID
router.put('/packages/:package_id',auth,adminAuth, packageController.updatePackage);

// Supprimer un package par ID
router.delete('/packages/:package_id',auth,adminAuth, packageController.deletePackage);

// Récupérer tous les packages
router.get('/packages',auth,adminAuth, packageController.getAllPackages);

// Récupérer un package par ID
router.get('/packages/:package_id', packageController.getPackageById);

module.exports = router;
