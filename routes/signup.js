const express=require('express');
const mongoose = require('mongoose');
const UserSchema = require('../schema/UserSchema');
const router= express.Router();
const { middleware } = require('../middleware');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');


router.get('/',(req,res)=>{

    res.render('users/register');
})

router.post('/', catchAsync(async(req,res,next)=>
{
    const {username,email,password,name}=req.body;
    const user=new UserSchema({username,email,name});
    const registeredUser = await UserSchema.register(user, password);
    req.login(registeredUser, err => {
        if (err) return next(err);
        req.flash('success', 'Welcome');
       return res.redirect('/');
    })
   
}))
module.exports = router;