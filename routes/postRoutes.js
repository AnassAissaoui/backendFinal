// Importation de Express pour créer des routes HTTP
const express = require("express");

// Importation du middleware d'authentification pour vérifier les utilisateurs
const auth = require("../config/authConfig");

// Importation du middleware Multer pour gérer le téléchargement des fichiers (images, etc.)
const multer = require("../config/multerConfig");

// Création du routeur qui va gérer les routes pour les posts
const router = express.Router();

// Importation du contrôleur des posts, où se trouve la logique des différentes actions
const postController = require("../controllers/postController");

// Route GET pour récupérer tous les posts : uniquement accessible si l'utilisateur est authentifié
router.get("/", auth, postController.getPost);

// Route GET pour récupérer un post spécifique par son ID : nécessite une authentification
router.get("/:id", auth, postController.getOne);

// Route POST pour envoyer un nouveau post : nécessite une authentification et un fichier (via Multer)
router.post("/", auth, multer, postController.sendPost);

// Route PUT pour mettre à jour un post existant : nécessite une authentification, un fichier (via Multer), et l'ID du post à modifier
router.put("/:id", auth, multer, postController.updatePost);

// Route DELETE pour supprimer un post par son ID : nécessite une authentification
router.delete("/:id", auth, postController.deletePost);

// Exportation du routeur pour qu'il puisse être utilisé dans d'autres fichiers
module.exports = router;
