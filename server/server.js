const express = require("express");
require("dotenv").config();

const app = express();

const session = require("express-session"); // Need to store state var for reddit auth
const bodyParser = require("body-parser"); // For parsing body
const passport = require("passport"); // Reddit/Goodreads Auth
const mongoose = require("mongoose"); // Database

// Logging Setup
const morgan = require("morgan");
var winston = require("./services/winston");

mongoose.connect(process.env.MONGOOSE_URL, {
  user: process.env.MONGOOSE_USER,
  pass: process.env.MONGOOSE_PASS,
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

app.use(
  session({
    secret: "snoo fantasy stabbies",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.ENV != "dev" },
  })
);

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Setup Passport Sessions
require("./auth/reddit-auth")(passport);
app.use(passport.initialize());
app.use(passport.session());

// Log requests
app.use(morgan("combined", { stream: winston.stream }));

// Routes
const authRouter = require("./routes/auth");
app.use("/auth", authRouter);

const apiRouter = require("./routes/api");
app.use("/api", apiRouter);

// App Configuration
const PORT = process.env.PORT || 5000;

/** Listen **/
app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
