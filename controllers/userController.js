const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const UserModel = require("../models/user");

// Fonction pour l'inscription d'un utilisateur
module.exports.signup = async (req, res) => {
  try {
    const hash = await bcrypt.hash(req.body.password, 10);
    const user = new UserModel({
      pseudo: req.body.pseudo,
      email: req.body.email,
      password: hash,
      role: req.body.role || 'user',
    });

    await user.save();
    res.status(201).json({ message: `Utilisateur créé avec l'adresse suivante : ${req.body.email}` });
  } catch (err) {
    res.status(500).json({ message: "Une erreur s'est produite lors de la création de l'utilisateur", err });
  }
};

// Fonction pour la connexion d'un utilisateur
module.exports.login = async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });
    if (!user) return res.status(401).json({ message: "Paire identifiant/mot de passe incorrecte" });

    const valid = await bcrypt.compare(req.body.password, user.password);
    if (!valid) return res.status(401).json({ message: "Paire identifiant/mot de passe incorrecte" });

    const token = jwt.sign(
      { userId: user._id, userRole: user.role },
      'RANDOM_TOKEN_SECRET',
      { expiresIn: "24h" }
    );

    res.status(200).json({ userId: user._id, token });
  } catch (err) {
    res.status(500).json({ message: "Une erreur s'est produite lors de la connexion", err });
  }
};

// Fonction pour la déconnexion d'un utilisateur
module.exports.logout = (req, res) => {
  res.status(200).json({ message: "Déconnexion réussie" });
};
