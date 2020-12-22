const { Model } = require("objection");

const tableNames = require("../db/tableNames");

class User extends Model {
  static get tableName() {
    return tableNames.user;
  }

  static get jsonSchema() {
    return {
      $schema: "http://json-schema.org/draft-07/schema",
      type: "object",
      title: "User",
      description: "The User",
      required: ["username", "reddit_id", "is_moderator", "reddit_created"],
      additionalProperties: false,
      properties: {
        id: {
          $id: "#/properties/id",
          type: "integer",
          title: "The database ID of the user.",
        },
        username: {
          $id: "#/properties/username",
          type: "string",
          title: "The users username. Must be unique.",
          examples: ["stridera"],
        },
        reddit_id: {
          $id: "#/properties/reddit_id",
          type: "string",
          title: "The users reddit ID.",
          examples: ["abc123"],
        },
        is_moderator: {
          $id: "#/properties/is_moderator",
          type: "boolean",
          title: "Is the user a moderator.",
        },
        reddit_created: {
          $id: "#/properties/reddit_created",
          type: "timestamp",
          title: "The date the users reddit account was created.",
        },
      },
    };
  }
}

module.exports = User;
