const express = require("express");
const router = express.Router();
const campgrounds = require("../controllers/campgrounds");
const catchAsync = require("../utils/catchAsync");
const Campground = require("../models/campground");
const { isLoggedIn, isAuthor, validateCampground } = require("../middleware");
const multer = require("multer");
const { storage } = require("../cloudinary/index");
const upload = multer({ storage });

/**
 * *After moving the Route detials in controllers directory, we Restructure Routes even further
 * *We route under single path. And we dont specify the same path , just the middleware.
 **/
router
  .route("/")
  .get(catchAsync(campgrounds.index))
  .post(
    isLoggedIn,
    upload.array("image"),
    validateCampground,
    catchAsync(campgrounds.createCampground)
  );

// !Moved above '/:id'
router.get("/new", isLoggedIn, campgrounds.renderNewForm);

router
  .route("/:id")
  .get(catchAsync(campgrounds.showCampground))
  .put(
    isLoggedIn,
    isAuthor,
    upload.array("image"),
    validateCampground,
    catchAsync(campgrounds.updateCampground)
  )
  .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.delete));

//This cleans up our index.js file

//Here we add our Routes to router instead of app.get/post

//(2) Campground Index

//Later we create a sort of MVC to make the file refractored
// we move the rout to campground.js file in controller form where we simply import it here
//We have campgrounds object that represent the campground controller which has methods on it
// ? We have grouped it above in Route.
// ?router.get("/", catchAsync(campgrounds.index));

// REMEMBER ORDER MATTERS THATS WHY WE PUT NEW CAMPGROUND ROUTE ABOVE ID ROUTE
//TO CREATE A FORM WE USUALLY NEED TWO ROUTES 1- THE ACTUAL FORM ITSELF AS GET 2- CREATE ROUTE AS POST
//(4) FORM GET ROUTE

//Route is moved in Controller->campground.js and we import renderNewFrom
// ! We have NOT grouped it above in Route because they are standalone.
// ! BUT IT IS MOVED AT ABOVE '/:id' BECAUSE this '/new' Route thinks its an '/:id'. SO WE MOVE IT ABOVE
// ?router.get("/new", isLoggedIn, campgrounds.renderNewForm);

//NOW WE SET UP THE POST ROUTE FPR THE NEW FPRM
//(5) To parse the req.body we use express.urlencoded line above
//(11.2) Here we are using flash messege by Key : Value pair
//(11.3) Then we make sure we are displaying that information in our Template=> So we set it in index.js

//Later we move Route in Controller->campground.js and we import renderNewFrom
// ? We have grouped it above in Route.
// ?router.post("/",isLoggedIn,validateCampground,catchAsync(campgrounds.createCampground));

//(3) Details page for our Campground
//Later we move Route in Controller->campground.js and we import renderNewFrom
// ? We have grouped it above in Route.
//? router.get("/:id", catchAsync(campgrounds.showCampground));

//(6) Edit camps. We AGAIN NEED TWO ROUTES 1- FOR FORM  2- for SUBMITTING THAT FORM
// (6.1) WE will use METHOD_OVERRIDE  to fake request..INSTALL IT IN NPM and then require it on top
//Later we move Route in Controller->campground.js and we import renderNewFrom

// ! We have NOT grouped it above in Route because they are standalone.

router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(campgrounds.renderEditForm)
);

//(6.2) Here we make a put route for edit camp
//Later we check if the author can update that campground we found.(We can use POstman to bypass thats why)
// ? We have grouped it above in Route.
// ? router.put("/:id",isLoggedIn,isAuthor,validateCampground,catchAsync(campgrounds.updateCampground));

//(7) DELETE ROUTE.. WE MAKE A FAKE FORM ACTION IN SHOW.EJS
// ? We have grouped it above in Route.
// ? router.delete("/:id", isLoggedIn, isAuthor, catchAsync(campgrounds.delete));

module.exports = router;
