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
            req.flash("error", "Database error -- " + err);
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
            req.flash("error", "Database error -- " + err);
		} else {
            newlyCreatedCampground.author = author;
            console.log(newlyCreatedCampground);
            newlyCreatedCampground.save();
			// console.log(newlyCreatedCampground);
            req.flash("success", "New campground created.");
			res.redirect("campgrounds");
		}	// redirect back to campgrounds index page
	});
});

// SHOW shows more info about a single campground
router.get("/:id", (req, res) => {
	Campground.findById(req.params.id).populate("comments").exec((err, foundCampground) => {
		if (err || !foundCampground) {
            req.flash("error", "Campground not found -- " + err);
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
            req.flash("error", "Campground not found -- " + err);
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
            req.flash("error", "Campground not found -- " + err);
		} else {
            req.flash("success", "Campground has been deleted.");
			res.redirect("/campgrounds");
		}
	});
});

module.exports = router;