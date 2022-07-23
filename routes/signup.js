const express=require('express');
const mongoose = require('mongoose');
const UserSchema = require('../schema/UserSchema');
const router= express.Router();
const { middleware } = require('../middleware');


router.get('/',(req,res)=>{
    res.render('users/register');
})

router.post('/',async(req,res)=>
{
    const {username,email,password,name}=req.body;
    const user=new UserSchema({username,email});
    const registeredUser = await UserSchema.register(user, password);
    req.login(registeredUser, err => {
        if (err) return next(err);
        req.flash('success', 'Welcome');
       return res.redirect('/');
    })
    
})
module.exports = router;