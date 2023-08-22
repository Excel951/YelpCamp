const express = require("express");
const routes = express.Router();
const passport = require("passport");
const wrapExpressErrorHandler = require("../utils/wrapExpressErrorHandler");
const isLogin = require("../middleware/isLogin");
const storeReturnTo = require("../middleware/storeReturnTo");

const Controller = require("../controllers/users");

routes.post("/logout", isLogin, Controller.logOut);

routes
	.route("/login")
	.post(
		// use the storeReturnTo middleware to save the returnTo value from session to res.locals
		storeReturnTo,
		passport.authenticate("local", {
			failureFlash: true,
			failureRedirect: "/login",
		}),
		wrapExpressErrorHandler(Controller.logInProcess)
	)
	.get(Controller.renderLogin);

routes
	.route("/register")
	.post(wrapExpressErrorHandler(Controller.registerProcess))
	.get(Controller.renderRegister);

module.exports = routes;
