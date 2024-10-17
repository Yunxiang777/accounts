var express = require("express");
var router = express.Router();
var UserModel = require("../../models/UserModel");
const bcrypt = require("bcrypt");
const { body, validationResult } = require("express-validator");
const saltRounds = 10; // Encryption strength

/**
 * @module AuthRoutes
 * @description Routes for user authentication (registration, login, logout).
 */

/**
 * GET /reg
 * Renders the registration page.
 *
 * @name GetRegistrationPage
 * @route {GET} /reg
 * @returns {void}
 */
router.get("/reg", (req, res) => {
  res.render("auth/reg", { errors: [] }); // Initialize with empty error messages
});

/**
 * POST /reg
 * Handles user registration with validation and password encryption.
 *
 * @name RegisterUser
 * @route {POST} /reg
 * @bodyparam {string} username - The username (min. 5 characters).
 * @bodyparam {string} password - The password (min. 6 characters).
 * @returns {void}
 */
router.post(
  "/reg",
  [
    body("username")
      .trim()
      .notEmpty()
      .withMessage("Username is required")
      .isLength({ min: 5 })
      .withMessage("Username must be at least 5 characters")
      .custom(async (username) => {
        const existingUser = await UserModel.findOne({ username });
        if (existingUser) throw new Error("Username already exists");
      }),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("auth/reg", { errors: errors.array() });
    }

    const { username, password } = req.body;

    try {
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const newUser = new UserModel({ username, password: hashedPassword });
      await newUser.save();
      res.render("create", { message: "Registration successful!" });
    } catch (err) {
      console.error("Registration failed:", err);
      res.status(500).render("auth/reg", {
        errors: [{ msg: "Server error, please try again later" }],
      });
    }
  }
);

/**
 * GET /login
 * Renders the login page.
 *
 * @name GetLoginPage
 * @route {GET} /login
 * @returns {void}
 */
router.get("/login", (req, res) => {
  res.render("auth/login", { errors: [] });
});

/**
 * POST /login
 * Handles user login by validating credentials and setting session.
 *
 * @name LoginUser
 * @route {POST} /login
 * @bodyparam {string} username - The username.
 * @bodyparam {string} password - The password.
 * @returns {void}
 */
router.post(
  "/login",
  [
    body("username")
      .trim()
      .notEmpty()
      .withMessage("Username is required")
      .isLength({ min: 5 })
      .withMessage("Username must be at least 5 characters"),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("auth/login", { errors: errors.array() });
    }

    const { username, password } = req.body;

    try {
      const user = await UserModel.findOne({ username });
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(400).render("auth/login", {
          errors: [{ msg: "Invalid username or password" }],
        });
      }

      // Set user session
      req.session.user = { id: user._id, username: user.username };
      res.redirect("/account/create"); // Redirect after successful login
    } catch (err) {
      console.error("Login failed:", err);
      res.status(500).render("auth/login", {
        errors: [{ msg: "Server error, please try again later" }],
      });
    }
  }
);

/**
 * POST /logout
 * Handles user logout by destroying the session.
 *
 * @name LogoutUser
 * @route {POST} /logout
 * @returns {void}
 */
router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Logout failed:", err);
      return res
        .status(500)
        .render("error", { message: "Logout failed", error: err });
    }
    res.redirect("/login");
  });
});

module.exports = router;
