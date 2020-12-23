const router = require("express").Router();

const { ensureAuthenticated } = require("../middleware/auth.middleware");

const userRouter = require("./api/user");
const campaignRouter = require("./api/campaigns");

router.use("/user", ensureAuthenticated, userRouter);
router.use("/campaigns", ensureAuthenticated, campaignRouter);

module.exports = router;
