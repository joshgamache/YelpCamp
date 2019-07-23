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
                    //add username and id to comment
                    newlyCreatedComment.author.id = req.user._id;
                    newlyCreatedComment.author.username = req.user.username;
                    newlyCreatedComment.save();
                    // save comment
                    foundCampground.comments.push(newlyCreatedComment);
                    foundCampground.save();
                    res.redirect("/campgrounds/" + foundCampground._id);
                }
            });

        }
    });
});

// EDIT
router.get("/:comment_id/edit", (req, res) => {
    Comment.findById(req.params.comment_id, (err, foundComment) => {
        if(err){
            res.redirect("back");
        } else {
            res.render("comments/edit", {comment: foundComment, campground_id: req.params.id});
        }
    });
});

// UPDATE
router.put("/:comment_id", (req, res) => {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) => {
        if(err){
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
});

// DESTROY
router.delete("/:comment_id", (req, res) => {
    Comment.findByIdAndDelete(req.params.comment_id, (err) => {
        if(err){
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
})

module.exports = router;