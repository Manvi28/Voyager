const express=require("express");
const app=express();
const session = require("express-session");

app.use(session({secret:"mysupersecretstring", resave:false, saveUninitialized:true}));

app.get("/register",(req,res)=>{
    let {name="manvi"}= req.query;
    req.session.name=name;
    res.redirect("/hello");
})
app.get("/hello",(req,res)=>{
    res.send(`Hello ${req.session.name}`);
})
// app.get("/reqcount",(req,res)=>{
//     if(req.session.count){
//         req.session.count++;
//     }else{
//         req.session.count=1;
//     }
//     res.send(`you sent request ${req.session.count} times`);
// })

app.listen(3000,()=>{
    console.log("Server is running on port 3000");
});