// Importation de Mongoose pour interagir avec MongoDB
const mongoose = require("mongoose");

// Définition du schéma pour les posts (par exemple, les messages de type tweet)
const postSchema = mongoose.Schema(
    {
        // Le message du post, de type chaîne de caractères, requis
        message: { type: String, required: true },

        // L'URL de l'image associée au post, non obligatoire
        imageUrl: { type: String },

        // L'auteur du post, référence à un utilisateur dans la base de données
        // On utilise ObjectId pour référencer l'ID d'un utilisateur
        author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

        // Le tableau des commentaires, chaque élément est un ID de commentaire
        // On utilise un tableau pour pouvoir lier plusieurs commentaires à un post
        comment: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }]
    },
    {
        // Ajout des timestamps pour savoir quand un post a été créé ou modifié
        timestamps: true,
    }
);

// Création et exportation du modèle basé sur ce schéma
module.exports = mongoose.model("Post", postSchema);
