const Campground = require("../models/Campground");
const Review = require("../models/Review");

module.exports.postReview = async (req, res, next) => {
	const { id } = req.params;

	const review = new Review(req.body.review);
	review.author = req.user._id;

	const campground = await Campground.findById(id);
	campground.reviews.push(review);

	await review.save();
	await campground.save();

	req.flash("success", "New review has been created!");

	res.redirect(`/campgrounds/${id}`);
};

module.exports.deleteReview = async (req, res, next) => {
	await Campground.findByIdAndUpdate(req.params.id, {
		$pull: { reviews: req.params.reviewID },
	});

	await Review.findByIdAndDelete(req.params.reviewID);

	req.flash("deleted", "Review has been deleted!");

	res.redirect(`/campgrounds/${req.params.id}`);
};
