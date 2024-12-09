const PostModel = require("../models/post");

// Récupère tous les posts de la base de données
module.exports.getPost = async (req, res) => {
  try {
    const posts = await PostModel.find();
    res.status(200).json({ posts });
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la récupération des posts", err });
  }
};

// Récupère un seul post par ID
module.exports.getOne = async (req, res) => {
  try {
    const post = await PostModel.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post non trouvé" });
    res.status(200).json({ post });
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la récupération du post", err });
  }
};

// Crée un nouveau post
module.exports.sendPost = async (req, res) => {
  if (!req.body.message) return res.status(400).json({ message: "Merci d'ajouter un message" });

  const createPost = { ...req.body, author: req.auth.userId };

  if (req.file) createPost.imageUrl = `${req.protocol}://${req.get("host")}/images/${req.file.filename}`;

  try {
    const post = await PostModel.create(createPost);
    res.status(201).json({ post });
  } catch (err) {
    res.status(400).json({ message: "Erreur lors de la création du post", err });
  }
};

// Met à jour un post existant
module.exports.updatePost = async (req, res) => {
  try {
    const post = await PostModel.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post non trouvé" });
    if (post.author.toString() !== req.auth.userId) return res.status(403).json({ message: "Non autorisé" });

    const updatePost = { ...req.body };
    if (req.file) updatePost.imageUrl = `${req.protocol}://${req.get("host")}/images/${req.file.filename}`;

    const updatedPost = await PostModel.findByIdAndUpdate(post._id, updatePost, { new: true });
    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la modification du post", err });
  }
};

// Supprime un post
module.exports.deletePost = async (req, res) => {
  try {
    const post = await PostModel.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post non trouvé" });
    if (post.author.toString() !== req.auth.userId && req.auth.role !== "admin") return res.status(403).json({ message: "Non autorisé" });

    await PostModel.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Post supprimé" });
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la suppression du post", err });
  }
};
