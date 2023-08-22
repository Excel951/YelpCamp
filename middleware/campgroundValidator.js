const Joi = require("../utils/JoiWithSanitizeHTML");
const ExpressError = require("../utils/ExpressError");

function validateCampgrounds(req, res, next) {
	const campgroundSchema = Joi.object({
		campgrounds: Joi.object({
			title: Joi.string().required().escapeHTML(),
			location: Joi.string().required().escapeHTML(),
			price: Joi.number().required().min(0),
			// image: Joi.array({
			// 	url: Joi.string().required(),
			// 	filename: Joi.string().required(),
			// }),
			description: Joi.string().required().escapeHTML(),
		}).required(),
		deleteImage: Joi.array(),
	});

	const validateResult = campgroundSchema.validate(req.body);
	if (validateResult.error)
		throw new ExpressError(
			400,
			`Invalid input: ${validateResult.error.message}`
		);
	next();
}

module.exports = validateCampgrounds;
