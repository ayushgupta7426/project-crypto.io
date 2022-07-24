const express = require('express');
const mongoose = require('mongoose');
const UserSchema = require('../schema/UserSchema');
const router = express.Router();
const passport = require('passport');
const { middleware } = require('../middleware');


router.get('/', async (req, res) => {
    
    res.render('users/login');
})
router.post('/', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), async (req, res) => {
    
    const redirectUrl = req.session.returnTo || '/';
    delete req.session.returnTo;
    req.flash('success', 'logged in');
    res.redirect(redirectUrl);
})
module.exports = router;