const router = require("express").Router();
const { UniqueViolationError } = require("objection-db-errors");
const { ensureModerator, ensureAccountOldEnough } = require("../../middleware/auth.middleware");
const Work = require("../../models/work.model");
const { workSchema } = require("../../../src/config/validation.schema");
const GoogleBooksService = require("../../services/googlebooks");
const allowedSources = require("../../../src/config/allowedSources");

const saveWork = async (res, next, work) => {
  workSchema
    .validate(work)
    .then(async (data) => {
      Work.query()
        .insert(data)
        .then(async (work) => {
          return res.status(201).json(work);
        })
        .catch(async (err) => {
          if (err instanceof UniqueViolationError) {
            return res.status(400).json({ error: "Work already exists." });
          }
          return next(err);
        });
    })
    .catch((err) => {
      return next({ status: 400, message: err.message });
    });
};

router.post(`/${allowedSources.google_books.id}`, async (req, res, next) => {
  try {
    const google_book_id = req.body.google_book_id;

    if (!google_book_id) {
      return res.status(400).json({ message: "Missing google_book_id" });
    }

    // Check to see if it has already been added to the database.
    const work = await Work.query().findOne({ google_book_id: google_book_id });
    if (work) {
      return res.status(201).json(work);
    }

    // If here, we need to add it.
    const data = await GoogleBooksService.byId(google_book_id);
    if (!data) {
      return next({ status: 400, message: "Google book not found." });
    }

    saveWork(res, next, data);
  } catch (err) {
    return next(err);
  }
});

router.post(`/${allowedSources.reddit_user.id}`, async (req, res, next) => {
  try {
    const { body } = req;

    if (!body.source_url.startsWith(allowedSources.reddit_user.url)) {
      return res.status(400).json({ message: "Invalid source_url" });
    }

    saveWork(res, next, body);
  } catch (err) {
    return next(err);
  }
});

router.post(`/${allowedSources.fantasy_url.id}`, async (req, res, next) => {
  try {
    const { body } = req;

    if (!body.source_url.startsWith(allowedSources.fantasy_url.url)) {
      return res.status(400).json({ message: "Invalid source_url" });
    }

    saveWork(res, next, body);
  } catch (err) {
    return next(err);
  }
});

router.post(`/${allowedSources.manual.id}`, async (req, res, next) => {
  try {
    const { body } = req;
    saveWork(res, next, body);
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
