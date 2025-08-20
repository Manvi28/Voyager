const express=require('express');
const router=express.Router({mergeParams: true});
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js")
const Listing=require("../models/listing.js");
const Review=require("../models/reviews.js");
const { listingSchema , reviewSchema}=require("../schema.js");


const validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
        const msg=error.details.map(el=>el.message).join(",");
        throw new ExpressError(msg,400);
    }else{
    next();
    }
};
router.post("/reviews",validateReview,wrapAsync(async(req,res)=>{
  let listing = await Listing.findById(req.params.id);
    let review = new Review(req.body.review);
    listing.review.push(review);
    await review.save();
    await listing.save();
   
    res.redirect(`/listings/${listing._id}`);
}));
router.delete("/:reviewId", wrapAsync(async (req, res) => {
   let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { review: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
}));

module.exports = router;