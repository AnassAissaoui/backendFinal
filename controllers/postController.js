const PostModel = require("../models/post");
const auth = require("../middleware/authMiddleware");

// Récupère tous les posts de la base de données
module.exports.getPost = (req, res) => {
  PostModel.find()
    .then(posts => res.status(200).json({ posts }))
    .catch(err => {
      res.status(500).json({ message: "Une erreur s'est produite lors de la récupération des posts", err });
    });
};

// Récupère un seul post par ID
module.exports.getOne = (req, res) => {
  PostModel.findById(req.params.id)
    .then(post => {
      if (!post) {
        return res.status(404).json({ message: "Le post n'existe pas" });
      }
      res.status(200).json({ post });
    })
    .catch(err => res.status(500).json({ message: "Une erreur s'est produite lors de la récupération du post", err }));
};

// Crée un nouveau post
module.exports.sendPost = (req, res) => {
  const userId = req.auth.userId;

  // Vérifie si un message est fourni
  if (!req.body.message) {
    return res.status(400).json({ message: "Merci d'ajouter un message" });
  }

  const createPost = {
    ...req.body,
    author: userId
  };

  // Si un fichier est téléchargé, ajoute l'URL de l'image
  if (req.file) {
    createPost.imageUrl = `${req.protocol}://${req.get("host")}/images/${req.file.filename}`;
  }

  PostModel.create(createPost)
    .then(post => res.status(201).json({ post }))
    .catch(err => res.status(400).json({ message: "Erreur lors de la création du post", err }));
};

// Met à jour un post existant
module.exports.updatePost = (req, res) => {
  const userId = req.auth.userId;

  PostModel.findById(req.params.id)
    .then(post => {
      if (!post) {
        return res.status(404).json({ message: "Ce post n'existe pas" });
      } else if (post.author.toString() !== userId) {
        return res.status(403).json({ message: "Vous n'êtes pas autorisé à modifier ce post" });
      } else {
        // Crée un objet de mise à jour
        const updatePost = { ...req.body };

        // Si une nouvelle image est téléchargée, ajoute l'URL de l'image
        if (req.file) {
          updatePost.imageUrl = `${req.protocol}://${req.get("host")}/images/${req.file.filename}`;
        }

        // Met à jour le post
        PostModel.findByIdAndUpdate(post._id, updatePost, { new: true })
          .then(updatedPost => res.status(200).json(updatedPost))
          .catch(err => res.status(400).json({ message: "La modification du post a échoué", err }));
      }
    })
    .catch(err => res.status(500).json({ message: "Erreur lors de la tentative de modification du post", err }));
};

// Supprime un post
module.exports.deletePost = (req, res) => {
  const userId = req.auth.userId;
  const role = req.auth.role;

  PostModel.findById(req.params.id)
    .then(post => {
      if (!post) {
        return res.status(404).json({ message: "Post non trouvé" });
      } else if (post.author.toString() !== userId && role !== "admin") {
        return res.status(403).json({ message: "Vous n'êtes pas autorisé à supprimer ce post" });
      } else {
        PostModel.findByIdAndDelete(req.params.id)
          .then(deletedPost => res.status(200).json({ message: "Post supprimé", deletedPost }))
          .catch(err => res.status(500).json({ message: "Une erreur s'est produite lors de la suppression du post", err }));
      }
    })
    .catch(err => res.status(500).json({ message: "Une erreur s'est produite lors de la recherche du post", err }));
};
