// included modules
const 	express = require("express"),
		app = express(),
		bodyParser = require("body-parser"),
		mongoose = require("mongoose"),
		methodOverride = require("method-override",
		expressSanitizer = require("express-sanitizer");

// Set up MongoDB/mongoose using ATLAS to make it server-independent (code pulled from MongoDB atlas page )
const mongoURI = "mongodb+srv://devidle:" + process.env.MDBauth + "@cluster0-jcmtm.mongodb.net/test?retryWrites=true&w=majority";
mongoose.connect(mongoURI, {
	useNewUrlParser: true,
	dbName: "YelpCamp",
	useFindAndModify: false
}, ).then(() => {
	console.log('Connected to DB!');
}).catch(err => {
	console.log('ERROR:', err.message);
});

// module activation and linking
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(expressSanitizer());

// Schema and model
var campgroundSchema = new mongoose.Schema({
	name: String,
	image: String,
	description: String
});
var Campground = mongoose.model("Campground", campgroundSchema);

// Landing page
app.get("/", (req, res) => {
	res.render("landing");
});


// INDEX Campgrounds page
app.get("/campgrounds", (req, res) => {
	Campground.find({}, (err, allCampgrounds) => {
		if (err) {
			console.log(err);
		} else {
			res.render("index", {
				campgrounds: allCampgrounds
			});
		}
	});
});

// NEW New campground page
app.get("/campgrounds/new", (req, res) => {
	res.render("new");
});


// CREATE Add to campgrounds page
app.post("/campgrounds", (req, res) => {
	// get data from form and add to the campgrounds array
	var newCamp = {
		name: req.body.campName,
		image: req.body.campImg,
		description: req.body.campDescription
	};
	// Take newly created campground from form and make a new entry
	Campground.create(newCamp, (err, newlyCreated) => {
		if (err) {
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
app.get("/campgrounds/:id", (req, res) => {
	Campground.findById(req.params.id, (err, foundCampground) => {
		if (err) {
			console.log(err);
		} else {
			res.render("show", {
				campDetails: foundCampground
			});
		}
	});
});

// Server start!
app.listen(3000, () => {
	console.log("The YelpCamp application server has started!");
});