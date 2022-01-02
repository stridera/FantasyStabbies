require("dotenv").config();

const express = require("express");
const session = require("express-session");
const KnexSessionStore = require("connect-session-knex")(session);

const app = express();
const path = require("path");

// Logging Setup
const morgan = require("morgan");
const winston = require("./services/winston");

// Database
const knex = require("./db");

const store = new KnexSessionStore({
  knex,
});

var sess = {
  store: store,
  secret: process.env.SESSION_SECRET || "snoo fantasy stabbies",
  resave: false,
  saveUninitialized: true,
  cookie: { secure: app.get("env") === "production" ? true : false },
};

app.use(session(sess));

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

if (app.get("env") === "production") {
  console.log("Production mode.  Trusting proxy, requiring secure cookies.");
  app.set("trust proxy", 1); // trust first proxy

  app.use(express.static(path.join(__dirname, "..", "build")));
  app.use(express.static(path.join(__dirname, "..", "public")));
  app.use((req, res, next) => {
    res.sendFile(path.join(__dirname, "..", "build", "index.html"));
  });
}

// Log requests
if (app.get("env") !== "test") app.use(morgan("combined", { stream: winston.stream }));

// Log server errors
app.use((err, req, res, next) => {
  // Fallback to default node handler
  if (res.headersSent) {
    return next(err);
  }

  // console.error(err);
  if (app.get("env") !== "test") winston.error(err.message, { url: req.originalUrl });
  res.status(err.status || 500);
  res.json({ error: err.message });
});

module.exports = app;
