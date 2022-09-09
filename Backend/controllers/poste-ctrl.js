const Poste = require('../models/Poste');
const fs = require('fs');
const jwt = require('jsonwebtoken');


//Récupération d'une poste
exports.getOnePoste = (req, res, next) => {
    Poste.findOne({ _id: req.params.id })
        .then(poste => res.status(200).json(poste))
        .catch(error => {
            console.log(error);
            res.status(404).json({ message: error.message });
        });
};

//Récupération des postes
exports.getAllPoste = (req, res, next) => {
    Poste.find()
        .then(postes => res.status(200).json(postes))
        .catch(error => {
            console.log(error);
            res.status(404).json({ message: error.message });
        });
};
//Création d'une poste
exports.createPoste = (req, res, next) => {
    const posteObject = JSON.parse(req.body.poste);
    delete posteObject._id;
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    const userId = decodedToken.userId;

    const poste = new Poste({
        ...posteObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        userId: userId
    });
    poste.save()
        .then(() => res.status(201).json({ message: 'Objet enregistré !' }))
        .catch(error => res.status(400).json({ message: error.message }));

};


//Suppression poste
exports.deletePoste = (req, res, next) => {
    Poste.findOne({ _id: req.params.id })
        .then((poste) => {
            if (!poste) {
                res.status(404).json({
                    message: 'Poste non trouvée !'
                });
            }
            else {
                // poste dispo 
                const token = req.headers.authorization.split(' ')[1];
                const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
                const userId = decodedToken.userId;

                if (poste.userId !== userId) {
                    res.status(401).json({
                        message: 'Requête non autorisée!'
                    });
                }
                else {
                    // utilisateur a le droit de supprimer 
                    const filename = poste.imageUrl.split('/images/')[1];
                    fs.unlink(`images/${filename}`, () => {
                        Poste.deleteOne({ _id: req.params.id })
                            .then(() => res.status(200).json({ message: 'Poste supprimée !' }))
                            .catch(error => res.status(400).json({ message: error.message }));
                    });
                }
            }

        })
        .catch(error => res.status(500).json({ message: error.message }));
};


exports.modifyPoste = (req, res, next) => {
    if (req.file) {
        Poste.findOne({ _id: req.params.id })
            .then((poste) => {
                const filename = poste.imageUrl.split("/images/")[1];
                fs.unlink(`images/${filename}`, (err) => {
                    if (err) console.log(err);
                });
            })
            .catch((error) => console.log(error));
    }

    const posteObject = req.file
        ? {
            ...JSON.parse(req.body.poste),
            imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename
                }`,
        }
        : { ...req.body };
    Poste.updateOne(
        { _id: req.params.id },
        { ...posteObject, _id: req.params.id }
    )
        .then(() => res.status(200).json({ message: "Objet modifié !" }))
        .catch((error) => res.status(400).json({ error }));
};

//Like/dislike poste
exports.likeOrDislike = (req, res) => {
    like = req.body.like;
    id_poste = req.params.id;
    id_user = req.body.userId;
    switch (like) {
        case -1:
            // traitement
            // mettre à jour le nombre de dislike de poste  +1
            // ajouter le user ID dans la liste des userDislike
            Poste.updateOne({ _id: id_poste }, {
                $push: { usersDisliked: id_user }, $inc: { dislikes: +1 }
            }).then(() =>
                res.status(200).json({ message: "Je n'aime pas!" }))
                .catch((error) => res.status(400).json({ message: error.message }));
            break;

        case 0:
            //chercher la poste
            Poste.findOne({ _id: id_poste }).then((poste) => {
                // verifier si l'utilisateur like 
                // => eliminer le like
                if (poste.usersLiked.includes(id_user)) {
                    Poste.updateOne({ _id: id_poste }, {
                        $pull: { usersLiked: id_user }, $inc: { likes: -1 }
                    }).then(() =>
                        res.status(200).json({ message: "Neutre !" }))
                        .catch((error) => res.status(400).json({ message: error.message }));

                }
                // S'il dislike pas 
                // => j'elimine le dislike
                if (poste.usersDisliked.includes(id_user)) {
                    Poste.updateOne({ _id: id_poste }, {
                        $pull: { usersDisliked: id_user }, $inc: { dislikes: -1 }
                    }).then(() =>
                        res.status(200).json({ message: "Neutre !" }))
                        .catch((error) => res.status(400).json({ message: error.message }));

                }
            })
                .catch((error) => res.status(400).json({ message: error.message }));

            break;

        case 1:
            // traitement
            // mettre à jour le nombre de like de poste  +1
            // ajouter le user ID dans la liste des userlike
            Poste.updateOne({ _id: id_poste }, {
                $push: { usersLiked: id_user }, $inc: { likes: +1 }
            }).then(() =>
                res.status(200).json({ message: "J'aime !" }))
                .catch((error) => res.status(400).json({ message: error.message }));

            break;
    }

}
