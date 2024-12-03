// On charge express pour pouvoir définir les routes
const express = require('express');
// Création du routeur, qui va nous permettre de gérer les routes associées
const router = express.Router();

// On importe le contrôleur utilisateur, qui contient la logique des routes
const userController = require('../controllers/userController');

// Route pour l'inscription de l'utilisateur : quand l'endpoint /signup est appelé en POST, la fonction signup du controller est exécutée
router.post('/signup', userController.signup);

// Route pour la connexion de l'utilisateur : quand l'endpoint /login est appelé en POST, la fonction login du controller est exécutée
router.post('/login', userController.login);

// Route pour la déconnexion de l'utilisateur : quand l'endpoint /logout est appelé en POST, la fonction logout du controller est exécutée
router.post('/logout', userController.logout);

// On exporte le routeur pour qu'il soit utilisé dans le fichier principal (server.js)
module.exports = router;