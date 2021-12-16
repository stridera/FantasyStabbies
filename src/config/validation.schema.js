const yup = require("yup");
const moment = require("moment");

const campaignSchema = yup.object().shape({
  name: yup.string().required().min(3),
  slug: yup.string().required().min(3),
  min_account_age: yup.number().positive().integer(),
  nominate_start_date: yup.date().required().min(moment().subtract(1, "days"), "Dates must be later than today."),
  nominate_end_date: yup
    .date()
    .required()
    .min(yup.ref("nominate_start_date"), "Nomination end must be after it starts."),
  voting_start_date: yup
    .date()
    .required()
    .min(yup.ref("nominate_end_date"), "Vote start must be after the nomination ends."),
  voting_end_date: yup.date().required().min(yup.ref("voting_start_date"), "Vote end must be after vote start date."),
  public: yup.boolean(),
});

const updateCampaignSchema = yup.object().shape({
  name: yup.string().required().min(3),
  slug: yup.string().required().min(3),
  min_age: yup.number().positive().integer().required(),
  public: yup.boolean(),
});

const categorySchema = yup.object().shape({
  title: yup.string().required().min(3).max(255),
  description: yup.string().min(3).max(255),
});

const nominationSchema = yup.object().shape({
  work: yup.number().positive().integer().required(),
});

const bookSchema = yup.object().shape({
  google_book_id: yup.string().required().min(3).max(25),
});

const otherSchema = yup.object().shape({
  title: yup.string().required().min(3).max(255),
  author: yup.string().min(3).max(255),
  description: yup.string().min(3).max(255),
  url: yup.string().url().required(),
  image_url: yup.string().url(),
});

module.exports = {
  campaignSchema,
  updateCampaignSchema,
  categorySchema,
  nominationSchema,
  bookSchema,
  otherSchema,
};
