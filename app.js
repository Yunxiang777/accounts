/**
 * @file Entry point for the Express application, setting up middleware, routes, and error handling.
 */
require("dotenv").config();
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const connectDB = require("./db/db"); // Use the retry logic already inside this function
const session = require("express-session");
const MongoStore = require("connect-mongo");
const mongoose = require("mongoose");

/** Routers */
const indexRouter = require("./routes/web/index");
const authRouter = require("./routes/web/auth");
const accountRouter = require("./routes/api/account");
const authApiRouter = require("./routes/api/auth");

const app = express();

/**
 * Initialize MongoDB connection and log connection status.
 * If MongoDB connection fails, proceed without terminating the application.
 */
connectDB()
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((err) => {
    console.error("MongoDB connection failed: ", err.message);
  });

/**
 * Middleware to check MongoDB connection status before processing requests.
 * If the database is not connected, respond with a "Service Unavailable" (503) page.
 *
 * @param {Request} req - The incoming request object.
 * @param {Response} res - The outgoing response object.
 * @param {Function} next - The next middleware function in the stack.
 */
app.use((req, res, next) => {
  if (!mongoose.connection.readyState) {
    return res.status(503).render("error/busy");
  }
  next();
});

/**
 * Session middleware configuration.
 */
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 },
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      collectionName: "sessions",
    }),
  })
);

// View engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Middleware setup
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Routes setup
app.use("/", indexRouter);
app.use("/", authRouter);
app.use("/api", accountRouter);
app.use("/api", authApiRouter);

/**
 * Catch 404 and forward to error handler.
 * @param {Request} req - The incoming request.
 * @param {Response} res - The outgoing response.
 * @param {Function} next - The next middleware function.
 */
app.use((req, res, next) => {
  res.status(404).render("error/404"); // Render custom 404 page
});

/**
 * Error handler middleware.
 * @param {Error} err - The error that occurred.
 * @param {Request} req - The incoming request.
 * @param {Response} res - The outgoing response.
 * @param {Function} next - The next middleware function.
 */
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
