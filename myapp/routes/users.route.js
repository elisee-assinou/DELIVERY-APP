const express = require("express");
const router = express.Router();
const UserCtrl = require("../controllers/user.controller");
const auth = require("../middleware/auth.middleware"); // Middleware d'authentification
const adminAuth = require("../middleware/admin.middleware"); // Middleware d'autorisation pour les administrateurs

router.post("/signup", UserCtrl.signup);
router.post("/login", UserCtrl.login);

router.get("/:id", auth, UserCtrl.getById); 

router.delete("/delete/:id", auth, UserCtrl.deleteUser); 

router.put("/update/:id", auth, UserCtrl.updateUser); 

router.get("/", auth, adminAuth, UserCtrl.getAllUsers); 

router.post("/change-password", auth, UserCtrl.changePassword);

module.exports = router;
