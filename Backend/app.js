const { application } = require('express');
const express = require('express');
const mongoose = require('mongoose');

const app= express();

mongoose.connect('mongodb+srv://Dakkarus:Mamounette@cluster0.gekv3ms.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

//Middleware affichage message console
//Pensé au next qui sert à passé au prochain middleware
app.use((req, res, next) =>{
    console.log('requette recu');
    next();
});

//middleware changement code statue réponse
app.use((req,res,next)=>{
    res.status(200);
    next();
})

//middleware de réponse 
app.use((req, res, next) => {
    res.json({message: "Votre requette à bien été recu"});
    next();
});

app.use((req, res) =>{
    console.log('Réponse bien envoyé');
});

//Middleware permettant la com entre 2 port diff (origin diff), contourne la policy CORS de base
//acces a notre api depuis n'importe quel origine (*)
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

//Middleware des sauces

//app.use('/api/sauces'(res, req,next)=>{
//const sauces = [
//{
//userId :"",// string, id mongoDB unique de user
//name :'',//string, nom de la sauce
//manufacturer:'',//string, fabriquant de la sauce
//description:'',//string, description de la sauce
//mainPepper:'',//string, Ingrédient principale de la sauce
//imageUrl:'',//string, Url de l'image de la sauce télécharger par user 
//heat:'',// nbr, entre1 et 10, piquant de la sauce
//likes:'',//nbr, nbr user qui like
//dislikes:'',//nbr, nbr user qui dislike
//userLiked:'',//["string <userId>"], tableau identifiant user qui like
//userDisliked:'',//["string<userId>"], tableau user qui dislike 
//}
//]
//res.status(200).json(sauces)
//})

//Middleware inscription

//app.use('/api/auth/signup'(res,req,next)=>{
    //const user =[
        //{
            //email:'',//string, email de user UNIQUE!!!
            //password:'',//string, mdp de user Haché !!!!
        //}
    //]
//})
module.exports = app;