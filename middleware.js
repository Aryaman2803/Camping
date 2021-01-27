const { campgroundSchema, reviewSchema } = require("./schemas.js");
const ExpressError = require("./utils/ExpressError");
const Campground = require("./models/campground");

/**We are creating this new file so that we can use it in multiple locations.
 * Since after we are logged in we need to be able to acces the reviews too.
 * We are calling our middleware function isLoggedin.
 * req.user is added to our req object by passport which will automatically deserialize information of the session.
 *
 * Later we can store the url the User is requesting at which will help us to redirect it instead of some homepage.
 * And we do it by storing url in  Sessions so we have some persistance between different requrest(For statefullness).
 * Then we add this into Flash middleware(error,success one!)
 * Then we add it in the users.js Login authenticate Route
 */
module.exports.isLoggedIn = (req, res, next) => {
  // console.log("REQ.USER...", req.user);
  if (!req.isAuthenticated()) {
    //Helps us to return to original Url
    req.session.returnTo = req.originalUrl;
    req.flash("error", "You must be signed in first!");
    return res.redirect("/login");
  }
  //We use next to move to our next middleware
  next();
};

//JOI SCHEMA MIDDLEWARE for campground Schema
module.exports.validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  //First check for an error as we get back from campgroundSchema
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

//MIDDLEWARE for authorization of user
module.exports.isAuthor = async (req, res, next) => {
  //Instead of just finding and updating the campground , we check the camp Id and author Id
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground.author.equals(req.user._id)) {
    req.flash("error", "You do not have permission!");
    return res.redirect(`/campgrounds/${campground._id}`);
  }
  next();
};

//REVIEW SCHEMA

//JOI SCHEMA MIDDLEWARE for review schema
module.exports.validateReview = (req, res, next) => {
  //First check for an error as we get back from reviewSchema
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    // console.log(error)
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

// module.exports = validateCampground;
// module.exports = isAuthor;
// module.exports = isLoggedIn;
