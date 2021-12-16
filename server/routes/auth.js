const router = require("express").Router();
const { addDevUser } = require("../middleware/auth.middleware");

const reddit = require("./auth/reddit");
router.use("/reddit", reddit);

router.get("/user", (req, res) => {
  addDevUser(req);

  if (req.user) {
    return res.send(req.user);
  } else {
    return res.status(401).send({ success: false, status: 401, error: "You must authenticate first." });
  }
});

router.get("/logout", (req, res) => {
  req.logout();
  return res.redirect("/");
});

module.exports = router;
