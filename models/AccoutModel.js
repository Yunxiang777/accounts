const mongoose = require("mongoose");

/**
 * @typedef {Object} Account
 * @property {string} description - The transaction description, which records details about the transaction.
 * @property {number} amount - The transaction amount, which must be an integer.
 * @property {Date} date - The date of the transaction, recording when the transaction occurred.
 * @property {string} positiveOrNegative - The transaction type, where "1" represents income and "-1" represents expenditure.
 */

/**
 * The AccountSchema defines the structure for recording transactions in an accounting book.
 * It includes fields for the transaction description, amount, date, and type (income or expenditure).
 */
let AccountSchema = new mongoose.Schema({
  /**
   * The description field, used to record details or the name of the transaction.
   * @type {string}
   * @required {true} This field is required.
   */
  description: {
    type: String,
    required: [true, "Description is required"],
  },

  /**
   * The amount field, used to record the transaction amount, which must be an integer.
   * @type {number}
   * @required {true} This field is required.
   * @validate {Number.isInteger} Validates that the amount is an integer.
   */
  amount: {
    type: Number,
    required: [true, "Amount is required"],
    validate: {
      validator: Number.isInteger,
      message: "{VALUE} is not a valid integer",
    },
  },

  /**
   * The date field, used to record the date of the transaction, which must be in a valid date format.
   * @type {Date}
   * @required {true} This field is required.
   */
  date: {
    type: Date,
    required: [true, "Date is required"],
    set: function (value) {
      if (typeof value === "string") {
        // If the value is a string, remove the time portion, keeping only the date.
        const date = new Date(value);
        return new Date(date.toISOString().split("T")[0]); // Keeps only the date (YYYY-MM-DD).
      }
      return new Date(value); // If it's already a Date object, return it directly.
    },
  },

  /**
   * The transaction type field, identifying whether the transaction is income ("1") or expenditure ("-1").
   * @type {string}
   * @enum {["1", "-1"]} The transaction type options.
   * @required {true} This field is required.
   */
  positiveOrNegative: {
    type: String,
    enum: ["1", "-1"], // 1 for income, -1 for expenditure
    required: [true, "Transaction type is required"],
  },
});

/**
 * The AccountModel is the Mongoose model used to create and manipulate account transaction records.
 * It allows for CRUD operations on transactions.
 * @type {mongoose.Model<Account>}
 */
let AccountModel = mongoose.model("accounts", AccountSchema);

module.exports = AccountModel;
