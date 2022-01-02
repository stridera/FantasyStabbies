const router = require("express").Router();

const booksRouter = require("./search/books");
const urlsRouter = require("./search/urls");
const redditRouter = require("./search/reddit");

const { ensureAuthenticated } = require("../../middleware/auth.middleware");

router.use("/url", ensureAuthenticated, urlsRouter);
router.use("/books", ensureAuthenticated, booksRouter);
router.use("/reddit", ensureAuthenticated, redditRouter);

module.exports = router;
