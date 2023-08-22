const Review = require("../models/Review");

const isYourComment = async (req, res, next) => {
	const { id, reviewID } = req.params;
	const review = await Review.findById(reviewID);

	if (!review.author.equals(req.user._id)) {
		req.flash("error", `This isn't your review`);
		return res.redirect(`/campgrounds/${id}`);
	}
	next();
};

module.exports = isYourComment;
