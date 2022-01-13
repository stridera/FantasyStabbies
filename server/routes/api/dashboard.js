const { groupBy } = require("lodash");
const { ref } = require("objection");
const Campaign = require("../../models/campaign.model");
const Category = require("../../models/category.model");
const Nomination = require("../../models/nomination.model");
const Vote = require("../../models/vote.model");

const router = require("express").Router();

router.get("/", async (req, res, next) => {
  try {
    const data = await Campaign.query()
      .select([
        "campaign.*",
        Category.query().whereIn("campaign_id", ref("campaign.id")).count().as("categories"),
        Nomination.query()
          .whereIn("category_id", Category.query().select("id").where("campaign_id", ref("campaign.id")))
          .count()
          .as("nominations"),
        Vote.query()
          .whereIn(
            "nomination_id",
            Nomination.query()
              .select("id")
              .whereIn("category_id", Category.query().select("id").whereIn("campaign_id", ref("campaign.id")))
          )
          .count()
          .as("votes"),
      ])
      .groupBy("campaign.id");

    res.json(data);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
