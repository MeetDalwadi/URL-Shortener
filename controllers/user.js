const { v4: uuidv4 } = require("uuid");
const User = require("../models/user.js");
const { setUser } = require("../service/auth.js");

const handleGoToSignup = (req, res) => {
  return res.render("signup");
};

const handleGoToLogin = (req, res) => {
  return res.render("login", {
    error: null,
  });
};

const { sendOTPEmail } = require("../utils/emailService");

const handleSignup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      if (!existingUser.verified) {
        // If user exists but not verified, generate new OTP
        return generateAndSendOTP(existingUser, res);
      }
      return res.render("signup", {
        error: "Email already registered. Please login."
      });
    }
    
    // Create new user
    const newUser = await User.create({
      name,
      email,
      password, // In production, hash the password using bcrypt
      verified: false
    });
    
    // Generate and send OTP
    return generateAndSendOTP(newUser, res);
  } catch (error) {
    console.error("Signup error:", error);
    return res.render("signup", {
      error: "An error occurred during signup"
    });
  }
};

const handleLogin = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email, password });
  if (!user) {
    return res.render("login", {
      error: "Invalid Email or Password",
    });
  } else {
    // Check if user email is verified
    if (!user.verified) {
      return res.render("login", {
        error: "Email not verified. Please verify your email.",
      });
    }
    
    // Create session and set cookie
    const sessionId = uuidv4();
    setUser(sessionId, user);
    res.cookie("uid", sessionId);
    
    // Redirect to URL page
    return res.redirect("/url");
  }
};

// Generate a random 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Generate OTP, save it to user record, and send email
const generateAndSendOTP = async (user, res) => {
  try {
    // Generate OTP
    const otp = generateOTP();
    
    // Set OTP expiry time (10 minutes)
    const expiry = new Date();
    expiry.setMinutes(expiry.getMinutes() + 10);
    
    // Update user with OTP
    user.otp = {
      code: otp,
      expiry: expiry
    };
    await user.save();
    
    // Send OTP email
    const emailSent = await sendOTPEmail(user.email, otp);
    if (!emailSent) {
      return res.render("signup", {
        error: "Failed to send verification email. Please try again."
      });
    }
    
    // Redirect to OTP verification page
    return res.render("verify-otp", { 
      email: user.email,
      error: null
    });
  } catch (error) {
    console.error("OTP generation error:", error);
    return res.render("signup", {
      error: "An error occurred during signup"
    });
  }
};

// Handle OTP verification
const handleVerifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.render("verify-otp", { 
        email,
        error: "User not found" 
      });
    }
    
    // Check if OTP is valid
    if (!user.otp || user.otp.code !== otp) {
      return res.render("verify-otp", { 
        email,
        error: "Invalid OTP. Please try again." 
      });
    }
    
    // Check if OTP is expired
    if (new Date() > new Date(user.otp.expiry)) {
      return res.render("verify-otp", { 
        email,
        error: "OTP has expired. Please request a new one." 
      });
    }
    
    // Mark user as verified
    user.verified = true;
    user.otp = undefined; // Clear OTP
    await user.save();
    
    // Generate session and redirect to home
    const sessionId = uuidv4();
    setUser(sessionId, user);
    res.cookie("uid", sessionId);
    
    return res.redirect("/");
  } catch (error) {
    console.error("OTP verification error:", error);
    return res.render("verify-otp", { 
      email: req.body.email,
      error: "An error occurred during verification" 
    });
  }
};

// Handle resend OTP
const handleResendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.render("verify-otp", { 
        email,
        error: "User not found" 
      });
    }
    
    // Generate and send new OTP
    return generateAndSendOTP(user, res);
  } catch (error) {
    console.error("Resend OTP error:", error);
    return res.render("verify-otp", { 
      email: req.body.email,
      error: "Failed to resend OTP" 
    });
  }
};

module.exports = {
  handleSignup,
  handleGoToSignup,
  handleGoToLogin,
  handleLogin,
  handleVerifyOTP,
  handleResendOTP
};
