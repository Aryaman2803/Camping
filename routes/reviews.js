const express = require("express");
const router = express.Router({ mergeParams: true });

const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");

const Review = require("../models/review");
const Campground = require("../models/campground");
const { reviewSchema } = require("../schemas.js");

//JOI SCHEMA MIDDLEWARE for review schema
const validateReview = (req, res, next) => {
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

//Creating Review section
/* We don't need a CRUD but we will follow - POST / campgrounds/:id/review,
So we associate the reviews with the specific campground using its ID
 */
router.post(
  "/",
  validateReview,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
  })
);
//Deleting reviews
/*We are doing like this so we can remove that reference whatever the review is in the campground 
  and we want to remove the review itself.
  A) Deleting from a review Review DB is easy just findByIdAndDelete.
  B) We also need to delete the reference Id of that review in the campground in a array of object ids */
router.delete(
  "/:reviewId",
  catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(
      id,
      { $pull: { reviews: reviewId } },
      { useFindAndModify: false }
    );
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${id}`);
  })
);

module.exports = router;
