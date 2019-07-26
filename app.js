// included modules
const 	express = require("express"),
		app = express(),
		bodyParser = require("body-parser"),
		mongoose = require("mongoose"),
        passport = require("passport"),
        localStrategy = require("passport-local"),
		methodOverride = require("method-override"),
		expressSanitizer = require("express-sanitizer"),
        flash = require("connect-flash");

// Constant for environment variables and bindings
const PORT = process.env.PORT || 3000;

// Models for database
const Campground = require("./models/campground"),
        User = require("./models/user"),
        Comment = require("./models/comment"),
		seedDB = require("./seeds");
// seedDB(); // Seed the database

// reuiring routes
const commentRoutes = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes = require("./routes/index");

// Set up MongoDB/mongoose using ATLAS to make it server-independent (code pulled from MongoDB atlas page )
const mongoURI = process.env.databaseURL;
mongoose.connect(mongoURI, {
	useNewUrlParser: true,
	dbName: "YelpCamp",
	useFindAndModify: false
}, ).then(() => {
	console.log('Connected to DB!');
}).catch(err => {
	console.log('ERROR:', err.message);
});

// Config and init of Passport module
app.use(require("express-session")({
    secret: "YelpCamp for WDB",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// module activation and linking
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(expressSanitizer());
app.use(flash()); //connect-flash module

// override with POST having ?_method=PUT or ?_method=DELETE
app.use(methodOverride('_method'));

// Middleware to add user data to all routes
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

// Server start!
app.listen(PORT, () => {
	console.log("The YelpCamp application server has started!");
});
