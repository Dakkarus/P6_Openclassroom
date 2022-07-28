const Sauces = require('../models/sauces');


exports.createSauce = (req, res, next) => {
    const sauce = new Sauces({
    ...req.body
   });
   sauce.save()
   .then(()=> res.status(201).json({message: 'Sauce enregistré !'}))
   .catch(error => res.status(400).json({error:error}));
  };

  exports.updateSauce = (req,res,next)=>{
    Sauces.updateOne({_id: req.params.id}, { ...req.body, _id: req.params.id })
    .then(()=> res.status(200).json({message: 'Sauce modifié avec succès !'}))
    .catch(error => res.status(400).json({error}))
  };

  exports.deleteSauce = (req,res,next)=>{
    Sauces.deleteOne({_id: req.params.id})
    .then(()=> res.status(200).json({message: 'Sauce supprimé avec succès !'}))
    .catch(error => res.status(400).json({error}))
  };

  exports.getOneSauce = (req,res,next)=>{
    Sauces.findOne({_id: req.params.id})
    .then(sauce =>res.status(200).json(sauce))
    .catch(error =>res.status(404).json({error}))
  };

  exports.getAllSauce = (res,req,next)=>{
    Sauces.find()
    .then(sauces => res.status(200).json(things))
    .catch(error => res.status(400).json({error}));
  };