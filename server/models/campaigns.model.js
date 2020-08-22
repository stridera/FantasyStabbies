const mongoose = require("mongoose");

const voteScheme = mongoose.Schema(
  {
    voter: { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true },
  },
  { timestamps: true }
);

const nominationSchema = mongoose.Schema(
  {
    nominator: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    title: String,
    type: String,
    link: String,
    note: String,
    valid: Boolean,
    votes: [voteScheme],
  },
  { timestamps: true }
);

const questionSchema = mongoose.Schema(
  {
    question: String,
    source: String,
    nominations: [nominationSchema],
  },
  { timestamps: true }
);

const campaignsSchema = mongoose.Schema(
  {
    endDate: Date,
    voteStart: Date,
    nominateStart: Date,
    minAge: Number,
    slug: { type: String, unique: true },
    campaignName: { type: String, unique: true },
    public: Boolean,
    questions: [questionSchema],
  },
  { timestamps: true }
);

const Campaigns = mongoose.model("Campaigns", campaignsSchema);

module.exports = Campaigns;
