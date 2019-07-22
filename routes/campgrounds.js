const express = require("express"),
    router = express.Router();

const Campground = require("../models/campground");

// TODO Move to it's own module later
// Middleware function to check if user is authenticated/logged in
const isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
};

/*
Campground Routes
*/

// INDEX Campgrounds page
router.get("/", (req, res) => {
	Campground.find({}, (err, allCampgrounds) => {
		if (err) {
			console.log(err);
		} else {
			res.render("campgrounds/index", {
				campgrounds: allCampgrounds,
			});
		}
	});
});

// NEW New campground page
router.get("/new", isLoggedIn, (req, res) => {
	res.render("campgrounds/new");
});

// CREATE Add to campgrounds page
router.post("/", isLoggedIn, (req, res) => {
	req.body.campground.body = req.sanitize(req.body.campground.body);
	let author = {
        id: req.user._id,
        username: req.user.username
    }
    Campground.create(req.body.campground, (err, newlyCreatedCampground) => {
		if (err) {
			console.log(err);
		} else {
            newlyCreatedCampground.author = author;
            console.log(newlyCreatedCampground);
            newlyCreatedCampground.save();
			// console.log(newlyCreatedCampground);
			res.redirect("campgrounds");
		}	// redirect back to campgrounds index page
	});
});

// SHOW shows more info about a single campground
router.get("/:id", (req, res) => {
	Campground.findById(req.params.id).populate("comments").exec((err, foundCampground) => {
		if (err) {
			console.log(err);
		} else {
			res.render("campgrounds/show", {
				campground: foundCampground
			});
		}
	});
});


// EDIT
router.get("/:id/edit", (req, res) => {
	Campground.findById(req.params.id, (err, foundCampground) =>{
		if (err) {
			console.log(err);
		} else {
			res.render("campgrounds/edit", {campground: foundCampground});
		}
	});
});

// UPDATE
router.put("/:id", (req, res) => {
	req.body.campground.body = req.sanitize(req.body.campground.body);
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updateCampground) => {
		if (err) {
			console.log(error);
		} else {
			console.log(updateCampground);
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

// // DESTROY
// router.delete("/campgrounds/:id", (req, res) => {
// 	Campground.findByIdAndDelete(req.params.id, (err) => {
// 		if (err) {
// 			console.log(err);
// 		} else {
// 			res.redirect("/campgrounds");
// 		}
// 	});
// });

module.exports = router;