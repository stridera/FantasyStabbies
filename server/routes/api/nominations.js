const router = require("express").Router();
const Nomination = require("../../models/nomination.model");
const Vote = require("../../models/vote.model");
const votingRouter = require("./votes");
const { ensureModerator, ensureAccountOldEnough } = require("../../middleware/auth.middleware");
const { nominationSchema } = require("../../../src/config/validation.schema");
const { ref } = require("objection");
const { UniqueViolationError } = require("objection-db-errors");
const Work = require("../../models/work.model");
const User = require("../../models/user.model");
const { boolean } = require("yup/lib/locale");

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
    const promise = Nomination.query()
      .where("category_id", req.category.id)
      .select(
        "nomination.id",
        "nomination.category_id",
        "work.* as work",
        Vote.query()
          .where("nomination_id", ref("nomination.id"))
          .where("user_id", ref("nomination.user_id"))
          .count()
          .castTo(boolean)
          .as("voted")
      )
      .joinRelated("work");
    if (req.user.is_moderator || now > end) {
      promise.select(["nomination.*", Vote.query().where("nomination_id", ref("nomination.id")).count().as("votes")]);
    }
    return res.json(await promise);
  } catch (err) {
    return next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    Nomination.query()
      .findById(req.params.id)
      .where("category_id", req.category.id)
      .then((nomination) => {
        return res.json(nomination);
      })
      .catch((err) => {
        return next(err);
      });
  } catch (err) {
    return next(err);
  }
});

router.post("/", ensureAccountOldEnough, ensureWeAreInTheNominationPhase, async (req, res, next) => {
  try {
    if ("approved" in req.body || "approved_by" in req.body)
      return next({ status: 400, message: "You cannot set approved or approved_by" });

    nominationSchema
      .validate(req.body)
      .then(async (data) => {
        let extra = {};
        if (req.user.is_moderator) extra = { approved: true, approved_by: req.user.id };
        Nomination.query()
          .insert({
            user_id: req.user.id,
            category_id: req.category.id,
            work_id: req.body.work,
            ...extra,
          })
          .then(async (nomination) => {
            const inserted = await Nomination.query()
              .where("nomination.id", nomination.id)
              .select(
                "nomination.id",
                "nomination.category_id",
                "work.* as work",
                Vote.query()
                  .where("nomination_id", ref("nomination.id"))
                  .where("user_id", ref("nomination.user_id"))
                  .count()
                  .castTo(boolean)
                  .as("voted")
              )
              .joinRelated("work")
              .first();
            return res.status(201).json(inserted);
          })
          .catch((err) => {
            if (err instanceof UniqueViolationError) {
              return next({ status: 409, message: "Nomination already exists." });
            }
            return next(err);
          });
      })
      .catch((err) => {
        return next({ status: 400, message: err.message });
      });
  } catch (err) {
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
      const nomination = await Nomination.query().findById(req.params.id).where("category_id", category.id);
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
