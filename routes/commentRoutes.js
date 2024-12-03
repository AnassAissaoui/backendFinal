// Importation de Express pour gérer les routes HTTP
const express = require("express");

// Importation du middleware d'authentification pour protéger les routes
const auth = require("../middleware/authMiddleware");

// Création du routeur pour gérer les routes de commentaires
const router = express.Router();

// Importation du contrôleur des commentaires, qui contient la logique pour chaque action
const commentControllers = require("../controllers/commentController");

// Route GET pour récupérer tous les commentaires : nécessite une authentification
router.get("/", auth, commentControllers.getComment);

// Route GET pour récupérer un commentaire spécifique par son ID : nécessite une authentification
router.get("/:id", auth, commentControllers.getOne);

// Route POST pour créer un commentaire sur un post (avec l'ID du post dans l'URL) : nécessite une authentification
router.post("/:id", auth, commentControllers.postComment);

// Route PUT pour mettre à jour un commentaire spécifique par son ID : nécessite une authentification
router.put("/:id", auth, commentControllers.updateComment);

// Route DELETE pour supprimer un commentaire spécifique par son ID : nécessite une authentification
router.delete("/:id", auth, commentControllers.deleteComment);

// Exportation du routeur pour l'utiliser dans d'autres fichiers
module.exports = router;
