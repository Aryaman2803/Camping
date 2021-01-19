const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const { campgroundSchema } = require("../schemas.js");
const ExpressError = require("../utils/ExpressError");
const Campground = require("../models/campground");

//This cleans up our index.js file

//JOI SCHEMA MIDDLEWARE for campground Schema
const validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  //First check for an error as we get back from campgroundSchema
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

//Here we add our Routes to router instead of app.get/post

//(2) Campground Index
router.get(
  "/",
  catchAsync(async (req, res) => {
    const campgrounds = await Campground.find();
    res.render("campgrounds/index", { campgrounds });
  })
);

// REMEMBER ORDER MATTERS THATS WHY WE PUT NEW CAMPGROUND ROUTE ABOVE ID ROUTE
//TO CREATE A FORM WE USUALLY NEED TWO ROUTES 1- THE ACTUAL FORM ITSELF AS GET 2- CREATE ROUTE AS POST
//(4) FORM GET ROUTE
router.get("/new", (req, res) => {
  res.render("campgrounds/new");
});
//NOW WE SET UP THE POST ROUTE FPR THE NEW FPRM
//(5) To parse the req.body we use express.urlencoded line above
router.post(
  "/",
  validateCampground,
  catchAsync(async (req, res, next) => {
    // if (!req.body.campground)
    // throw new ExpressError("Invalid Campground data", 400);
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

//(3) Details page for our Campground
router.get(
  "/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campgrounds = await Campground.findById(id).populate("reviews");
    res.render("campgrounds/show", { campgrounds });
  })
);

//(6) Edit camps. We AGAIN NEED TWO ROUTES 1- FOR FORM  2- for SUBMITTING THAT FORM
// (6.1) WE will use METHOD_OVERRIDE  to fake request..INSTALL IT IN NPM and then require it on top
router.get(
  "/:id/edit",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render("campgrounds/edit", { campground });
  })
);
//(6.2) Here we make a put route
router.put(
  "/:id",
  validateCampground,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {
      ...req.body.campground,
    });
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

//(7) DELETE ROUTE.. WE MAKE A FAKE FORM ACTION IN SHOW.EJS
router.delete(
  "/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect("/campgrounds");
  })
);

module.exports = router;
