const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const Campground = require("../models/campground");
const { isLoggedIn, isAuthor, validateCampground } = require("../middleware");

//This cleans up our index.js file

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
router.get("/new", isLoggedIn, (req, res) => {
  res.render("campgrounds/new");
});

//NOW WE SET UP THE POST ROUTE FPR THE NEW FPRM
//(5) To parse the req.body we use express.urlencoded line above
//(11.2) Here we are using flash messege by Key : Value pair
//(11.3) Then we make sure we are displaying that information in our Template=> So we set it in index.js
router.post(
  "/",
  isLoggedIn,
  validateCampground,
  catchAsync(async (req, res, next) => {
    // if (!req.body.campground)
    // throw new ExpressError("Invalid Campground data", 400);
    const campground = new Campground(req.body.campground);
    // req.user is given by passport
    //Later we add author which stores the Id of User
    campground.author = req.user._id;
    await campground.save();
    req.flash("success", "Successfully made a new campground!");
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

//(3) Details page for our Campground
router.get(
  "/:id",

  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campgrounds = await Campground.findById(id)
      .populate("reviews")
      .populate("author");
    // console.log(campgrounds);
    if (!campgrounds) {
      req.flash("error", "Cannot find that campground");
      return res.redirect("/campgrounds");
    }
    res.render("campgrounds/show", { campgrounds });
  })
);

//(6) Edit camps. We AGAIN NEED TWO ROUTES 1- FOR FORM  2- for SUBMITTING THAT FORM
// (6.1) WE will use METHOD_OVERRIDE  to fake request..INSTALL IT IN NPM and then require it on top
router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);

    if (!campground) {
      req.flash("error", "Cannot find that campground");
      return res.redirect("/campgrounds");
    }

    res.render("campgrounds/edit", { campground });
  })
);
//(6.2) Here we make a put route for edit camp
//Later we check if the author can update that campground we found.(We can use POstman to bypass thats why)
router.put(
  "/:id",
  isLoggedIn,
  isAuthor,
  validateCampground,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {
      ...req.body.campground,
    });
    req.flash("success", "Successfully updated campground!");
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

//(7) DELETE ROUTE.. WE MAKE A FAKE FORM ACTION IN SHOW.EJS
router.delete(
  "/:id",
  isLoggedIn,
  isAuthor,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted review");
    res.redirect("/campgrounds");
  })
);

module.exports = router;
