const express = require("express"),
	router = express.Router(),
	multer = require("multer"),
	{ storage } = require("../cloudinary"),
	upload = multer({ storage });

// VALIDATOR AND ERROR HANDLER
const validateCampgrounds = require("../middleware/campgroundValidator"),
	wrapExpressErrorHandler = require("../utils/wrapExpressErrorHandler"),
	isLogin = require("../middleware/isLogin"),
	areYouAuthor = require("../middleware/areYouAuthor");

// CONTROLLER
const Controller = require("../controllers/campgrounds");

router
	.route("/")
	.get(wrapExpressErrorHandler(Controller.renderCampgrounds))
	.post(
		isLogin,
		upload.array("campgrounds[image]"),
		validateCampgrounds,
		wrapExpressErrorHandler(Controller.addNewCampground)
	);

router.get("/new", isLogin, Controller.renderNewForm);

router.get(
	"/:id/edit",
	isLogin,
	areYouAuthor,
	wrapExpressErrorHandler(Controller.renderEditCampground)
);

router
	.route("/:id")
	.delete(
		isLogin,
		areYouAuthor,
		wrapExpressErrorHandler(Controller.deleteCampground)
	)
	.put(
		isLogin,
		areYouAuthor,
		upload.array("campgrounds[image]"),
		validateCampgrounds,
		wrapExpressErrorHandler(Controller.updateCampground)
	)
	.get(wrapExpressErrorHandler(Controller.renderACampground));

module.exports = router;
