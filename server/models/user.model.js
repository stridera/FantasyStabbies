const { Model } = require("objection");
const { DBErrors } = require("objection-db-errors");

const tableNames = require("../db/tableNames");

class User extends DBErrors(Model) {
  static get tableName() {
    return tableNames.user;
  }

  static get jsonSchema() {
    return {
      type: "object",
      title: "User",
      description: "The User",
      required: ["username", "reddit_id", "is_moderator", "reddit_created"],
      properties: {
        id: { type: "integer", title: "The database ID of the user." },
        username: { type: "string", title: "The users username. Must be unique.", examples: ["stridera"] },
        reddit_id: { type: "string", title: "The users reddit ID.", examples: ["abc123"] },
        is_moderator: { type: "boolean", title: "Is the user a moderator." },
        // reddit_created: { type: "timestamp", title: "The date the users reddit account was created." },
      },
    };
  }
}

module.exports = User;
