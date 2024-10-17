/**
 * Middleware function to check if the user is authenticated via session.
 * If the user is authenticated, it proceeds to the next middleware or route handler.
 * If not, it redirects the user to the login page.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @param {Function} next - The next middleware function in the stack.
 * @returns {void} Calls next() if the user is authenticated, otherwise redirects to /login.
 */
module.exports = (req, res, next) => {
  if (req.session.user) {
    return next();
  }
  res.redirect("/login"); // Redirect to login if no session user is found
};
