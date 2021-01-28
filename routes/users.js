const express = require("express");
const router = express.Router();
const passport = require("passport");
const catchAsync = require("../utils/catchAsync");
const User = require("../models/user");
const users = require("../controllers/users");

/**
 * *After moving the Route detials in controllers directory, we Restructure Routes even further
 * *We route under single path. And we dont specify the same path , just the middleware.
 **/

router
  .route("/register")
  .get(users.renderRegister)
  .post(catchAsync(users.register));

router
  .route("/login")
  .get(users.renderLogin)
  .post(passport.authenticate("local", { failureFlash: true, failureRedirect: "/login", }), users.login );

//(1) Creating Register Route

//Later we move the Route details in controller->users.js for MVC Structure
// ? We have grouped it above in Route '/register'.
// ?router.get("/register", users.renderRegister);

//(2) Route which submits the Form
//Later we add req.login for authentication. It is done so that we can Login directly after a user has registered

//Later we move the Route details in controller->users.js for MVC Structure

// ? We have grouped it above in Route '/register'.
// ? router.post("/register", catchAsync(users.register));

//(3) Route for Login
//Later we move the Route details in controller->users.js for MVC Structure
// ? We have grouped it above in Route '/login'.
// ? router.get("/login", users.renderLogin);

//(4) Route after User Login is verified
//We are using passport.authenticate('local') Strategy, we can use facebook,gmail. etc

//Later we move the Route details in controller->users.js for MVC Structure
// ? We have grouped it above in Route '/register'.
// ? router.post("/login",passport.authenticate("local", {failureFlash: true,failureRedirect: "/login",}),users.login);

//Route for Loggin out the User
//There is a method logout() added to our req Object automatatically

//Later we move the Route details in controller->users.js for MVC Structure

// ! We have NOT grouped it above in Route because they it is standalone.
router.get("/logout", users.logout);

module.exports = router;
