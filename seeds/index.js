//This file is self contained
// It basically connects to mongoose and use the Campground Model

const Campground = require("../models/campground");
const mongoose = require("mongoose");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");

mongoose.connect("mongodb://localhost:27017/yelp-camp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error:"));
db.once("open", () => {
  console.log("Database Connected!");
});

// Making a function for random place and descriptors so it looks neet
//This helps to get random place or descriptors of an array in seedHelpers
const sample = (arr) => {
  return arr[Math.floor(Math.random() * arr.length)];
};

//(1)Start by removing everything in database
// BE CAREFUL WITH DELETEMANY( ) INSIDE THE FUNCTION
const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new Campground({
      author: "600fb761602c78340434ceb3", 
      title: `${sample(descriptors)} ${sample(places)}`,
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      image: "https://source.unsplash.com/collection/1114848",
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Deleniti at minus, vel consequatur ut impedit laborum accusamus odio omnis error, ullam nostrum fugiat provident! Unde, cum ipsam. Autem, recusandae libero.",
      price,
    });
    await camp.save();
  }
};
seedDB();
