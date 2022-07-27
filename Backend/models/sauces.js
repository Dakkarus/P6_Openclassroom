const mongoose = require('mongoose');

const saucesSchema = mongoose.Schema({
name :{type: String, require: true},
manufacturer:{type: String, require: true},
description:{type: String, require: true},
mainPepper:{type: String, require: true},
imageUrl:{type: String, require: true},
heat:{type: Number, require: true},
likes:{type: Number, require: true},
dislikes:{type: Number , require: true},
userliked:{type: Array, require: true},
userDisliked:{type: Array , require: true},
});

module.exports = mongoose.model('sauces',saucesSchema);