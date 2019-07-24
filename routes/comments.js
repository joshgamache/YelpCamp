const express = require("express"),
    router = express.Router({mergeParams: true});

const Campground = require("../models/campground");
const Comment = require("../models/comment");
const middleware = require("../middleware"); // Middleware functions object



/*
Comment routes
*/

// NEW comment
router.get("/new", middleware.isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {campground : foundCampground});
        }
    });
});

// CREATE comment
router.post("/", middleware.isLoggedIn, (req, res) => {
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
router.get("/:comment_id/edit", middleware.checkCommentAuthorization, (req, res) => {
    Comment.findById(req.params.comment_id, (err, foundComment) => {
        if(err){
            res.redirect("back");
        } else {
            res.render("comments/edit", {comment: foundComment, campground_id: req.params.id});
        }
    });
});

// UPDATE
router.put("/:comment_id", middleware.checkCommentAuthorization,  (req, res) => {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) => {
        if(err){
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
});

// DESTROY
router.delete("/:comment_id", middleware.checkCommentAuthorization, (req, res) => {
    Comment.findByIdAndDelete(req.params.comment_id, (err) => {
        if(err){
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
})

module.exports = router;