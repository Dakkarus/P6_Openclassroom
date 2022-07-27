const express =require('express');
const router = express.Router();

const Sauces = require('../models/sauces.js');

router.post('/', (req, res, next) => {
    const sauce = new Sauces({
    ...req.body
   });
   sauce.save()
   .then(()=> res.status(201).json({message: 'Sauce enregistré !'}))
   .catch(error => res.status(400).json({error:error}));
  });

  router.get('/',(res,req,next)=>{
    Sauces.find()
    .then(sauces => res.status(200).json(things))
    .catch(error => res.status(400).json({error}));
  })

  router.get('/:id', (req,res,next)=>{
    Sauces.findOne({_id: req.params.id})
    .then(sauce =>res.status(200).json(sauce))
    .catch(error =>res.status(404).json({error}))
  })

  router.put('/:id', (req,res,next)=>{
    Sauces.updateOne({_id: req.params.id}, { ...req.body, _id: req.params.id })
    .then(()=> res.status(200).json({message: 'Sauce modifié avec succès !'}))
    .catch(error => res.status(400).json({error}))
  })

  router.delete(':id', (req,res,next)=>{
    Sauces.deleteOne({_id: req.params.id})
    .then(()=> res.status(200).json({message: 'Sauce supprimé avec succès !'}))
    .catch(error => res.status(400).json({error}))
  })

  module.exports = router;
