const mongoose = require('mongoose');
const dotenv = require('dotenv').config();

const connectDB = async () => {
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('Connexion à MongoDB réussie !'))
  .catch((error) => console.log('Connexion à MongoDB échouée !', error));
}

module.exports = connectDB;