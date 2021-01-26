const express = require("express");
const router = express.Router();
const passport = require("passport");
const catchAsync = require("../utils/catchAsync");
const User = require("../models/user");

//(1) Creating Register Route
router.get("/register", (req, res) => {
  res.render("users/register");
});

//(2) Route which submits the Form
//Later we add req.login for authentication. It is done so that we can Login directly after a user has registered
router.post(
  "/register",
  catchAsync(async (req, res, next) => {
    try {
      const { username, email, password } = req.body;
      const user = new User({ email, username });
      const registeredUser = await User.register(user, password);
      req.login(registeredUser, (err) => {
        if (err) return next(err);
        req.flash("success", "Welcome to Yelp Camp!");
        return res.redirect("/campgrounds");
      });
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("register");
    }
  })
);

//(3) Route for Login
router.get("/login", (req, res) => {
  res.render("users/login");
});

//(4) Route after User Login is verified
//We are using passport.authenticate('local') Strategy, we can use facebook,gmail. etc
router.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  (req, res) => {
    req.flash("success", "Welcome Back!");
    //Redirecting to Original page or campgrounds, with help of sessions which is initialized in middleware.js
    const redirectUrl = req.session.returnTo || "/campgrounds";
    //After returing to orignal Url we usually delete that session
    delete req.session.returnTo;
    res.redirect(redirectUrl);
  }
);

//Route for Loggin out the User
//There is a method logout() added to our req Object automatatically
router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success", "Goodbye!");
  res.redirect("/campgrounds");
});

module.exports = router;
