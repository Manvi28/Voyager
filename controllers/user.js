const User = require("../models/user.js");

module.exports.rendersignup=(req, res) => {
    res.render("users/signup");
}

module.exports.signup=async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const newuser = new User({ email, username });
        const registeredUser = await User.register(newuser, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash("success", "Welcome to Voyager");
            res.redirect("/listings");
        });
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
}

module.exports.renderlogin=(req, res) => {
    res.render("users/login");
}

module.exports.login=async (req, res) => {
    req.flash("success", "Welcom to Voyager, Logged in successfully");
    res.redirect(res.locals.redirectURL || "/listings");
}

module.exports.logout=(req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "Successfully logged out!");
        res.redirect("/listings");
    });
}