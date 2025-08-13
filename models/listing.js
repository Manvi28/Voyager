const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const listingSchema = new Schema({
    title: {
        type: String,
        required: true
    },

    description: String,
    price: Number,
    location: String,
    image: {
        type: String,
        default: "https://images.unsplash.com/photo-1682685797207-3a7b5b9f3b6e?auto=format&fit=crop&w=800&q=60",
        set: (v) => {
            return v === ""
                ? "https://images.unsplash.com/photo-1682685797207-3a7b5b9f3b6e?auto=format&fit=crop&w=800&q=60"
                : v;
        }
    },

    country: String,
    review:[
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ]
});
const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;