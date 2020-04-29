const mongoose = require("mongoose");

const usersSchema = mongoose.Schema(
  {
    username: String,
    redditId: String,
    iconURL: String,
    moderator: Boolean,
    created: Date,
  },
  { timestamps: true }
);

const Users = mongoose.model("User", usersSchema);

module.exports = Users;
