const express=require("express");
const app=express();
const mongoose=require("mongoose");
const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust"
const path=require("path");
const methodoverride=require("method-override");
const ejsMate=require("ejs-mate");
const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js")
const Listing=require("./models/listing.js");
const Review=require("./models/reviews.js");
const listingRoutes=require("./routes/listing.js");
const reviews=require("./routes/reviews.js");
const { listingSchema , reviewSchema}=require("./schema.js");
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodoverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

main().then(()=>{
    console.log("Connected to MongoDB");
}).catch((err)=>{
    console.error("Error connecting to MongoDB:", err);
});
async function main(){
    await mongoose.connect(MONGO_URL);
}
app.get("/",(req,res)=>{
    res.send("Hello I am root route");
})
app.use("/listings",listingRoutes);
app.use("/listings/:id",reviews);
// app.all("*", (req, res, next) => {
//     next(new ExpressError(404, "Page Not Found")); 
// });

app.use((err,req,res,next)=>{
    let {statusCode=500,message="something went wrong"}=err;
    res.status(statusCode).send(message);
})
app.listen(8080,()=>{
    console.log("Server is running on port 8080");
});