const Campground = require("../models/Campground");

const areYouAuthor = async (req, res, next) => {
	const campground = await Campground.findById(req.params.id)
		.populate("author")
		.populate("reviews");
	if (!campground) return next();
	if (!req.user._id.equals(campground.author._id)) {
		req.flash("error", `You haven't permission to update this campground`);
		return res.redirect(`/campgrounds/${campground._id}`);
	}
	next();
};

module.exports = areYouAuthor;
