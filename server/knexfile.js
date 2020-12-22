// Update with your config settings.
require("dotenv").config({ path: "../.env" });

console.log("Database URL: " + process.env.DATABASE_URL);
console.log("Cert: " + process.env.DATABASE_CA_CERT);

module.exports = {
  development: {
    client: "pg",
    connection: process.env.DATABASE_URL,
  },
  development: {
    client: "pg",
    connection: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: true,
        ca: process.env.DATABASE_CA_CERT,
    },
  },
};
