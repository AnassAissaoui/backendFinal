// Importation de Mongoose pour interagir avec MongoDB
const mongoose = require("mongoose");

// Importation du plugin pour valider l'unicité des champs (empêcher les doublons)
const uniqueValidator = require("mongoose-unique-validator");

// Définition du schéma pour les utilisateurs
const userSchema = mongoose.Schema({
  // Définition du champ pseudo, qui est de type String, n'est pas requis, mais doit être unique
  pseudo: { type: String, required: false, unique: true },

  // Définition du champ email, requis et unique (on ne peut pas avoir deux utilisateurs avec le même email)
  email: { type: String, required: true, unique: true },

  // Définition du champ password, requis pour créer un utilisateur
  password: { type: String, required: true },

  // Définition du rôle de l'utilisateur, peut être 'admin' ou 'user', par défaut 'user'
  role: { type: String, enum: ['admin', 'user'], default: 'user' }
});

// Application du plugin uniqueValidator pour empêcher les doublons d'email et pseudo
userSchema.plugin(uniqueValidator);

// Exportation du modèle User basé sur le schéma défini
module.exports = mongoose.model("User", userSchema);
