// Importation de multer pour gérer les fichiers téléchargés
const multer = require('multer');

// Définition des types MIME supportés pour les images
const MIME_TYPES = {
  'image/jpg': 'jpg',    // Type MIME pour les fichiers JPG
  'image/jpeg': 'jpg',   // Type MIME pour les fichiers JPEG
  'image/png': 'png',     // Type MIME pour les fichiers PNG
  'image/gif': 'gif'      // Type MIME pour les fichiers PNG
};

// Configuration du stockage des fichiers avec multer
const storage = multer.diskStorage({
  // Définir le dossier de destination des fichiers téléchargés
  destination: (req, file, callback) => {
    callback(null, 'images'); // Les fichiers seront stockés dans le dossier 'images'
  },

  // Définir le nom du fichier téléchargé
  filename: (req, file, callback) => {
    // Remplacer les espaces par des underscores dans le nom du fichier
    const name = file.originalname.split(' ').join('_');

    // Obtenir l'extension du fichier à partir du type MIME
    const extension = MIME_TYPES[file.mimetype];

    // Créer un nom de fichier unique en ajoutant la date actuelle (pour éviter les doublons)
    callback(null, name + Date.now() + '.' + extension);
  }
});

// Exportation de la configuration multer pour l'utiliser dans d'autres fichiers
module.exports = multer({ storage: storage }).single('image');
