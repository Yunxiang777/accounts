var express = require("express");
var router = express.Router();
var AccountModel = require("../../models/AccoutModel");
const isAuthenticated = require("../../middlewares/isAuthenticated");

/**
 * @route GET /account
 * @description Get the list of accounts, sorted by date in descending order, and calculate the total amount.
 * @access Private
 */
router.get("/account", isAuthenticated, async (req, res) => {
  try {
    const accounts = await AccountModel.find().sort({ date: -1 });

    // Calculate the total amount
    const totalAmount = accounts.reduce((sum, account) => {
      return (
        sum +
        (account.positiveOrNegative === "positive"
          ? account.amount
          : -account.amount)
      );
    }, 0);

    res.render("list", { accounts, totalAmount });
  } catch (err) {
    handleError(res, "Failed to retrieve accounts", err);
  }
});

/**
 * @route DELETE /account/delete/:id
 * @description Delete an account by ID
 * @access Private
 */
router.delete("/account/delete/:id", isAuthenticated, async (req, res) => {
  try {
    const accountId = req.params.id;
    const result = await AccountModel.deleteOne({ _id: accountId });

    if (result.deletedCount > 0) {
      res.json({ message: "Deletion successful" });
    } else {
      res.status(404).json({ message: "Account not found" });
    }
  } catch (err) {
    handleError(res, "Failed to delete account", err);
  }
});

/**
 * @route GET /
 * @description Redirect to the account listing page
 * @access Private
 */
router.get("/", isAuthenticated, (req, res) => {
  res.redirect("account");
});

/**
 * @route GET /account/create
 * @description Render the account creation page
 * @access Private
 */
router.get("/account/create", isAuthenticated, (req, res) => {
  res.render("create");
});

/**
 * @route POST /account/create
 * @description Add a new account entry
 * @access Private
 */
router.post("/account/create", isAuthenticated, async (req, res) => {
  try {
    await AccountModel.create({
      description: req.body.description,
      amount: parseInt(req.body.amount, 10),
      date: req.body.date,
      positiveOrNegative: req.body.positiveOrNegative,
    });
    res.redirect("/account");
  } catch (err) {
    handleError(res, "Failed to create account", err);
  }
});

/**
 * General error handling function
 * @param {Object} res - Express response object
 * @param {string} message - Error message to be displayed
 * @param {Error} err - Caught error object
 */
function handleError(res, message, err) {
  console.error(`${message}. Error details:`, err);
  res.status(500).render("busy");
}

module.exports = router;
