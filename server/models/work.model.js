const { Model } = require("objection");
const { DBErrors } = require("objection-db-errors");

const tableNames = require("../db/tableNames");

class Work extends DBErrors(Model) {
  static get tableName() {
    return tableNames.work;
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["title", "source_url"],
      properties: {
        id: { type: "integer" },
        google_book_id: { type: "string" },
        title: { type: "string" },
        authors: { type: "string" },
        publisher: { type: "string" },
        published_date: { type: "string" },
        source: { type: "string" },
        source_url: { type: "string" },
        image_url: { type: "string" },
        note: { type: "string" },
        is_valid: { type: "string" },
        approved_by: { type: "integer" },
      },
    };
  }
}

module.exports = Work;
