const mongoose = require('mongoose');
const { Schema } = mongoose;

const PhotoSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, default: Date.now },
    albumId: { type: Number, required: true },
    photoUrl: { type: String, required: true },
});

module.exports = mongoose.model('Photo', PhotoSchema);