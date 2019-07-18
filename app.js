// included modules
const 	express = require("express"),
		app = express(),
		bodyParser = require("body-parser"),
		mongoose = require("mongoose"),
        passport = require("passport"),
        localStrategy = require("passport-local"),
		methodOverride = require("method-override"),
		expressSanitizer = require("express-sanitizer");

// Models for database
const Campground = require("./models/campground"),
        Comment = require("./models/comment"),
        User = require("./models/user"),
		seedDB = require("./seeds");
seedDB();

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

// override with POST having ?_method=PUT or ?_method=DELETE
app.use(methodOverride('_method'));

// Middleware function to check if user is authenticated/logged in
const isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
};

// Middleware to add user data to all routes
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
});

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
			res.render("campgrounds/index", {
				campgrounds: allCampgrounds,
			});
		}
	});
});

// NEW New campground page
app.get("/campground/new", (req, res) => {
	res.render("campgrounds/new");
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
// app.get("/campground/:id/edit", (req, res) => {
// 	Campground.findById(req.params.id, (err, foundCampground) =>{
// 		if (err) {
// 			console.log(err);
// 		} else {
// 			res.render("campgrounds/edit", {campground: foundCampground});
// 		}
// 	});
// });

// // UPDATE
// app.put("/campground/:id", (req, res) => {
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
// app.delete("/campground/:id", (req, res) => {
// 	Campground.findByIdAndDelete(req.params.id, (err) => {
// 		if (err) {
// 			console.log(err);
// 		} else {
// 			res.redirect("/campground");
// 		}
// 	});
// });

/*
Comment routes
*/

// NEW comment
app.get("/campground/:id/comment/new", isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {campground : foundCampground});
        }
    });
});

// CREATE comment
app.post("/campground/:id/comment", isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
        if(err){
            console.log(err);
        } else {
            Comment.create(req.body.comment, (err, newlyCreatedComment) => {
                if (err) {
                    console.log(err);
                } else {
                    foundCampground.comments.push(newlyCreatedComment);
                    foundCampground.save();
                    res.redirect("/campground/" + foundCampground._id);
                }
            });

        }
    });
});

/*
Auth routes
*/

// Register form route
app.get("/register", (req, res) => {
    res.render("register");
});

// Register submission route
app.post("/register", (req, res) => {
    let newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, (err, user) => {
        if(err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, () => {
            res.redirect("/campground");
        });
    });
});

// const isLoggedIn = (req, res, next) => {
//   if(req.isAuthenticated()){ // .isAuthenticated comes from Passport
//     return next(); // Returna and run next, which is the next piece whatever the route is. "If the user is logged in, keep going"
//   }
//   res.redirect("/login");
// };

/*
Login routes
*/

// Login Form
app.get("/login", (req, res) => {
    res.render("login");
});

// Handling login logic/post
app.post("/login", passport.authenticate("local",
    {
        successRedirect: "/campground",
        failureRedirect: "/login"
    }), (req, res) => {
});

// Logout
app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/campground");
});

// Server start!
app.listen(3000, () => {
	console.log("The YelpCamp application server has started!");
});