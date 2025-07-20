if(process.env.NODE_ENV != "production") {
    require('dotenv').config()
}

const express = require("express");   
const app = express();
const mongoose = require("mongoose");
const Listing = require("./model/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
// one.....
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./model/user.js"); 
const {saveRedirectUrl,} = require("./middleware.js");
// two.....
const userController = require("./controllers/users.js");

const listings = require("./routers/listing.js");
const reviews = require("./routers/review.js");

// three....

const dbUrl = process.env.ATLASDB_URL;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600
})

store.on("error", () => {
    console.log("ERROR in MONGO SESSION STORE", err);
})

const sessionOption = {
       store,
       secret: process.env.SECRET,
       resave: false,
       saveUninitialized: true,
       cookie: {
           expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
           maxAge: 7 * 24 * 60 * 60 * 1000,
           httpOnly: true,
       },
    };

main()
.then(() => {
    console.log("connection on db");
})
.catch((err) => {
    console.log(err);
})

async function main() {
    await mongoose.connect(dbUrl);
}

// four....

app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate())); 
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser()); 

app.use((req,res, next) => {
    res.locals.message = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})

app.post("/listings/search", async (req,res) => {
     let {country} = req.body;
     const allcountry = await Listing.findOne({country : country});
     console.log(allcountry);
     if(!allcountry) {
          res.redirect("/listings");
     } else {
        res.redirect(`/listings/${allcountry._id}`);
     }
})

// five....

app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews );

// signUp page........

app.get("/signup", userController.renderSignUpFrom);

app.post("/signup", wrapAsync(userController.signUp)
);

//   login page ......

app.get("/login",userController.renderLoginForm);

app.post("/login",saveRedirectUrl,
     passport.authenticate('local', {
         failureRedirect: '/login' ,
         failureFlash: true,
        }), userController.login);

// logout .....
app.get("/logout",userController.logOut );

//  new add ....

app.get("/", (req, res) => {
    res.render("home");
})

// six....
app.all("*", (req,res,next) => {
     next(new ExpressError(404, "page not found"));
})

app.use((err,req,res,next) => {
    let {status = 500,message = "somethin went worng"} = err;
    res.status(status).render("error.ejs", {message});
    // seven...

})

// app.listen(8080, () => {
//     console.log("listening on the port 8080");
// });

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

