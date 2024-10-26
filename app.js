require("dotenv").config();


const express = require("express") ;
const app = express();
const path= require("path")
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js")
const ExpressError = require("./utils/ExpressError.js");


const {listingSchema,reviewSchema} = require("./shema.js");


const listings = require("./routes/listing.js");

const reviews = require("./routes/review.js");

const userRouter = require("./routes/user.js");

const session = require("express-session");
const MongoStore = require('connect-mongo');


const cookie = require("express-session/session/cookie.js");
const flash = require("connect-flash");

const passport = require("passport");
const LocalStrategy = require("passport-local");
const User  = require("./models/user.js");


app.use(methodOverride("_method"));


let port =3000;

app.listen(port,()=>{
    console.log("app is listening")
});

app.set("views" , path.join(__dirname,"/views"));

app.set("view engine" , "ejs");


app.engine("ejs" ,ejsMate);

app.use(express.static(path.join(__dirname ,"public")));

app.use(express.urlencoded({extended :true}));


// const mongoUrl = "mongodb://127.0.0.1:27017/wander"

const dbUrl = process.env.ATLASDB_URL;

main()
  .then( ()=>{
    console.log("connected to db sucessfully")
  })
  .catch((err) =>{
    console.log(err);
  })
  


async function main() {
    await mongoose.connect(dbUrl);
    
}

const store =  MongoStore.create({
  mongoUrl :dbUrl,
  crypto :{
    secret:"mysupersecretcode",
  },
  touchAfter: 24 *3600,
});


store.on("error",()=>{
  console.log("error in mongo session store",err);
});

const sessionOptions = {
  store,
  secret :"mysupersecretcode",
  resave : false,
  saveUninitialized : true,
  cookie :{
    expires :Date.now() + 7 * 24 * 60 * 60 * 100,
    maxAge : 7 * 24 * 60* 60 * 100,
    httpOnly : true,
  },
};

// app.get("/",(req, res) =>{
//   res.send("root route");
// })

app.use(session(sessionOptions));
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));


passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser()); 

app.use((req,res,next) =>{
 res.locals.sucess = req.flash("sucess");
 res.locals.error = req.flash("error");
 res.locals.currUser = req.user;
 next();

});

// app.get("/demouser", async (req, res) =>{
//   let fakeauser  = new User({
//     email : "asdfgb@gmail.com",
//     username : "ram"
//   });

//   let registeredUser = await User.register(fakeauser , "123");
//   res.send(registeredUser);
// })


app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);
app.use("/",userRouter);



app.all("*" ,(req, res, next)=>{
  next( new ExpressError (404, "page not found"));
})

app.use((err,req,res,next) =>{
  let {statusCode = 500,message ="something went wrong"} = err;
 // res.send("something went wrong");
 //res.status(statusCode).send(message);
 res.status(statusCode).render("listings/error.ejs",{err});
});


