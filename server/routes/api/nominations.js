const router = require("express").Router();
const { ensureModerator } = require("../../middleware/auth.middleware");
const { nominationSchema } = require("../../../src/config/validation.schema");

router.get("/", async (req, res) => {
  return res.send({ success: true, nominations: req.question.nominations });
});

router.post("/?error=signed_out", async (req, res) => {
  const campaign = req.campaign;
  nominationSchema
    .validate(req.body)
    .then(async (data) => {
      const results = await campaign.questions.push(data);
      if (results) {
        const newQuestion = campaign.questions[0];
        await campaign.save();
        return res.send({ success: true, campaign: campaign._id, question: newQuestion });
      }
    })
    .catch((err) => {
      return res.status(500).send({ success: false, error: err.message });
    });
});

module.exports = router;
