// Importation des modules nécessaires
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const UserModel = require("../models/user");

// Fonction pour l'inscription d'un utilisateur
module.exports.signup = (req, res) => {
    // Hachage du mot de passe avant de l'enregistrer dans la base de données
    bcrypt.hash(req.body.password, 10)
      .then(hash => {
        // Création d'un nouveau modèle utilisateur avec les informations envoyées
        const user = new UserModel({
         pseudo: req.body.pseudo,
         email: req.body.email,
         password: hash,
         role: req.body.role || 'user', // Si aucun rôle n'est spécifié, l'utilisateur est par défaut "user"
        });

        // Sauvegarde de l'utilisateur dans la base de données
        user.save()
          .then(() => res.status(201).json({ message: `Utilisateur créé avec l'adresse suivante : ${req.body.email}` }))
          .catch(err => res.status(400).json({ err }));
      })
      .catch(err => res.status(500).json({ message: "Une erreur s'est produite lors de la création de l'utilisateur", err }));
};

// Fonction pour la connexion d'un utilisateur
module.exports.login = (req, res) => {
    // Recherche de l'utilisateur en fonction de son email
    UserModel.findOne({ email: req.body.email })
    .then(user => {
        if (user === null) {
            // Si l'utilisateur n'existe pas, on renvoie un message générique pour éviter de dévoiler des informations sur l'existence de l'utilisateur
            return res.status(401).json({ message: "Paire identifiant/mot de passe incorrecte" });
        } else {
            // Comparaison du mot de passe envoyé avec celui stocké en base de données
            bcrypt.compare(req.body.password, user.password)
            .then(valid => {
                if (!valid) {
                    // Si les mots de passe ne correspondent pas, renvoyer une erreur
                    return res.status(401).json({ message: "Paire identifiant/mot de passe incorrecte" });
                } else {
                    // Si tout est valide, on génère un token JWT et on le renvoie
                    res.status(200).json({
                        userId: user._id,
                        // Création du token avec une durée de validité de 24 heures
                        token: jwt.sign(
                            { userId: user._id, userRole: user.role },
                            process.env.JWT_SECRET_KEY || 'RANDOM_TOKEN_SECRET', // Clé secrète à définir en variable d'environnement pour la sécurité
                            { expiresIn: "24h" }
                        )
                    });
                }
            })
            .catch(err => res.status(500).json({ message: "Une erreur s'est produite pendant la comparaison des mots de passe", err }));
        }
    })
    .catch(err => res.status(500).json({ message: "Une erreur s'est produite pendant le findOne", err }));
};

// Fonction pour la déconnexion d'un utilisateur
module.exports.logout = (req, res) => {
  // Cette route ne contient pas de logique serveur, car le token sera supprimé du côté client (front-end)
  // On renvoie une confirmation de la déconnexion réussie
  res.status(200).json({ message: "Déconnexion réussie" });
}
