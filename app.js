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
app.get("/campground", (req, res) => {
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
app.get("/campground/new", (req, res) => {
	res.render("new");
});


// CREATE Add to campgrounds page
app.post("/campground", (req, res) => {
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
app.get("/campground/:id", (req, res) => {
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

// EDIT
app.get("/campground/:id/edit", (req, res) => {
	Campground.findById(req.params.id, (err, foundCampground) =>{
		if (err) {
			console.log(err);
		} else {
			res.render("edit", {campground: foundCampground});
		}
	});
});

// UPDATE
app.put("/campground/:id", (req, res) +> {
	req.body.campground.body = req.sanitize(req.body.campground.body);
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updateCampground) => {
		if (err) {
			console.log(error);
		} else {
			console.log(updateCampground);
			res.redirect("/campground/" + req.params.id);
		}
	});
});

// DESTROY
app.delete("/campground/:id", (req, res) => {
	Campground.findByIdAndDelete(req.params.id, (err) => {
		if (err) {
			console.log(err);
		} else {
			res.redirect("/campground");
		}
	});
});

// Server start!
app.listen(3000, () => {
	console.log("The YelpCamp application server has started!");
});