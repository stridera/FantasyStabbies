const router = require("express").Router();
const Nomination = require("../../models/nomination.model");
const Vote = require("../../models/vote.model");
const votingRouter = require("./votes");
const { ensureModerator, ensureAccountOldEnough } = require("../../middleware/auth.middleware");
const { nominationSchema } = require("../../../src/config/validation.schema");
const { ref } = require("objection");
const { UniqueViolationError } = require("objection-db-errors");

const ensureWeAreInTheNominationPhase = async (req, res, next) => {
  if (req.user.is_moderator) return next();

  const campaign = await req.campaign;
  const start = campaign.nominate_start_date;
  const end = campaign.nominate_end_date;
  const now = new Date();

  if (now < start) {
    return res.status(400).json({ error: "Nomination phase has not started yet." });
  } else if (now > end) {
    return res.status(400).json({ error: "Nomination phase has ended." });
  }
  return next();
};

// Nominations
router.get("/", async (req, res, next) => {
  try {
    const now = new Date();
    const end = req.campaign.nominate_end_date;
    const promise = Nomination.query().where("category", req.category.id);
    if (req.user.is_moderator || now > end) {
      promise.select(["nomination.*", Vote.query().where("nomination", ref("nomination.id")).count().as("votes")]);
    }
    return res.json(await promise);
  } catch (err) {
    return next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const now = new Date();
    const end = req.campaign.nominate_end_date;
    const promise = Nomination.query().findById(req.params.id).where("category", req.category.id);
    return res.json(await promise);
  } catch (err) {
    return next(err);
  }
});

router.post("/", ensureAccountOldEnough, ensureWeAreInTheNominationPhase, async (req, res, next) => {
  try {
    const nomination = await Nomination.query().insert({
      user: req.user.id,
      category: req.category.id,
      work: req.body.work,
    });
    return res.status(201).json(nomination);
  } catch (err) {
    if (err instanceof UniqueViolationError) {
      return next({ status: 409, message: "Nomination already exists." });
    }
    return next({ status: 400, message: "Nomination failed" });
  }
});

router.patch("/:id", ensureModerator, async (req, res, next) => {
  try {
    nominationSchema
      .validate(req.body)
      .then(async (data) => {
        const results = await Nomination.query().patchAndFetchById(req.params.id, data);
        return res.send({ results });
      })
      .catch((err) => {
        return next(err);
      });
  } catch (err) {
    return next(err);
  }
});

router.delete("/:id", ensureModerator, async (req, res, next) => {
  try {
    const results = await Nomination.query().deleteById(req.params.id);
    return res.send({ results });
  } catch (err) {
    return next(err);
  }
});

// Votes
router.use(
  "/:id/vote",
  async (req, res, next) => {
    try {
      const category = req.category;
      const nomination = await Nomination.query().findById(req.params.id).where("category", category.id);
      if (nomination) {
        req.nomination = nomination;
        return next();
      }
      return res.status(404).json({ message: "Nomination not found" });
    } catch (err) {
      return next(err);
    }
  },
  votingRouter
);

module.exports = router;
