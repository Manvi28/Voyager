const express = require('express');
const router = express.Router({ mergeParams: true });
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const {saveredirectURL}=require("../middleware.js");
const userController=require("../controllers/user.js");
const user = require('../models/user.js');

router.get("/signup", userController.rendersignup);

router.post("/signup", wrapAsync(userController.signup));

router.get("/login", userController.renderlogin);

router.post("/login",saveredirectURL, passport.authenticate("local", { failureFlash: true, failureRedirect: "/login" }), wrapAsync(userController.login));

router.get("/logout", userController.logout);
module.exports = router;