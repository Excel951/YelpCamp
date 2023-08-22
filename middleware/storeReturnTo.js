const storeReturnTo = (req, res, next) => {
	console.log(req.session.returnTo);
	console.log(req.originalUrl);
	if (req.session.returnTo) res.locals.returnTo = req.session.returnTo;
	next();
};

module.exports = storeReturnTo;
