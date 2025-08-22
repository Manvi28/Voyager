const express=require('express');
const router=express.Router({mergeParams: true});
const User=require("../models/user.js");
const wrapAsync=require("../utils/wrapAsync.js");
const passport=require("passport");

router.get("/signup",(req,res)=>{
    res.render("users/signup");
})

router.post("/signup",wrapAsync(async(req,res)=>{
    try{
        const {username,email,password}=req.body;
    const newuser=new User({email,username});
    const registeredUser=await User.register(newuser,password);
    console.log(registeredUser);
    req.flash("success","Welcome to Voyager");
    res.redirect("/listings");
    } catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
    
}));

router.get("/login",(req,res)=>{
    res.render("users/login");
})

router.post("/login",passport.authenticate("local",{failureFlash:true,failureRedirect:"/login"}),wrapAsync(async(req,res)=>{
    req.flash("success","Welcom to Voyager, Logged in successfully");
    res.redirect("/listings");
}));

module.exports=router;