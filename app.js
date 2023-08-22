// GET API FOR CLOUDINARY
// if (process.env.NODE_ENV !== "production") {
// }
require("dotenv").config();

// DEPENDENCY
// =================================================================
const express = require("express"),
	path = require("path"),
	mongoose = require("mongoose"),
	methodOverride = require("method-override"),
	ejsMate = require("ejs-mate"),
	morgan = require("morgan"),
	session = require("express-session"),
	flash = require("connect-flash"),
	passport = require("passport"),
	LocalStrategy = require("passport-local"),
	mongoSanitizer = require("express-mongo-sanitize"),
	helmet = require("helmet"),
	MongoStore = require("connect-mongo");
// =================================================================

// MODELS
// =================================================================
const Campground = require("./models/Campground"),
	User = require("./models/Users"),
	Review = require("./models/Review");
// =================================================================

// MIDDLEWARE
// =================================================================
const validateCampgrounds = require("./middleware/campgroundValidator"),
	validateReviews = require("./middleware/reviewValidator");
// =================================================================

// UTILITIES
// =================================================================
const wrapExpressErrorHandler = require("./utils/wrapExpressErrorHandler"),
	ExpressError = require("./utils/ExpressError");
// =================================================================

const app = express();

const port = process.env.PORT || 3000;

// PREPARE DB
// =================================================================
const dbUrl = process.env.DB_URL;
// "mongodb://127.0.0.1:27017/yelpCamp"
mongoose
	.connect(dbUrl)
	.then(() => {
		console.log("Database opened");

		app.listen(port, () => {
			console.log(`listening on port ${port}`);
		});
	})
	.catch((err) => {
		console.log(`Connection error on open: ${err}`);
	});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error while running:"));
db.once("open", () => {
	console.log("Database connected");
});
// =================================================================

// SETTING EXPRESS-SESSION
// =================================================================
const secret = process.env.SECRET || "thisisnotasecuresecret";
const sessionOptions = {
	secret,
	resave: false,
	saveUninitialized: false,
	store: MongoStore.create({
		mongoUrl: dbUrl,
		touchAfter: 24 * 3600,
		crypto: { secret },
	}),
	cookie: {
		httpOnly: true,
		maxAge: 1000 * 60 * 60 * 8,
	},
};
app.use(session(sessionOptions));
// =================================================================

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "public")));
app.use(flash());
app.use(mongoSanitizer({ replaceWith: "_" }));

const scriptSrcUrls = [
	"https://stackpath.bootstrapcdn.com/",
	"https://api.tiles.mapbox.com/",
	"https://api.mapbox.com",
	"https://kit.fontawesome.com/",
	"https://cdnjs.cloudflare.com/",
	"https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
	"https://kit-free.fontawesome.com/",
	"https://stackpath.bootstrapcdn.com/",
	"https://api.mapbox.com/",
	"https://api.tiles.mapbox.com/",
	"https://fonts.googleapis.com/",
	"https://use.fontawesome.com/",
	"https://cdn.jsdelivr.net",
	"https://cdnjs.cloudflare.com/",
];
const connectSrcUrls = [
	"https://api.mapbox.com/",
	"https://a.tiles.mapbox.com/",
	"https://b.tiles.mapbox.com/",
	"https://events.mapbox.com/",
];
const fontSrcUrls = ["https://cdnjs.cloudflare.com/"];
app.use(
	helmet({
		contentSecurityPolicy: {
			directives: {
				defaultSrc: "",
				connectSrc: ["'self'", ...connectSrcUrls],
				scriptSrc: ["'self'", "'unsafe-inline'", ...scriptSrcUrls],
				styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
				workerSrc: ["'self'", "blob:"],
				objectSrc: [],
				imgSrc: [
					"'self'",
					"blob:",
					"data:",
					"https://res.cloudinary.com/dbhxki1oc/",
					"https://images.unsplash.com/",
				],
				fontSrc: ["'self'", ...fontSrcUrls],
			},
		},
	})
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

// BERFUNGSI UNTUK MENYIMPAN DATA USER PADA SESSION
passport.serializeUser(User.serializeUser());

// BERFUNGSI UNTUK MENGHAPUS DATA USER PADA SESSION
passport.deserializeUser(User.deserializeUser());

// FLASH
// =================================================================
app.use((req, res, next) => {
	res.locals.success = req.flash("success");
	res.locals.updated = req.flash("updated");
	res.locals.deleted = req.flash("deleted");
	res.locals.error = req.flash("error");
	console.log(req.query);

	res.locals.currentUser = req.user;
	next();
});
// =================================================================

// ROUTES
// =================================================================
const campgroundRoutes = require("./routes/campgrounds");
const reviewRoutes = require("./routes/reviews");
const authRoutes = require("./routes/auth");

app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/reviews", reviewRoutes);
app.use("/", authRoutes);
// =================================================================

app.get("/", (req, res) => {
	res.render("home", { title: "Home of YelpCamp" });
});

app.all("*", (req, res, next) => {
	next(new ExpressError(404, "Page not found!"));
});

app.use((err, req, res, next) => {
	const { status = 500, message = "Something went wrong!" } = err;
	res.status(status).render("partials/error-alert", {
		error: { status, message },
		title: "Oops! Something went wrong!",
	});
});
