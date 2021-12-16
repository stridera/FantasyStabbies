module.exports = {
  rootDir: "./server",
  roots: ["<rootDir>/test"],
  testEnvironment: "node",
  globalSetup: "./test/global-setup.js",
  globalTeardown: "./test/global-teardown.js",
};
