const express = require('express');
const mongoose = require('mongoose');
const UserSchema = require('../schema/UserSchema');
const router = express.Router();
const passport = require('passport');
const { middleware } = require('../middleware');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');


router.get('/', (req, res) => {
    req.logout(function (err) {
        if (err) return next(err); })
    req.flash('success', "Goodbye!");
   res.redirect('/')
})

module.exports = router;