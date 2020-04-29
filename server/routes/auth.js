const router = require("express").Router();

const reddit = require("./auth/reddit");
router.use("/reddit", reddit);

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;
