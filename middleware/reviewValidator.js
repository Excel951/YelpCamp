const Joi = require("../utils/JoiWithSanitizeHTML"),
	ExpressError = require("../utils/ExpressError");

function validateReviews(req, res, next) {
	const reviewSchema = Joi.object({
		review: Joi.object({
			body: Joi.string().required().escapeHTML(),
			rating: Joi.number().required().min(1).max(5),
		}).required(),
	});

	const validateResult = reviewSchema.validate(req.body);
	if (validateResult.error)
		throw new ExpressError(
			400,
			`Invalid input in review: ${validateResult.error.message}`
		);
	next();
}

module.exports = validateReviews;
