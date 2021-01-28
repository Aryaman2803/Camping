const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utils/catchAsync");
const Review = require("../models/review");
const Campground = require("../models/campground");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware");
const reviews = require("../controllers/reviews");

//Creating Review section
/* We don't need a CRUD but we will follow - POST / campgrounds/:id/review,
So we associate the reviews with the specific campground using its ID
 */

// Later we move our Route details in controllers->reviews.js for MVC structure,
// which makes this file cleaner

router.post("/", validateReview, isLoggedIn, catchAsync(reviews.createReview));

//Deleting reviews
/*We are doing like this so we can remove that reference whatever the review is in the campground 
  and we want to remove the review itself.
  A) Deleting from a review Review DB is easy just findByIdAndDelete.
  B) We also need to delete the reference Id of that review in the campground in a array of object ids */

// later we move Route details in controllers->reviews.js for MVC structure
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  catchAsync(reviews.deleteReview)
);

module.exports = router;
