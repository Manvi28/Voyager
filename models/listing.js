const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./reviews.js");
const User = require("./user.js");
const listingSchema = new Schema({
    title: {
        type: String,
        required: true
    },

    description: String,
    price: Number,
    location: String,
    image: {
    filename: String,
    url: {
      type: String,
      default:
        "https://plus.unsplash.com/premium_photo-1721807786307-f95e885c607e?q=80&w=1154&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  },


    country: String,
    review: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    geometry:{
        type:{
            type:String,
            enum:['Point'],
            required:false
        },
        coordinates:{
            type:[Number],
            required:false
        }
    }

});
listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({
            _id: {
                $in: listing.review
            }
        });
    }
});
const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;