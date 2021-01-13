const express = require("express");
const app = express();
const path = require("path");
const port = 3000;
const Campground = require("./models/campground");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const catchAsync = require("./utils/catchAsync");

const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/yelp-camp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error:"));
db.once("open", () => {
  console.log("Database Connected!");
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
//(8) For template we Add EJS-MATE
app.engine("ejs", ejsMate);

//(1) Home
app.get("/", (req, res) => {
  res.render("home");
});
//(2) Campground Index
app.get("/campgrounds", catchAsync(async (req, res) => {
  const campgrounds = await Campground.find();
  res.render("campgrounds/index", { campgrounds });
}));

// REMEMBER ORDER MATTERS THATS WHY WE PUT NEW CAMPGROUND ROUTE ABOVE ID ROUTE
//TO CREATE A FORM WE USUALLY NEED TWO ROUTES 1- THE ACTUAL FORM ITSELF AS GET 2- CREATE ROUTE AS POST
//(4) FORM GET ROUTE
app.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/new");
});
//NOW WE SET UP THE POST ROUTE FPR THE NEW FPRM
//(5) To parse the req.body we use express.urlencoded line above
app.post(
  "/campgrounds",
  catchAsync(async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

//(3) Details page for our Campground
app.get("/campgrounds/:id", catchAsync(async (req, res) => {
  const { id } = req.params;
  const campgrounds = await Campground.findById(id);
  res.render("campgrounds/show", { campgrounds });
}));

//(6) Edit camps. We AGAIN NEED TWO ROUTES 1- FOR FORM  2- for SUBMITTING THAT FORM
// (6.1) WE will use METHOD_OVERRIDE  to fake request..INSTALL IT IN NPM and then require it on top
app.get("/campgrounds/:id/edit", catchAsync(async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  res.render("campgrounds/edit", { campground });
}));
//(6.2) Here we make a put route
app.put("/campgrounds/:id", catchAsync(async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findByIdAndUpdate(id, {
    ...req.body.campground,
  });
  res.redirect(`/campgrounds/${campground._id}`);
}));

//(7) DELETE ROUTE.. WE MAKE A FAKE FORM ACTION IN SHOW.EJS
app.delete("/campgrounds/:id", catchAsync(async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  res.redirect("/campgrounds");
}));

//(8) We have started Handling Errors
//(8.1) We wrap Async functions in try catch blocks
app.use((err, req, res, next) => {
  res.send("OHH BOY SOMETHING WENT WRONG");
});
app.listen(port, () => {
  console.log("CONNECTED TO PORT: " + port);
});
