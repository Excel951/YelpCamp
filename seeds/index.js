const mongoose = require("mongoose");
const Campground = require("../models/Campground");
const cities = require("./cities");
const { descriptors, places } = require("./seedHelpers");

const dbUrl = process.env.DB_URL;

mongoose
	.connect("mongodb://127.0.0.1:27017/yelpCamp")
	.then(() => {
		console.log("Database Connected");
	})
	.catch((err) => {
		console.log(err);
	});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
	await Campground.deleteMany({});
	const imgs = [
		{
			url: "https://res.cloudinary.com/dbhxki1oc/image/upload/v1691766474/YelpCamp/qi3vnqlnecsqhpevgjtj.jpg",
			filename: "YelpCamp/qi3vnqlnecsqhpevgjtj",
		},
		{
			url: "https://res.cloudinary.com/dbhxki1oc/image/upload/v1691766477/YelpCamp/h8yj0moje8vzrby9fciq.jpg",
			filename: "YelpCamp/h8yj0moje8vzrby9fciq",
		},
		{
			url: "https://res.cloudinary.com/dbhxki1oc/image/upload/v1691766479/YelpCamp/nq98jtyfepim55ghugom.jpg",
			filename: "YelpCamp/nq98jtyfepim55ghugom",
		},
	];
	for (let i = 0; i < 50; i++) {
		const random1000 = Math.floor(Math.random() * 1000);
		const price = Math.floor(Math.random() * 30) + 10;
		let imgLength = Math.floor(Math.random() * 3) + 1;
		const imgCollection = [];
		const lastImg = [];
		if (imgLength == 3) {
			imgCollection.push(...imgs);
		}
		while (imgLength != 0 && imgLength != 3) {
			const randomNum = Math.floor(Math.random() * 3);
			if (!lastImg.includes(randomNum)) {
				imgCollection.push(imgs[randomNum]);
				lastImg.push(randomNum);
				imgLength--;
			}
		}
		await new Campground({
			author: "64d4ae2befc1c7eca2ff29d2",
			title: `${sample(descriptors)} ${sample(places)}`,
			location: `${cities[random1000].city}, ${cities[random1000].state}`,
			description: `Lorem ipsum dolor sit amet consectetur, adipisicing elit. Accusamus soluta dignissimos repudiandae quaerat, aut exercitationem pariatur doloribus iure excepturi, dicta, obcaecati delectus eveniet? Aspernatur, consequuntur corrupti! Libero possimus inventore natus.
			Quae quaerat fugit explicabo, ipsum voluptas ex odit porro omnis iure. Qui, eaque, aliquam consequuntur impedit ipsam consectetur quisquam architecto nam odit laudantium praesentium repellat, laboriosam sed. Molestias, saepe optio.`,
			price: price,
			geometry: {
				type: "Point",
				coordinates: [
					cities[random1000].longitude,
					cities[random1000].latitude,
				],
			},
			image: imgCollection,
		}).save();
	}
};

seedDB();
