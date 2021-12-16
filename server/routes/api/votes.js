const router = require("express").Router();
const { ref } = require("objection");
const { UniqueViolationError } = require("objection-db-errors");
const { ensureModerator, ensureAccountOldEnough } = require("../../middleware/auth.middleware");
const Category = require("../../models/category.model");
const User = require("../../models/user.model");
const Votes = require("../../models/vote.model");

// Helper Functions

const ensureWeAreInTheVotingPhase = async (req, res, next) => {
  if (req.user.is_moderator) return next();

  const campaign = await req.campaign;
  const start = campaign.voting_start_date;
  const end = campaign.voting_end_date;
  const now = new Date();

  if (now < start) {
    return res.status(400).json({
      message: "Voting phase has not started yet",
    });
  } else if (now > end) {
    return res.status(400).json({
      message: "Voting phase has ended",
    });
  }
  return next();
};

// Categories
router.get("/", async (req, res, next) => {
  try {
    const votes = await Votes.query().count().where("nomination", req.nomination.id).where("user", req.user.id).first();
    return res.json({ voted: votes.count > 0 });
  } catch (err) {
    return next(err);
  }
});

router.get("/show", ensureModerator, async (req, res, next) => {
  try {
    const nomination = req.nomination;
    const votes = await Votes.query()
      .where("nomination", nomination.id)
      .select(["vote.*", User.query().select("username").where("id", ref("vote.user")).as("username")]);

    return res.json(votes);
  } catch (err) {
    return next(err);
  }
});

router.post("/", ensureAccountOldEnough, ensureWeAreInTheVotingPhase, async (req, res, next) => {
  try {
    const ip_address = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const vote = await Votes.query().insert({
      user: req.user.id,
      nomination: req.nomination.id,
      ip_address: ip_address.substring(0, 255),
    });
    return res.json({ success: true });
  } catch (err) {
    if (err instanceof UniqueViolationError) {
      return next({ status: 409, message: "Vote already set.  Please try again." });
    }
    return next(err);
  }
});

router.patch("/", ensureAccountOldEnough, ensureWeAreInTheVotingPhase, async (req, res, next) => {
  try {
    // const results = await Votes.query()
    //   .patch("nomination", req.nomination.id)
    //   .where("vote.id", "=", Category.query().select("vote").where("id", req.body.id));
    const results = await Category.query().select("vote").where("id", req.body.id);
    console.log(results);
    return res.send({ success: true });
  } catch (err) {
    console.log(err);
    return next(err);
  }
});

router.delete("/", async (req, res, next) => {
  try {
    const results = await Votes.query().delete().where("nomination", req.nomination.id).where("user", req.user.id);
    return res.send({ success: true });
  } catch (err) {
    return next(err);
  }
});

router.delete("/:id", ensureModerator, async (req, res, next) => {
  try {
    const results = await Votes.query().deleteById(req.params.id);
    return res.send({ results });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
