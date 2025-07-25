const express = require("express");
const {
  handleGoToSignup,
  handleGoToLogin,
  handleSignup,
  handleLogin,
  handleVerifyOTP,
  handleResendOTP
} = require("../controllers/user.js");
const router = express.Router();

// Signup routes
router.route("/signup").get(handleGoToSignup).post(handleSignup);

// Login routes
router.route("/login").get(handleGoToLogin).post(handleLogin);

// OTP verification routes
router.post("/verify-otp", handleVerifyOTP);
router.post("/resend-otp", handleResendOTP);

// Logout route
router.post("/logout", (req, res) => {
  // Get the session ID from the cookie
  const sessionId = req.cookies.uid;
  if (sessionId) {
    // Remove the user from the session map
    const { removeUser } = require("../service/auth");
    removeUser(sessionId);
    // Clear the authentication cookie
    res.clearCookie("uid");
  }
  // Redirect to login page
  res.redirect("/user/login");
});

module.exports = router;
