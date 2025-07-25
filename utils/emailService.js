// ===== EMAIL UTILITY =====
const nodemailer = require('nodemailer');
const emailConfig = require('../config/email.config');

// Configure email transporter for sending real emails
const createTransporter = async () => {
  try {
    // Use configuration from the email.config.js file
    let transporter = nodemailer.createTransport({
      service: emailConfig.service,
      auth: emailConfig.auth
    });
    
    return transporter;
  } catch (error) {
    console.error('Error creating email transporter:', error);
    throw error;
  }
};

// Send an email with OTP
const sendOTPEmail = async (email, otp) => {
  try {
    const transporter = await createTransporter();
    
    // Send mail with defined transport object
    const info = await transporter.sendMail({
      from: `"${emailConfig.from.name}" <${emailConfig.from.email}>`,
      to: email,
      subject: 'Email Verification OTP',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <h2 style="color: #4a4a4a;">Verify your email address</h2>
          <p>Thank you for signing up for URL Shortener! Please use the following OTP (One Time Password) to verify your email address:</p>
          <div style="background-color: #f7f7f7; padding: 15px; border-radius: 5px; text-align: center; margin: 20px 0;">
            <h1 style="margin: 0; color: #2c7be5; letter-spacing: 2px;">${otp}</h1>
          </div>
          <p>This OTP is valid for 10 minutes. If you didn't request this, please ignore this email.</p>
          <p>Best regards,<br>The URL Shortener Team</p>
        </div>
      `
    });
    
    return { 
      success: true, 
      messageId: info.messageId
    };
  } catch (error) {
    console.error('Error sending email:', error);
    return { 
      success: false, 
      error: error.message 
    };
  }
};

module.exports = {
  sendOTPEmail
};
