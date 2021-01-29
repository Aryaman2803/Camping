const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;

const CampgroundSchema = new Schema({
  title: String,
  images: [
    {
      url: String,
      filename: String,
    },
  ],
  price: Number,
  description: String,
  location: String,
  //Author will store the User Id. With ref as User Model
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

//Deteling the campground along with all its reviews POST MIDDLEWWARE
//Delete those ids which are in campground reviews field
//This is a mongoose query middleware that pass in the document
CampgroundSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Review.deleteMany({
      _id: {
        $in: doc.reviews,
      },
    });
  }
});
const Campground = mongoose.model("Campground", CampgroundSchema);
module.exports = Campground;
