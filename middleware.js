/**We are creating this new file so that we can use it in multiple locations.
 * Since after we are logged in we need to be able to acces the reviews too.
 * We are calling our middleware function isLoggedin.
 * req.user is added to our req object by passport which will automatically deserialize information of the session.
 *
 * Later we can store the url the User is requesting at which will help us to redirect it instead of some homepage.
 * And we do it by storing url in  Sessions so we have some persistance between different requrest(For statefullness).
 * Then we add this into Flash middleware(error,success one!)
 * Then we add it in the users.js Login authenticate Route
 */
const isLoggedIn = (req, res, next) => {
  // console.log("REQ.USER...", req.user);
  if (!req.isAuthenticated()) {
    //Helps us to return to original Url
    req.session.returnTo = req.originalUrl;
    req.flash("error", "You must be signed in first!");
    return res.redirect("/login");
  }
  //We use next to move to our next middleware
  next();
};

module.exports = isLoggedIn;
