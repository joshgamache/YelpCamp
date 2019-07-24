const express = require("express"),
    router = express.Router();

const Campground = require("../models/campground"); // Campground model
const middleware = require("../middleware"); // Middleware functions object

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
router.get("/new", middleware.isLoggedIn, (req, res) => {
	res.render("campgrounds/new");
});

// CREATE Add to campgrounds page
router.post("/", middleware.isLoggedIn, (req, res) => {
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
router.get("/:id/edit", middleware.checkCampgroundAuthorization, (req, res) => {
    // Is the user logged in?
    Campground.findById(req.params.id, (err, foundCampground) =>{
        res.render("campgrounds/edit", {campground: foundCampground});
    });
});

// UPDATE
router.put("/:id", middleware.checkCampgroundAuthorization, (req, res) => {
	req.body.campground.body = req.sanitize(req.body.campground.body);
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updateCampground) => {
		if (err) {
			console.log(error);
            res.redirect("/campgrounds");
		} else {
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

// DESTROY
router.delete("/:id", middleware.checkCampgroundAuthorization, (req, res) => {
	Campground.findByIdAndDelete(req.params.id, (err) => {
		if (err) {
			console.log(err);
		} else {
			res.redirect("/campgrounds");
		}
	});
});

module.exports = router;