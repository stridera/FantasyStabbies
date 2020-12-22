// Update with your config settings.
require("dotenv").config({ path: "../.env" });

console.log("Database URL: " + process.env.DATABASE_URL);

module.exports = {
  development: {
    client: "pg",
    connection: process.env.DATABASE_URL,
  },
};
// psql postgres://strider:ojYKLR4f0MQWYlaLT4wbf0@localhost:5432/fantasy
