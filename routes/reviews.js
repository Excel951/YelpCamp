const express = require("express"),
	// CARA UNTUK MENYATUKAN PARAMETER DENGAN PARAMETER SEBELUMNYA (PARENT)
	router = express.Router({ mergeParams: true });

// VALIDATOR
const validateReviews = require("../middleware/reviewValidator"),
	wrapExpressErrorHandler = require("../utils/wrapExpressErrorHandler"),
	isLogin = require("../middleware/isLogin"),
	isYourReview = require("../middleware/isYourReview");

// CONTROLLER
const Controller = require("../controllers/reviews");

router.post(
	"/",
	isLogin,
	validateReviews,
	wrapExpressErrorHandler(Controller.postReview)
);

router.delete(
	"/:reviewID",
	isLogin,
	isYourReview,
	wrapExpressErrorHandler(Controller.deleteReview)
);

module.exports = router;
