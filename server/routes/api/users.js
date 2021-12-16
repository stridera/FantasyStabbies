const router = require("express").Router();
const { ensureModerator } = require("../../middleware/auth.middleware");

router.get("/", ensureModerator, (req, res) => {
  res.send(req.user);
});

module.exports = router;
