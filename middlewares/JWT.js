const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY; // SECRET_KEY should be stored in environment variables

/**
 * Middleware function to verify the JWT token from the request header.
 * If valid, attaches the decoded user information to the request object and proceeds to the next middleware.
 * If invalid or missing, returns an error response.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @param {Function} next - The next middleware function in the stack.
 * @returns {void} Calls next() to proceed if the token is valid, otherwise sends an error response.
 */
function verifyToken(req, res, next) {
  let token = req.headers["authorization"]; // Get the token from the Authorization header

  if (!token) {
    return res.status(403).json({
      code: "1002",
      msg: "No token provided",
      data: null,
    });
  }

  // Check if the token starts with "Bearer " and remove this prefix
  if (token.startsWith("Bearer ")) {
    token = token.slice(7, token.length); // Remove "Bearer " part from the token
  } else {
    return res.status(401).json({
      code: "1003",
      msg: "Invalid token format",
      data: null,
    });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        code: "1003",
        msg: "Invalid token",
        data: null,
      });
    }

    req.user = decoded; // Attach the decoded user information to the request object
    next(); // Proceed to the next middleware or route handler
  });
}

module.exports = verifyToken;
