const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utils/catchAsync");
const Review = require("../models/review");
const Campground = require("../models/campground");
const { validateReview, isLoggedIn } = require("../middleware");

//Creating Review section
/* We don't need a CRUD but we will follow - POST / campgrounds/:id/review,
So we associate the reviews with the specific campground using its ID
 */
router.post(
  "/",
  validateReview,
  isLoggedIn,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash("success", "Created new review");
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
    req.flash("success", "Successfully deleted review");
    res.redirect(`/campgrounds/${id}`);
  })
);

module.exports = router;
