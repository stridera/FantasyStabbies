const router = require("express").Router();

const passport = require("passport");
const crypto = require("crypto");

router.route("/").get((req, res, next) => {
  req.session.state = crypto.randomBytes(32).toString("hex");
  passport.authenticate("reddit", {
    state: req.session.state,
  })(req, res, next);
});

router.route("/callback").get((req, res, next) => {
  // Check for origin via state token
  if (req.query.state === req.session.state) {
    passport.authenticate("reddit", {
      successRedirect: "/after_auth",
      failureRedirect: "/?error=auth_failed",
    })(req, res, next);
  } else {
    console.log("Invalid state token", req.query.state, req.session.state);
    res.redirect("/?error=session_mismatch");
  }
});

module.exports = router;
