// included modules
const express    = require("express"),
	  app        = express(),
	  bodyParser = require("body-parser"),
	  mongoose   = require("mongoose");

// module activation and linking
mongoose.connect("mongodb://localhost:27017/yelp_camp",  { useNewUrlParser: true });
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

// Schema and model
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
	description: String
});
var Campground = mongoose.model("Campground", campgroundSchema);

// Create a campground, based on the previous schema, within the database
// Campground.create(
// {
// 	name: "Bow River", 
// 	image: "https://farm9.staticflickr.com/8167/7121865553_e1c6a31f07.jpg",
// 	description: "This is a river. It's watery and it has places to camp"
// }, function(err, campground){
// 	if (err){
// 		console.log(err);
// 	} else {
// 		console.log("Newly created campground:");
// 		console.log(campground);
// 	}
// });

// Temporary array for testing
// var campgrounds = [
// 	{name: "Salmon Run", image: "https://farm8.staticflickr.com/7252/7626464792_3e68c2a6a5.jpg"},
// 	{name: "Bow River", image: "https://farm9.staticflickr.com/8167/7121865553_e1c6a31f07.jpg"},
// 	{name: "Nose Hill", image: "https://farm9.staticflickr.com/8422/7842069486_c61e4c6025.jpg"}
// ];

// Landing page
app.get("/", function(req, res){
	res.render("landing");
});


// INDEX Campgrounds page
app.get("/campgrounds", function(req, res){
	Campground.find({}, function(err, allCampgrounds){
		if (err){
			console.log(err);
		} else {
			res.render("index", {campgrounds:allCampgrounds});
		}
	});
});

// NEW New campground page
app.get("/campgrounds/new", function(req, res){
	res.render("new");
});


// CREATE Add to campgrounds page
app.post("/campgrounds", function(req, res){
	// get data from form and add to the campgrounds array
	var newCamp = {name: req.body.campName, image: req.body.campImg, description: req.body.campDescription};
	// Take newly created campground from form and make a new entry
	Campground.create(newCamp, function(err, newlyCreated){
		if (err){
			console.log(err);
		} else {
			// res.render("campgrounds", {campgrounds:allCampgrounds});
			res.redirect("/campgrounds");
		}
	// redirect back to campgrounds page

	});
	
	// campgrounds.push(newCamp);
	// res.send("You have reached the post route!");
});

// SHOW shows more info about a single campground
app.get("/campgrounds/:id", function(req, res){
		Campground.findById(req.params.id, function(err, foundCampground){
		if(err){
			console.log(err);
		} else {
			res.render("show", {campDetails:foundCampground});
		}
	});
});

// Server start!
app.listen(3000, function(){
		   console.log("The YelpCamp application server has started!");
});