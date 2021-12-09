const mongoose = require('mongoose');
const { Schema } = mongoose;

const AlbumSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, default: Date.now },
    albumId: { type: Number, required: true },

});

module.exports = mongoose.model('Album', AlbumSchema);