function wrapExpressErrorHandler(fn) {
	return function (req, res, next) {
		fn(req, res, next).catch((e) => {
			next(e);
		});
	};
}

module.exports = wrapExpressErrorHandler;

// module.exports = (fn) => {
// 	return function (err, req, res, next) {
// 		fn(err, req, res, next).catch((e) => next(e));
// 	};
// };
