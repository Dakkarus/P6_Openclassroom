const { application } = require('express');
const express = require('express');
const mongoose = require('mongoose');

const saucesRoutes = require('./routes/sauces');
const userRoutes = require('./routes/User');

mongoose.connect('mongodb+srv://Dakkarus:Mamounette@cluster0.gekv3ms.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const app= express();

  //Middleware permettant la com entre 2 port diff (origin diff), contourne la policy CORS de base
//acces a notre api depuis n'importe quel origine (*)

  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

  app.use(express.json());

  app.use('/api/sauces', saucesRoutes);
  app.use('/api/auth', userRoutes);
module.exports = app;