// ===== AUTH CONTROLLER =====
const User = require("../models/user");
const { sendOTPEmail } = require("../utils/emailService");
const { v4: uuidv4 } = require("uuid");
const { setUser } = require("../service/auth");

/**
 * Handle user signup
 */
const handleSignup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.render("signup", {
        error: "All fields are required",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      // If user exists but is not verified, allow resending OTP
      if (!existingUser.verified) {
        return sendOTPAndRedirect(existingUser, res);
      }
      return res.render("signup", {
        error: "User with this email already exists. Please login.",
      });
    }

    // Create new user
    const newUser = await User.create({
      name,
      email,
      password, // In production, you should hash the password
      verified: false,
    });

    // Send OTP and redirect
    return sendOTPAndRedirect(newUser, res);
  } catch (error) {
    console.error("Signup error:", error);
    return res.render("signup", {
      error: "An error occurred during signup. Please try again.",
    });
  }
};

/**
 * Handle OTP verification
 */
const handleVerifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Validation
    if (!email || !otp) {
      return res.render("verify-otp", {
        email: email || "",
        error: "Both email and verification code are required",
      });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.render("verify-otp", {
        email: email,
        error: "No account found with this email address",
      });
    }

    // Check if OTP exists
    if (!user.otp || !user.otp.code) {
      return res.render("verify-otp", {
        email: email,
        error: "No OTP found. Please request a new one.",
      });
    }

    // Check if OTP is valid
    if (user.otp.code !== otp) {
      return res.render("verify-otp", {
        email: email,
        error: "Invalid OTP. Please try again.",
      });
    }

    // Check if OTP is expired
    if (new Date() > user.otp.expiry) {
      return res.render("verify-otp", {
        email: email,
        error: "OTP has expired. Please request a new one.",
      });
    }

    // Mark user as verified
    user.verified = true;
    user.otp = undefined; // Clear OTP
    await user.save();

    // Store user in session and set cookie
    const sessionId = uuidv4();
    setUser(sessionId, user);
    res.cookie("uid", sessionId);

    // Redirect to home page
    return res.redirect("/");
  } catch (error) {
    console.error("OTP verification error:", error);
    return res.render("verify-otp", {
      email: req.body.email || "",
      error: "An error occurred during verification. Please try again.",
    });
  }
};

/**
 * Handle resending OTP
 */
const handleResendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    // Validation
    if (!email) {
      return res.render("verify-otp", {
        email: "",
        error: "Email is required to resend OTP",
      });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.render("verify-otp", {
        email: email,
        error: "No user found with this email",
      });
    }

    // Send OTP and redirect
    return sendOTPAndRedirect(user, res);
  } catch (error) {
    console.error("Resend OTP error:", error);
    return res.render("verify-otp", {
      email: req.body.email || "",
      error: "An error occurred while resending OTP. Please try again.",
    });
  }
};

/**
 * Helper function to generate OTP, update user and send email
 */
const sendOTPAndRedirect = async (user, res) => {
  // Generate a random 6-digit OTP (between 100000 and 999999)
  // Using Math.random() is simple but for production, consider a more secure method
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Set OTP expiry time (10 minutes)
  const expiry = new Date();
  expiry.setMinutes(expiry.getMinutes() + 10);

  // Update user with OTP
  user.otp = {
    code: otp,
    expiry: expiry,
  };
  await user.save();

  // Send OTP email
  const emailResult = await sendOTPEmail(user.email, otp);
  if (!emailResult.success) {
    return res.render("signup", {
      error: "Failed to send OTP email. Please try again.",
    });
  }

  // Redirect to OTP verification page
  return res.redirect(`/verify-otp?email=${encodeURIComponent(user.email)}`);
};

module.exports = {
  handleSignup,
  handleVerifyOTP,
  handleResendOTP,
};
