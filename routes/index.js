const express = require("express"),
    router = express.Router(),
    passport = require("passport");

const User = require("../models/user");

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
            req.flash("error", err.message); // this error comes from passport
            return res.redirect("/register");
        }
        passport.authenticate("local")(req, res, () => {
            req.flash("success", "Thanks for registering, welcome to YelpCamp " + user.username);
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
    req.flash("success", "You have been logged out.");
    res.redirect("/campgrounds");
});

module.exports = router;