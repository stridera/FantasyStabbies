require("dotenv").config();

const express = require("express");
const session = require("express-session"); // Need to store state var for reddit auth
const app = express();
const path = require("path");

// Logging Setup
const morgan = require("morgan");
const winston = require("./services/winston");

// Database
const pg = require("./db");

var sess = {
  secret: process.env.SESSION_SECRET || "snoo fantasy stabbies",
  resave: false,
  saveUninitialized: false,
  cookie: {},
};

if (app.get("env") === "production") {
  console.log("Production mode.  Trusting proxy, requiring secure cookies.");
  app.set("trust proxy", 1); // trust first proxy
  sess.cookie.secure = true; // serve secure cookies

  app.use((req, res, next) => {
    res.sendFile(path.join(__dirname, "..", "build", "index.html"));
  });
}

app.use(session(sess));

// Allow serving the react app on prod
app.use(express.static(path.join(__dirname, "..", "build")));

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const passport = require("passport"); // Reddit Auth

// Setup Passport Sessions - Here to skip the unit testing framework, which will mock it out
require("./auth/reddit-auth")(passport);
app.use(passport.initialize());
app.use(passport.session());

// Routes
const authRouter = require("./routes/auth");
app.use("/auth", authRouter);

const apiRouter = require("./routes/api");
app.use("/api", apiRouter);

app.use((err, req, res, next) => {
  // Fallback to default node handler
  if (res.headersSent) {
    next(err);
    return;
  }

  if (app.get("env") !== "test") winston.error(err.message, { url: req.originalUrl });
  res.status(err.status || 500);
  res.json({ error: err.message });
});

module.exports = app;
