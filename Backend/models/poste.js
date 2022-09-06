const mongoose = require('mongoose');

//Schema de données pour les postes
const posteSchema = mongoose.Schema({
    userId: { type: String, required: true },
    name: { type: String, required: true },
    manufacturer: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String, required: true },
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
    usersLiked: { type: Array, default: [ ] },
    usersDisliked: { type: Array, default: [ ] },
});

module.exports = mongoose.model('Poste', posteSchema);