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
