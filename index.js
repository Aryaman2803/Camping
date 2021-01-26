const express = require("express");
const app = express();
const path = require("path");
const port = 3000;
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("connect-flash");
const campgroundsRoutes = require("./routes/campgrounds");
const reviewsRoutes = require("./routes/reviews");
const userRoutes = require("./routes/users");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");

mongoose.connect("mongodb://localhost:27017/yelp-camp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error:"));
db.once("open", () => {
  console.log("Database Connected!");
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//Setting our Public Directory with join path/
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
//(8) For template we Add EJS-MATE
app.engine("ejs", ejsMate);

app.use(express.static(path.join(__dirname, "public")));

//(10) Setting up bare minimum express-session
/*(10.1) Right now we are storing in browser memory (just for development porpuses),
 later we will store in Mongo*/
const sessionConfig = {
  secret: "thisshouldbeabettersecret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionConfig));

//(11) Setting up Flash for flash messages.  SET UP BEFORE OUR ROUTE HANDLERS
/*(11.1) We use it by calling req.flash by passing in a Key and value in it*/
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
/**(11.3) It means passport we would use the LocalStrategy we have downloaded and required
 * and for that LocalStrategy the Authentication() is going to be located on our User Model.
 *
 * authenticate()- Generates a function that is used in Passport's LocalStrategy
 */
passport.use(new LocalStrategy(User.authenticate()));
//(11.4) serializeUser()- Generates a function that is used by Passport to searlize users into the sesion
//It helps to store the a User into a session
passport.serializeUser(User.serializeUser());
//It helps to get the User out of that session
passport.deserializeUser(User.deserializeUser());

//Our Flash -connect middleware
app.use((req, res, next) => {
  //It shows the session details
  // console.log(req.session) 
  
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user;
  next();
});

// //(11.5) Creating route, hardcode the neww User form
// app.get("/fakeuser", async (req, res) => {
//   const user = new User({ email: "singh@gmail.com", username: "Singh" });
//   //Now we Register instead of adding password
//   //Since it will hash the password which will take some time so we Await it.
//   const newUser = await User.register(user, "chicken");
//   res.send(newUser);
// });

//This Route is for User Register
app.use("/", userRoutes);
//Specify the Router(campgrounds.js) that we wanna use for cleaner code
app.use("/campgrounds", campgroundsRoutes);
//This use is for reviews Router
app.use("/campgrounds/:id/reviews", reviewsRoutes);

//(1) Home
app.get("/", (req, res) => {
  res.render("home");
});

//(9) Some request and we dont recognize. Remeber the order is very important
// When we pass error in next it hits the Error Handler (bottom one - app.use )
app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found"), 404);
});

//(8) We have started Handling Errors
//(8.1) We wrap Async functions in try catch blocks
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Oh No, Something went wrong!";
  res.status(statusCode).render("error", { err });
});

app.listen(port, () => {
  console.log("CONNECTED TO PORT: " + port);
});
