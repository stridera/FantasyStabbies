const router = require("express").Router();

const reddit = require("./auth/reddit");
router.use("/reddit", reddit);

router.get("/user", (req, res) => {
  if (req.user) {
    res.send(req.user);
  } else {
    res.sendStatus(401);
  }
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;
