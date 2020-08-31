const router = require("express").Router();
const nominationRouter = require("./nominations");
const { ensureModerator } = require("../../middleware/auth.middleware");
const { questionSchema } = require("../../../src/config/validation.schema");

const notFoundError = { status: 404, message: "Question not found." };

const getQuestionById = async (req, id) => {
  return req.campaign.questions.find((question) => question._id == id);
};

router.get("/", async (req, res, next) => {
  return res.send({ campaign: req.campaign._id, questions: req.campaign.questions || [] });
});

router.get("/:id", async (req, res, next) => {
  try {
    const question = await getQuestionById(req, req.params.id);
    if (question) {
      return res.send({ campaign: req.campaign._id, question });
    } else {
      return next(notFoundError);
    }
  } catch (err) {
    return next(err);
  }
});

router.post("/", ensureModerator, async (req, res, next) => {
  const campaign = req.campaign;
  questionSchema
    .validate(req.body)
    .then(async (data) => {
      const question = campaign.questions.create(data);
      const results = await campaign.questions.push(question);
      if (results) {
        await campaign.save();
        return res.send({ campaign: req.campaign._id, question });
      }
    })
    .catch((err) => {
      return next(err);
    });
});

router.patch("/:id", ensureModerator, async (req, res, next) => {
  try {
    const question = await getQuestionById(req, req.params.id);
    if (question) {
      questionSchema
        .validate(req.body)
        .then(async (data) => {
          question.set(data);
          await req.campaign.save();
          return res.send({ campaign: req.campaign._id, question });
        })
        .catch((err) => {
          if (err.name == "ValidationError") {
            return res.status(500).send({ success: false, error: err });
          }
          return next(err);
        });
    } else {
      return next(notFoundError);
    }
  } catch (err) {
    return next(err);
  }
});

router.delete("/:id", ensureModerator, async (req, res, next) => {
  try {
    const question = await getQuestionById(req, req.params.id);
    if (question) {
      question.remove();
      await req.campaign.save();
      return res.send({ success: true });
    } else {
      return next(notFoundError);
    }
  } catch (err) {
    return next(err);
  }
});

// Nominations
router.use(
  "/:id/nominations",
  async (req, res, next) => {
    try {
      const question = await getQuestionById(req.campaign.questions, req.params.id);
      if (question) {
        req.question = question;
        next();
      } else {
        return next(notFoundError);
      }
    } catch (err) {
      return next(err);
    }
  },
  nominationRouter
);

module.exports = router;
