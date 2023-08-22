const mongoose = require("mongoose");
const Review = require("./Review");
const Schema = mongoose.Schema;

const CampgroundSchema = new Schema(
	{
		title: String,
		image: [
			{
				url: String,
				filename: String,
			},
		],
		price: {
			type: Number,
			min: [0, "Number must be greater than 0"],
		},
		description: String,
		geometry: {
			type: {
				type: String,
				enum: ["Point"],
				required: true,
			},
			coordinates: {
				type: [Number],
				required: true,
			},
		},
		location: String,
		reviews: [{ type: Schema.ObjectId, ref: "Review" }],
		author: {
			type: Schema.ObjectId,
			ref: "User",
		},
	},
	{ toJSON: { virtuals: true } }
);

CampgroundSchema.virtual("properties.title").get(function () {
	return `${this.title}`;
});

CampgroundSchema.virtual("properties.location").get(function () {
	return `${this.location}`;
});

CampgroundSchema.virtual("properties.url").get(function () {
	return `/campgrounds/${this.id}`;
});

CampgroundSchema.virtual("properties.avgRating").get(function () {
	let ratings = [];
	this.reviews.forEach((a) => ratings.push(a.rating));
	return ratings.reduce((a, b) => a + b, 0) / ratings.length;
});

CampgroundSchema.post("findOneAndDelete", async (doc) => {
	if (doc) {
		await Review.deleteMany({ _id: { $in: doc.reviews } });
		console.log(doc);
	}
});

module.exports = mongoose.model("Campground", CampgroundSchema);
