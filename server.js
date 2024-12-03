const express = require("express"); // Importation du framework Express
const app = express(); // Création d'une instance de l'application Express
const port = 3000; // Port sur lequel le serveur écoute
const connectDB = require('./config/bd'); // Fonction de connexion à la base de données
const routerPost = require("./routes/postRoutes"); // Routeur pour gérer les posts
const routerUser = require("./routes/userRoutes"); // Routeur pour gérer les utilisateurs
const routerComment = require("./routes/commentRoutes"); // Routeur pour gérer les commentaires
const path = require("path"); // Utilisation du module path pour gérer les chemins de fichiers

// Connexion à la base de données
connectDB();

// Protection du CORS (Cross-Origin Resource Sharing) C'est un mécanisme de sécurité pour éviter les requêtes non autorisées entre différentes origines
app.use((req, res, next) => {
  // Définition des en-têtes pour permettre les requêtes depuis n'importe quelle origine
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next(); // Passage au middleware suivant
});

// Middleware pour traiter les données de la requête et transformer le corps JSON en objet JavaScript
app.use(express.json());

// Définition des routes pour chaque ressource de l'API
app.use("/api/post", routerPost); // Route pour gérer les posts
app.use("/api/auth", routerUser); // Route pour gérer les utilisateurs (authentification)
app.use("/api/comment", routerComment); // Route pour gérer les commentaires

// Pour servir les images statiques, utiles si tu as des images associées à tes posts, utilisateurs, etc.
app.use('/images', express.static(path.join(__dirname, 'images')));

// Lancement du serveur et écoute sur le port spécifié
app.listen(port, () => {
  console.log(`Connexion au port : ${port}`); // Affichage dans la console que le serveur fonctionne
});