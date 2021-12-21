const Knex = require("knex");
const tableNames = require("../db/tableNames");

/**
 * @param {Knex} knex
 */
exports.up = async (knex) => {
  await knex.schema.createTable(tableNames.user, (table) => {
    table.increments("id");
    table.string("reddit_id").notNullable().unique();
    table.string("username").notNullable().unique();
    table.boolean("is_moderator").notNullable().defaultTo(false);
    table.timestamp("reddit_created").notNullable();
    table.boolean("is_banned").defaultTo(false);
    table.integer("banned_by").unsigned().nullable().references("id").inTable(tableNames.user);
    table.timestamps(true, true);
  });

  await knex.schema.createTable(tableNames.approver, (table) => {
    table.increments("id");
    table.string("type").notNullable();
    table.string("approver").notNullable();
    table.timestamps(true, true);
  });

  await knex.schema.createTable(tableNames.campaign, (table) => {
    table.increments("id");
    table.string("name").notNullable().unique();
    table.string("slug").notNullable().unique();
    table.boolean("public").notNullable().defaultTo(false);
    table.integer("min_account_age").notNullable().defaultTo(0);
    table.timestamp("nominate_start_date").notNullable();
    table.timestamp("nominate_end_date").notNullable();
    table.timestamp("voting_start_date").notNullable();
    table.timestamp("voting_end_date").notNullable();
    table.timestamps(true, true);
  });

  await knex.schema.createTable(tableNames.category, (table) => {
    table.increments("id");
    table.integer("campaign").unsigned().notNullable().references("id").inTable(tableNames.campaign);
    table.string("title", 255).notNullable();
    table.string("description", 255);
    table.string("source", 255).notNullable();
    table.unique(["campaign", "title"]);
    table.timestamps(true, true);
  });

  await knex.schema.createTable(tableNames.work, (table) => {
    table.increments("id");
    table.string("google_book_id", 25).unique();
    table.string("title", 255).notNullable();
    table.string("authors", 255).notNullable();
    table.string("publisher", 255);
    table.string("published_date", 255);
    table.string("source", 255);
    table.string("source_url", 2000).notNullable().unique();
    table.string("image_url", 2000);
    table.string("note", 2000);
    table.boolean("is_valid").defaultTo(false);
    table.integer("approved_by").unsigned().references("id").inTable(tableNames.user);
    table.timestamps(true, true);
  });

  await knex.schema.createTable(tableNames.nomination, (table) => {
    table.increments("id");
    table.integer("user").unsigned().notNullable().references("id").inTable(tableNames.user);
    table.integer("category").unsigned().notNullable().references("id").inTable(tableNames.category);
    table.integer("work").unsigned().notNullable().references("id").inTable(tableNames.work);
    table.unique(["user", "category", "work"]);
    table.timestamps(true, true);
  });

  await knex.schema.createTable(tableNames.vote, (table) => {
    table.increments("id");
    table.integer("user").unsigned().notNullable().references("id").inTable(tableNames.user);
    table.integer("nomination").unsigned().notNullable().references("id").inTable(tableNames.nomination);
    table.string("ip_address", 255).notNullable();
    table.timestamps(true, true);
    table.unique(["user", "nomination"]);
  });
};

exports.down = async (knex) => {
  await Promise.all(
    [
      tableNames.vote,
      tableNames.nomination,
      tableNames.category,
      tableNames.campaign,
      tableNames.approver,
      tableNames.user,
      tableNames.work,
    ].map((table) => knex.raw(`DROP TABLE IF EXISTS "${table}" CASCADE`))
  );
};
