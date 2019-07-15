const mongoose = require("mongoose");

let campgroundSchema = new mongoose.Schema({
	name: String,
	image: String,
	description: String,
	comments: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "Comment"
	}]
});

module.exports = mongoose.model("Campground", campgroundSchema);  // This "returns" the Campground model to be imported.