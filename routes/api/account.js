var express = require("express");
var router = express.Router();
var AccountModel = require("../../models/AccoutModel");
const verifyToken = require("../../middlewares/JWT");

/**
 * Retrieves all account records and returns them as a JSON response.
 * @route GET /account
 * @returns {Object} JSON object with a list of accounts and total amount.
 * @throws {Error} Returns error message if the account retrieval fails.
 */
router.get("/account", verifyToken, async (req, res) => {
  try {
    const accounts = await AccountModel.find().sort({ date: -1 });
    const totalAmount = calculateTotalAmount(accounts);

    const responseData = { accounts, totalAmount };
    res.json({
      code: "0000",
      msg: "Data retrieved successfully",
      data: responseData,
    });
  } catch (err) {
    res.status(500).json({
      code: "1001",
      msg: "Failed to retrieve data",
      data: null,
    });
  }
});

/**
 * Deletes a specific account based on its ID.
 * @route DELETE /account/:id
 * @param {string} req.params.id - The unique ID of the account.
 * @returns {Object} JSON response indicating success or failure.
 * @throws {Error} Returns error message if account deletion fails.
 */
router.delete("/account/:id", verifyToken, async (req, res) => {
  try {
    const result = await AccountModel.deleteOne({ _id: req.params.id });

    if (result.deletedCount > 0) {
      res.json({
        code: "0000",
        msg: "Account successfully deleted",
      });
    } else {
      res.json({
        code: "1003",
        msg: "Account not found",
      });
    }
  } catch (err) {
    res.status(500).json({
      code: "1003",
      msg: "Failed to delete account",
    });
  }
});

/**
 * Renders the account creation page.
 * @route GET /account/create
 * @returns {void} Renders the form to allow user to create a new account.
 */
router.get("/account/create", verifyToken, (req, res) => {
  res.render("create");
});

/**
 * Creates a new account record.
 * @route POST /account/create
 * @param {Object} req.body - Contains account details (description, amount, date, positiveOrNegative).
 * @returns {void} Redirects to the /account page on success.
 * @throws {Error} Returns error message if account creation fails.
 */
router.post("/account/create", verifyToken, async (req, res) => {
  try {
    await AccountModel.create({
      description: req.body.description,
      amount: parseInt(req.body.amount),
      date: req.body.date,
      positiveOrNegative: req.body.positiveOrNegative,
    });
    res.json({
      code: "0000",
      msg: "Account created successfully",
    });
  } catch (err) {
    res.status(500).json({
      code: "1002",
      msg: "Failed to create account",
      data: err.message,
    });
  }
});

/**
 * Retrieves a specific account based on its ID.
 * @route GET /account/:id
 * @param {string} req.params.id - The unique ID of the account.
 * @returns {Object} JSON object with account data or error message.
 * @throws {Error} Returns error message if account retrieval fails.
 */
router.get("/account/:id", verifyToken, async (req, res) => {
  try {
    const account = await AccountModel.findById(req.params.id);

    if (account) {
      res.json({
        code: "0000",
        msg: "Account retrieved successfully",
        data: account,
      });
    } else {
      res.json({
        code: "1004",
        msg: "Account not found",
      });
    }
  } catch (err) {
    res.status(500).json({
      code: "1003",
      msg: "Failed to retrieve account",
    });
  }
});

/**
 * Partially updates a specific account.
 * @route PATCH /account/:id
 * @param {string} req.params.id - The unique ID of the account.
 * @param {Object} req.body - Contains account data to be partially updated.
 * @returns {Object} JSON response with the updated account data or error message.
 * @throws {Error} Returns error message if account update fails.
 */
router.patch("/account/:id", verifyToken, async (req, res) => {
  try {
    const updatedAccount = await AccountModel.findByIdAndUpdate(
      req.params.id,
      { $set: req.body }, // Only update fields in req.body
      { new: true } // Return the updated document
    );

    if (updatedAccount) {
      res.json({
        code: "0000",
        msg: "Account updated successfully",
        data: updatedAccount,
      });
    } else {
      res.json({
        code: "1004",
        msg: "Account not found",
      });
    }
  } catch (err) {
    res.status(500).json({
      code: "1003",
      msg: "Failed to update account",
    });
  }
});

/**
 * Calculates the total amount from a list of accounts.
 * @param {Array} accounts - List of accounts.
 * @returns {number} Total amount.
 */
function calculateTotalAmount(accounts) {
  return accounts.reduce((sum, account) => {
    return (
      sum +
      (account.positiveOrNegative === "positive"
        ? account.amount
        : -account.amount)
    );
  }, 0);
}

module.exports = router;
