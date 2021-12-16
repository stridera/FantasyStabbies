const { Model } = require("objection");
const { DBErrors } = require("objection-db-errors");

const tableNames = require("../db/tableNames");

class Vote extends DBErrors(Model) {
  static get tableName() {
    return tableNames.vote;
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["nomination", "user"],
      properties: {
        id: { type: "integer" },
        nomination: { type: "integer" },
        user: { type: "integer" },
      },
    };
  }
}

module.exports = Vote;
