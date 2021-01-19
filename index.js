const express = require("express");
const app = express();
const path = require("path");
const port = 3000;
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const mongoose = require("mongoose");

const campgrounds = require("./routes/campgrounds");
const reviews = require("./routes/reviews");

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

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
//(8) For template we Add EJS-MATE
app.engine("ejs", ejsMate);


//Specify the Router(campgrounds.js) that we wanna use for cleaner code
app.use("/campgrounds", campgrounds);
//This use is for reviews Router
app.use("/campgrounds/:id/reviews", reviews);

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
