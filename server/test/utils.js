const connectToTestDatabase = async () => {
  const knex = require("knex");
  const knexConfig = require("../knexfile");
  const connectionConfig = knexConfig["test"];
  return knex(connectionConfig);
};

const resetMigrations = async (knex) => {
  while ((await knex.migrate.currentVersion("./server/migrations")) !== "none") {
    await knex.migrate.rollback({ directory: "./server/migrations" });
  }
};

const migrateToLatest = async (knex) => {
  await knex.migrate.latest({ directory: "./server/migrations" });
};

const seedDatabase = async (knex) => {
  await knex.seed.run({ directory: "./server/test/seeds" });
};

const createDateTimestamp = (days) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString();
};

module.exports = { connectToTestDatabase, migrateToLatest, resetMigrations, seedDatabase, createDateTimestamp };
