const { Model } = require("objection");

const tableNames = require("../db/tableNames");

class User extends Model {
  static get tableName() {
    return tableNames.user;
  }

  static get jsonSchema() {
    return schema;
  }
}
module.exports = Campaigns;
