const mongoose = require("mongoose");

const ReviewSchema = mongoose.Schema({
	body: String,
	rating: Number,
	author: {
		type: mongoose.Schema.ObjectId,
		ref: "User",
	},
});

module.exports = mongoose.model("Review", ReviewSchema);
