const CommentModel = require("../models/comment");
const PostModel = require("../models/post");
const auth = require("../middleware/authMiddleware");

// Affiche tous les commentaires
module.exports.getComment = (req, res) => {
  CommentModel.find()
    .then(comments => res.status(200).json({ comments }))
    .catch(err => res.status(500).json({ message: "Une erreur s'est produite lors de la récupération des commentaires", err }));
};

// Affiche un seul commentaire
module.exports.getOne = (req, res) => {
  CommentModel.findById(req.params.id)
    .then(comment => {
      if (!comment) {
        return res.status(404).json({ message: "Ce commentaire n'existe pas" });
      }
      res.status(200).json({ comment });
    })
    .catch(err => res.status(500).json({ message: "Une erreur s'est produite lors de la récupération du commentaire", err }));
};

// Crée un commentaire pour un post
module.exports.postComment = (req, res) => {
  const userId = req.auth.userId;
  const postId = req.params.id;

  if (!req.body.description) {
    return res.status(400).json({ message: "Merci d'ajouter une description pour le commentaire" });
  }

  CommentModel.create({
    ...req.body,
    author: userId,
    post: postId
  })
    .then(newComment => {
      return PostModel.findByIdAndUpdate(
        postId,
        { $push: { comments: newComment._id } },  // Correction: "comments" au lieu de "comment"
        { new: true }
      )
        .then(updatedPost => {
          if (!updatedPost) {
            return res.status(404).json({ message: "Post non trouvé" });
          } else {
            res.status(201).json(newComment);
          }
        })
        .catch(err => res.status(500).json({ message: "Erreur lors de la mise à jour du post", err }));
    })
    .catch(err => res.status(500).json({ message: "Une erreur s'est produite lors de la création du commentaire", err }));
};

// Met à jour un commentaire
module.exports.updateComment = (req, res) => {
  const userId = req.auth.userId;

  CommentModel.findById(req.params.id)
    .then(comment => {
      if (!comment) {
        return res.status(404).json({ message: "Commentaire non trouvé" });
      } else if (comment.author.toString() !== userId) {
        return res.status(403).json({ message: "Vous n'êtes pas autorisé à modifier ce commentaire" });
      } else {
        // Mise à jour du commentaire
        return CommentModel.findByIdAndUpdate(req.params.id, req.body, { new: true })
          .then(updatedComment => res.status(200).json(updatedComment))
          .catch(err => res.status(500).json({ message: "Erreur lors de la mise à jour du commentaire", err }));
      }
    })
    .catch(err => res.status(500).json({ message: "Erreur lors de la recherche du commentaire", err }));
};

// Supprime un commentaire
module.exports.deleteComment = (req, res) => {
  const userId = req.auth.userId;
  const role = req.auth.role;

  CommentModel.findById(req.params.id)
    .then(comment => {
      if (!comment) {
        return res.status(404).json({ message: "Commentaire non trouvé" });
      } else if (comment.author.toString() !== userId && role !== "admin") {
        return res.status(403).json({ message: "Vous n'êtes pas autorisé à supprimer ce commentaire" });
      } else {
        // Suppression du commentaire
        return CommentModel.findByIdAndDelete(req.params.id)
          .then(() => {
            return PostModel.findByIdAndUpdate(comment.post, { $pull: { comments: req.params.id } }, { new: true });
          })
          .then(() => res.status(200).json({ message: "Commentaire supprimé" }))
          .catch(err => res.status(500).json({ message: "Erreur lors de la suppression du commentaire ou de la mise à jour du post", err }));
      }
    })
    .catch(err => res.status(500).json({ message: "Une erreur s'est produite lors de la recherche du commentaire", err }));
};
