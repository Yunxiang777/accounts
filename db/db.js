const mongoose = require("mongoose");
const config = require("config");

const dbUrl = config.get("mongoURI");
const maxRetries = config.get("dbMaxRetries") || 5;
const retryInterval = config.get("dbRetryInterval") || 5000;

/**
 * Connect to MongoDB with retry mechanism.
 * This function attempts to connect to the MongoDB database and retries
 * the connection if it fails, based on the provided retry count and interval.
 *
 * @param {number} retries - Remaining retry attempts.
 */
const connectDB = async (retries = maxRetries) => {
  try {
    await mongoose.connect(dbUrl);
  } catch (err) {
    if (retries > 0) {
      console.log(
        `Retrying MongoDB connection... Remaining attempts: ${retries}`
      );
      setTimeout(() => connectDB(retries - 1), retryInterval);
    } else {
      // Log failure and exit the application if retries are exhausted
      console.error(
        "Failed to connect to MongoDB after multiple attempts, exiting application"
      );
      process.exit(1);
    }
  }
};

module.exports = connectDB;
