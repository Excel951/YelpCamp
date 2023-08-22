const Campground = require("../models/Campground");
const ExpressError = require("../utils/ExpressError");
const { cloudinary } = require("../cloudinary");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const MAPBOX_TOKEN = process.env.MAPBOX_TOKEN;
const geocodingServices = mbxGeocoding({ accessToken: MAPBOX_TOKEN });

module.exports.renderCampgrounds = async (req, res) => {
	const campgrounds = await Campground.find({}).populate('reviews');

	res.render("campgrounds/index", {
		title: "List of Campgrounds",
		campgrounds: campgrounds,
	});
};

module.exports.addNewCampground = async (req, res) => {
	// if (!req.body.campgrounds)
	// 	throw new ExpressError(400, "Invalid campgrounds");
	const { campgrounds } = req.body;

	const geoRes = await geocodingServices
		.forwardGeocode({
			query: campgrounds.location,
			limit: 1,
		})
		.send();

	console.log(campgrounds);
	const campground = new Campground(campgrounds);
	campground.geometry = geoRes.body.features[0].geometry;
	campground.image = req.files.map((o) => ({
		url: o.path,
		filename: o.filename,
	}));
	campground.author = req.user._id;
	await campground.save();
	console.log(campground);

	req.flash("success", "Successfully created a new campground!");

	res.redirect(`/campgrounds/${campground.id}`);
};

module.exports.renderNewForm = (req, res) => {
	res.render("campgrounds/new", { title: `Add New Campgrounds` });
};

module.exports.renderEditCampground = async (req, res, next) => {
	if (!req.params.id) throw new ExpressError(400, "Invalid campgrounds");

	const { id } = req.params;
	const campground = await Campground.findById(id);

	if (!campground) {
		// throw new ExpressError(500, "Campground not found");
		req.flash("error", `Campground doesn't exist!`);
		return res.redirect("/campgrounds");
	}

	res.render("campgrounds/edit", {
		title: `${campground.title}`,
		campground: campground,
	});
};

module.exports.deleteCampground = async (req, res, next) => {
	if (!req.params.id) throw new ExpressError(400, "Invalid campgrounds");

	const { id } = req.params;
	await Campground.findByIdAndDelete(id);

	req.flash("deleted", "Successfully delete a campground!");

	res.redirect("/campgrounds");
};

module.exports.updateCampground = async (req, res, next) => {
	if (!req.params.id || !req.body.campgrounds)
		throw new ExpressError(400, "Invalid campgrounds");

	const { id } = req.params;
	const { campgrounds, deleteImage } = req.body;

	// UPDATE CAMPGROUND
	const campground = await Campground.findByIdAndUpdate(id, campgrounds, {
		runValidators: true,
	});

	// TAMBAH IMAGE BARU
	if (req.files.length) {
		const images = req.files.map((f) => ({
			url: f.path,
			filename: f.filename,
		}));
		campground.image.push(...images);
		await campground.save();
	}

	// DELETE IMAGE
	if (deleteImage) {
		// for (const filename of deleteImage) {
		// 	await cloudinary.uploader.destroy(filename);
		// }
		await campground.updateOne({
			$pull: { image: { filename: { $in: deleteImage } } },
		});
	}

	req.flash("updated", "Successfully updated a campground!");

	res.redirect(`/campgrounds/${campground.id}`);
};

module.exports.renderACampground = async (req, res, next) => {
	const { id } = req.params;
	const campground = await Campground.findById(id)
		.populate("author")
		.populate({ path: "reviews", populate: { path: "author" } });

	// if (!campground) throw new ExpressError(400, "Invalid Campgrounds Data");
	if (!campground) {
		req.flash("error", "Cannot find campground!");
		res.redirect("/campgrounds");
	}

	// console.log(campground);

	res.render("campgrounds/show", {
		title: `${campground.title} Details`,
		campground: campground,
	});
};
