const express = require("express"),
    router = express.Router();

const Campground = require("../models/campground");

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
router.get("/new", (req, res) => {
	res.render("campgrounds/new");
});

// CREATE Add to campgrounds page
router.post("/", (req, res) => {
	req.body.campground.body = req.sanitize(req.body.campground.body);
	Campground.create(req.body.campground, (err, newlyCreatedCampground) => {
		if (err) {
			console.log(err);
		} else {
			console.log(newlyCreatedCampground)
			res.redirect("/campground");
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


// Commenting this section out, as the course does not yet act on these -- will be used later once user verification is enacted.
// // EDIT
// router.get("/campground/:id/edit", (req, res) => {
// 	Campground.findById(req.params.id, (err, foundCampground) =>{
// 		if (err) {
// 			console.log(err);
// 		} else {
// 			res.render("campgrounds/edit", {campground: foundCampground});
// 		}
// 	});
// });

// // UPDATE
// router.put("/campground/:id", (req, res) => {
// 	req.body.campground.body = req.sanitize(req.body.campground.body);
// 	Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updateCampground) => {
// 		if (err) {
// 			console.log(error);
// 		} else {
// 			console.log(updateCampground);
// 			res.redirect("/campground/" + req.params.id);
// 		}
// 	});
// });

// // DESTROY
// router.delete("/campground/:id", (req, res) => {
// 	Campground.findByIdAndDelete(req.params.id, (err) => {
// 		if (err) {
// 			console.log(err);
// 		} else {
// 			res.redirect("/campground");
// 		}
// 	});
// });

module.exports = router;