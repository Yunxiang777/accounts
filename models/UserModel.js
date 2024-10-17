const mongoose = require("mongoose");

/**
 * @typedef {Object} User
 * @property {string} username - The username of the user account.
 * @property {string} password - The encrypted password of the user.
 * @property {Date} createdAt - The account creation date.
 */

/**
 * Defines the schema for the registered users, including fields for username, password, and account creation date.
 */
let UserSchema = new mongoose.Schema({
  /**
   * The username field, used to store the unique username of the user.
   * @type {string}
   * @required {true} This field is required.
   * @unique {true} Ensures the username is unique across all users.
   */
  username: {
    type: String,
    required: [true, "Username is required"],
    unique: true,
  },

  /**
   * The password field, used to store the encrypted password of the user.
   * @type {string}
   * @required {true} This field is required.
   */
  password: {
    type: String,
    required: [true, "Password is required"],
  },

  /**
   * The account creation date, automatically set to the current date at the time of registration.
   * @type {Date}
   * @default The current date and time.
   */
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

/**
 * The Mongoose model for creating and manipulating user accounts.
 * This model allows for CRUD operations on user data.
 * @type {mongoose.Model<User>}
 */
let UserModel = mongoose.model("users", UserSchema);

module.exports = UserModel;
