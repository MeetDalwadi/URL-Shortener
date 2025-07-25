// ===== AUTH ROUTES =====
const express = require('express');
const { 
  handleSignup, 
  handleVerifyOTP, 
  handleResendOTP 
} = require('../controllers/auth');
const router = express.Router();

// Signup route
router.post('/signup', handleSignup);

// OTP verification route
router.post('/verify-otp', handleVerifyOTP);

// Resend OTP route
router.post('/resend-otp', handleResendOTP);

module.exports = router;
