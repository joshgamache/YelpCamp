const express = require("express"),
    router = express.Router({mergeParams: true});

const Campground = require("../models/campground");
const Comment = require("../models/comment");

// TODO Move to it's own module later
// Middleware function to check if user is authenticated/logged in
const isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
};

/*
Comment routes
*/

// NEW comment
router.get("/new", isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {campground : foundCampground});
        }
    });
});

// CREATE comment
router.post("/", isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
        if(err){
            console.log(err);
        } else {
            Comment.create(req.body.comment, (err, newlyCreatedComment) => {
                if (err) {
                    console.log(err);
                } else {
                    foundCampground.comments.push(newlyCreatedComment);
                    foundCampground.save();
                    res.redirect("/campground/" + foundCampground._id);
                }
            });

        }
    });
});

module.exports = router;