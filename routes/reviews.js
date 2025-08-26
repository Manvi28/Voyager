const express=require('express');
const router=express.Router({mergeParams: true});
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js")
const Listing=require("../models/listing.js");
const Review=require("../models/reviews.js");
const { listingSchema , reviewSchema}=require("../schema.js");
const {isLoggedIn,isOwner,isReviewAuthor}=require("../middleware.js");
const reviewController=require("../controllers/review.js");
const validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
        const msg=error.details.map(el=>el.message).join(",");
        throw new ExpressError(msg,400);
    }else{
    next();
    }
};
router.post("/reviews",validateReview,isLoggedIn,wrapAsync(reviewController.createReview));

router.delete("/reviews/:reviewId",isLoggedIn, isReviewAuthor,wrapAsync(reviewController.deleteReview));

module.exports = router;