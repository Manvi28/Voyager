const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js")
const Listing = require("../models/listing.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const { isLoggedIn, isOwner } = require("../middleware.js");

const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(",");
        throw new ExpressError(400, msg);
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
        newlisting.owner = req.user._id;
        await newlisting.save();
        req.flash("success", "Successfully created a new listing!");
        res.redirect("/listings");
    })
);
router.get("/:id", async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({path:"review",populate:{path:"author",},}).populate("owner");
    if (!listing) {
        req.flash("error", "Listing not found");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
})
router.get("/:id/edit",isLoggedIn, isOwner, async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    
    res.render("listings/edit.ejs", { listing });
})
router.put("/:id", isLoggedIn,isOwner, validateListing,wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Successfully updated a listing!");
    res.redirect(`/listings/${id}`);
}));
router.delete("/:id", isLoggedIn, isOwner,async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted a listing!");
    res.redirect("/listings");
})


module.exports = router;