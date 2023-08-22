const mongoose = require("mongoose");
const LocalPassportMongo = require("passport-local-mongoose");

const userSchema = mongoose.Schema({
	email: {
		type: String,
		required: [true, "Email cannot be blank"],
		unique: true,
	},
	username: {
		type: String,
		required: [true, "Username cannot be blank"],
		unique: true,
		min: [3, "Username must be at least 3 characters"],
	},
});

userSchema.plugin(LocalPassportMongo);

module.exports = mongoose.model("User", userSchema);
