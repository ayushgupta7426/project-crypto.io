const express=require('express');
const mongoose = require('mongoose');
const UserSchema = require('../schema/UserSchema');
const router= express.Router();
const { middleware } = require('../middleware');


router.get('/',(req,res)=>{
    res.render('users/register');
})

router.post('/',async(req,res,next)=>
{
    try
    {
    const {username,email,password,name}=req.body;
    const user=new UserSchema({username,email,name});
    const registeredUser = await UserSchema.register(user, password);
    req.login(registeredUser, err => {
        if (err) return next(err);
        req.flash('success', 'Welcome');
       return res.redirect('/');
    })
    }
    catch (e) {
        req.flash('error', req.flash('error', 'bsdk same username mt daal'));
        res.redirect('/signup');
    }   
    
})
module.exports = router;