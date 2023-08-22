const ExpressError = require("../utils/ExpressError");
const User = require("../models/Users");

module.exports.logOut = (req, res) => {
	req.logout(function (err) {
		if (err) throw new ExpressError(500, err);
		req.flash("error", "Goodbye! Your account is already logged out..");
		res.redirect("/");
	});
};

module.exports.logInProcess = async (req, res) => {
	// const { auth } = req.body;
	// res.send(auth);
	req.flash("success", `Hello ${req.user.username}! Welcome Back to YelpCamp!`);
	const redirectUrl = res.locals.returnTo || "/campgrounds";
	res.redirect(redirectUrl);
};

module.exports.registerProcess = async (req, res) => {
	try {
		const { auth } = req.body;
		const { password } = req.body;
		const u = new User(auth);
		const newUser = await User.register(u, password);
		req.login(newUser, function (err) {
			if (err) return next(err);

			req.flash("success", `Welcome to the YelpCamp, ${newUser.username}!`);
			res.redirect("/campgrounds");
		});
	} catch (err) {
		req.flash("error", err.message);
		res.redirect("/register");
	}
};

module.exports.renderLogin = (req, res) => {
	res.render("auth/login", { title: "Welcome!" });
};

module.exports.renderRegister = (req, res) => {
	res.render("auth/register", { title: "Register Account" });
};
