const router = require("express").Router();

const { ensureAuthenticated } = require("../middleware/auth.middleware");

const userRouter = require("./api/user");

router.use("/user", ensureAuthenticated, userRouter);

module.exports = router;
