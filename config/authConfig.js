// Importation de la bibliothèque 'jsonwebtoken' pour gérer les tokens JWT
const jwt = require('jsonwebtoken');

// Middleware pour vérifier l'authentification des utilisateurs
module.exports = (req, res, next) => {
   try {
       // Extraction du token JWT depuis l'en-tête Authorization de la requête HTTP
       const token = req.headers.authorization.split(' ')[1];
       
       // Vérification du token avec la clé secrète 'RANDOM_TOKEN_SECRET'
       const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
       
       // Récupération de l'userId et du userRole du token décodé
       const userId = decodedToken.userId;
       const userRole = decodedToken.userRole;

       // Ajout des informations d'authentification à l'objet `req` pour utilisation ultérieure dans les contrôleurs
       req.auth = {
         userId: userId,    // ID de l'utilisateur extrait du token
         role: userRole     // Rôle de l'utilisateur extrait du token
       };

       // Appel du prochain middleware ou du contrôleur
       next();
   } catch (error) {
       // En cas d'erreur (token invalide, expiré ou manquant), envoi d'une réponse d'erreur avec le code HTTP 401 (non autorisé)
       res.status(401).json({ error: 'Unauthorized request!' });
   }
};
