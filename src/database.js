const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/albums-db-app', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, err => {
    if(err) throw err;
    console.log('Connected to MongoDB!!!')
});