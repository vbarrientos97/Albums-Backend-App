const express = require('express');
const router = express.Router();

const Album = require('../models/Album');
const { isAuthenticated } = require('../helpers/auth');

router.get('/albums/add', isAuthenticated, async (req, res) => {
    await res.render('albums/new-album')
});

router.post('/albums/new-album', isAuthenticated, async (req, res) => {
    console.log(req.body);
    const { name, description, albumId } = req.body;
    const errors = [];
    if (!name) {
        errors.push({ text: 'Please add a name' });
    }
    if (!description) {
        errors.push({ text: 'Please add a description' });
    }
    if (!albumId) {
        errors.push({ text: 'Please add a album Id' });
    }
    if (errors.length > 0) {
        res.render('albums/new-album', {
            errors,
            name,
            description
        });
    } else {
        const newAlbum = new Album({ name, description, albumId });
        newAlbum.user = req.user.id;
        await newAlbum.save();
        req.flash('success_msg', 'Album added successfully');
        res.redirect('/albums');
    }
});


router.get('/albums', isAuthenticated, async (req, res) => {
    const albums = await Album.find({user: req.user.id}).lean().sort({ date: 'desc' });
    await res.render('albums/all-albums', { albums });
});

router.get('/albums/edit/:id', isAuthenticated, async (req, res) => {
    const album = await Album.findById(req.params.id).lean();
    res.render('albums/edit-album', {album});
    console.log(album);
});

router.put('/albums/edit-album/:id', isAuthenticated, async (req, res) => {
    const { name, description, albumId } = req.body;
    await Album.findByIdAndUpdate(req.params.id, { name, description, albumId });
    req.flash('success_msg', 'Album updated successfully');
    res.redirect('/albums');
});

router.delete('/albums/delete/:id', isAuthenticated, async (req, res) => {
    await Album.findByIdAndDelete(req.params.id);
    req.flash('success_msg', 'Album deleted successfully');
    res.redirect('/albums');
});

module.exports = router;