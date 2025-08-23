const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js")
const Listing = require("../models/listing.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const { isLoggedIn } = require("../middleware.js");

const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(",");
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};
router.get("/", async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });

})
router.get("/new",isLoggedIn, (req, res) => {
    
    res.render("listings/new.ejs");
})
router.post("/",isLoggedIn,  validateListing,
    wrapAsync(async (req, res, next) => {
        const newlisting = new Listing(req.body.listing);
        await newlisting.save();
        req.flash("success", "Successfully created a new listing!");
        res.redirect("/listings");
    })
);
router.get("/:id", async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("review");
    if (!listing) {
        req.flash("error", "Listing not found");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
})
router.get("/:id/edit",isLoggedIn,  async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    req.flash("success", "Successfully updated a listing!");
    res.render("listings/edit.ejs", { listing });
})
router.put("/:id", isLoggedIn, async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
})
router.delete("/:id", isLoggedIn, async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted a listing!");
    res.redirect("/listings");
})
router.get("/logout",(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","Successfully logged out!");
        res.redirect("/listings");
    })
})

module.exports = router;