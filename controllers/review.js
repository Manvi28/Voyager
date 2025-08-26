const Review = require("../models/reviews.js");
const Listing = require("../models/listing.js");

module.exports.createReview= async(req,res)=>{
  let listing = await Listing.findById(req.params.id);
    let review = new Review(req.body.review);
    review.author=req.user._id;
    listing.review.push(review);
    await review.save();
    await listing.save();
    req.flash("success", "Successfully added a new review!");
    res.redirect(`/listings/${listing._id}`);
}

module.exports.deleteReview= async (req, res) => {
   let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { review: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Successfully deleted a review!");
    res.redirect(`/listings/${id}`);
}