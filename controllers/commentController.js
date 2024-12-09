const CommentModel = require("../models/comment");
const PostModel = require("../models/post");

// Affiche tous les commentaires
module.exports.getComment = async (req, res) => {
  try {
    const comments = await CommentModel.find();
    res.status(200).json({ comments });
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la récupération des commentaires", err });
  }
};

// Affiche un seul commentaire
module.exports.getOne = async (req, res) => {
  try {
    const comment = await CommentModel.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: "Commentaire non trouvé" });
    res.status(200).json({ comment });
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la récupération du commentaire", err });
  }
};

// Crée un commentaire pour un post
module.exports.postComment = async (req, res) => {
  if (!req.body.description) return res.status(400).json({ message: "Merci d'ajouter une description" });

  try {
    const newComment = await CommentModel.create({ ...req.body, author: req.auth.userId, post: req.params.id });
    const updatedPost = await PostModel.findByIdAndUpdate(req.params.id, { $push: { comments: newComment._id } }, { new: true });
    if (!updatedPost) return res.status(404).json({ message: "Post non trouvé" });
    res.status(201).json(newComment);
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la création du commentaire", err });
  }
};

// Met à jour un commentaire
module.exports.updateComment = async (req, res) => {
  try {
    const comment = await CommentModel.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: "Commentaire non trouvé" });
    if (comment.author.toString() !== req.auth.userId) return res.status(403).json({ message: "Non autorisé" });
    const updatedComment = await CommentModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedComment);
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la mise à jour", err });
  }
};

// Supprime un commentaire
module.exports.deleteComment = async (req, res) => {
  try {
    const comment = await CommentModel.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: "Commentaire non trouvé" });
    if (comment.author.toString() !== req.auth.userId && req.auth.role !== "admin") return res.status(403).json({ message: "Non autorisé" });
    await CommentModel.findByIdAndDelete(req.params.id);
    await PostModel.findByIdAndUpdate(comment.post, { $pull: { comments: req.params.id } }, { new: true });
    res.status(200).json({ message: "Commentaire supprimé" });
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la suppression", err });
  }
};
