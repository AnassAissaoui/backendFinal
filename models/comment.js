// Importation de Mongoose pour interagir avec MongoDB
const mongoose = require("mongoose");

// Définition du schéma pour les commentaires sur les posts
const commentSchema = mongoose.Schema(
  {
    // Description du commentaire, requis
    description: { type: String, required: true },

    // L'auteur du commentaire, référence à un utilisateur dans la base de données
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    // Le post auquel le commentaire est associé, référence à un post dans la base de données
    post: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true }
  },
  {
    // Ajout des timestamps pour savoir quand un commentaire a été créé ou modifié
    timestamps: true,
  }
);

// Création et exportation du modèle basé sur ce schéma
module.exports = mongoose.model("Comment", commentSchema);
