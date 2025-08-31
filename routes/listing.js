const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js")
const Listing = require("../models/listing.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const { isLoggedIn, isOwner } = require("../middleware.js");
const listingController = require('../controllers/listing.js');
const multer = require('multer');
const { storage } = require('../cloudConfig.js');
const upload = multer({ storage });

const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(",");
        throw new ExpressError(400, msg);
    } else {
        next();
    }
};
router.get("/",wrapAsync(listingController.index));

router.get("/new",isLoggedIn, listingController.renderNewForm);

router.post("/",isLoggedIn,  validateListing,upload.single("listing[image]"), wrapAsync(listingController.createListing));

router.get("/:id", wrapAsync(listingController.showListing)); 

router.get("/:id/edit",isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm)); 

router.put("/:id", isLoggedIn,isOwner, validateListing,wrapAsync(listingController.updateListing));

router.delete("/:id", isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));


module.exports = router;