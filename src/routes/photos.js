const express = require('express');
const router = express.Router();

const Photo = require('../models/Photo');
const { isAuthenticated } = require('../helpers/auth');

router.get('/photos/add', isAuthenticated, async (req, res) => {
    await res.render('photos/new-photo')
});

router.post('/photos/new-photo', isAuthenticated, async (req, res) => {
    console.log(req.body);
    const { name, description, photoUrl, albumId } = req.body;
    const errors = [];
    if (!name) {
        errors.push({ text: 'Please add a name' });
    }
    if (!description) {
        errors.push({ text: 'Please add a description' });
    }
    if (!photoUrl) {
        errors.push({ text: 'Please add a photo URL' });
    }
    if (!albumId) {
        errors.push({ text: 'Please add an album Id' });
    }
    if (errors.length > 0) {
        res.render('photos/new-photo', {
            errors,
            name,
            description
        });
    } else {
        const newPhoto = new Photo({ name, description, photoUrl, albumId });
        newPhoto.user = req.user.id;
        await newPhoto.save();
        req.flash('success_msg', 'Photo added successfully');
        res.redirect('/photos');
    }
});


router.get('/photos', isAuthenticated, async (req, res) => {
    const photos = await Photo.find({user: req.user.id}).lean().sort({ date: 'desc' });
    await res.render('photos/all-photos', { photos });
});

router.get('/photos/:albumId', isAuthenticated, async (req, res) => {
    const photos = await Photo.find({albumId: req.params.albumId}).lean().sort({ date: 'desc' });
    await res.render('photos/all-photos', { photos });
});

router.get('/photos/edit/:id', isAuthenticated, async (req, res) => {
    const photo = await Photo.findById(req.params.id).lean();
    res.render('photos/edit-photo', {photo});
    console.log(photo);
});

router.put('/photos/edit-photo/:id', isAuthenticated, async (req, res) => {
    const { name, description, photoUrl, albumId } = req.body;
    await Photo.findByIdAndUpdate(req.params.id, { name, description, photoUrl, albumId });
    req.flash('success_msg', 'Photo updated successfully');
    res.redirect('/photos');
});

router.delete('/photos/delete/:id', isAuthenticated, async (req, res) => {
    await Photo.findByIdAndDelete(req.params.id);
    req.flash('success_msg', 'Photo deleted successfully');
    res.redirect('/photos');
});

module.exports = router;