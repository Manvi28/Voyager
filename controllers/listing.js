const Listing = require("../models/listing");
module.exports.index=async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });

}

module.exports.renderNewForm= (req, res) => {
    res.render("listings/new.ejs");
}

module.exports.showListing= async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({path:"review",populate:{path:"author",},}).populate("owner");
    if (!listing) {
        req.flash("error", "Listing not found");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
}

module.exports.renderEditForm= async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    
    res.render("listings/edit.ejs", { listing });
}

module.exports.createListing= async (req, res, next) => {
        const newlisting = new Listing(req.body.listing);
        newlisting.owner = req.user._id;
        await newlisting.save();
        req.flash("success", "Successfully created a new listing!");
        res.redirect("/listings");
    }

module.exports.updateListing= async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Successfully updated a listing!");
    res.redirect(`/listings/${id}`);
}

module.exports.deleteListing= async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted a listing!");
    res.redirect("/listings");
}