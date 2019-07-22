const express = require("express"),
    router = express.Router(),
    passport = require("passport");

const User = require("../models/user");

// TODO Move to it's own module later
// Middleware function to check if user is authenticated/logged in
const isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
};

// Root route landing page
router.get("/", (req, res) => {
	res.render("landing");
});

/*
Auth routes
*/

// Register form route
router.get("/register", (req, res) => {
    res.render("register");
});

// Register submission route
router.post("/register", (req, res) => {
    let newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, (err, user) => {
        if(err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, () => {
            res.redirect("/campgrounds");
        });
    });
});

// Login Form
router.get("/login", (req, res) => {
    res.render("login");
});

// Handling login logic/post
router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), (req, res) => {
});

// Logout
router.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/campgrounds");
});

module.exports = router;