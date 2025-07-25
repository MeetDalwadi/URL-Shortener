/**
 * Email Configuration Template
 * 
 * This is a template file. Copy this file to email.config.js and fill in your actual email credentials.
 * The email.config.js file will be ignored by git to keep your credentials secure.
 */

const emailConfig = {
  // Email service provider (gmail, outlook, etc.)
  service: 'gmail', // Change to your email service provider
  
  // Authentication credentials
  auth: {
    user: 'your-email@gmail.com', // Replace with your actual email address
    pass: 'your-app-password',    // Replace with your app password (not regular password)
  },
  
  // Sender details
  from: {
    name: 'URL Shortener',
    email: 'your-email@gmail.com' // Should match the auth.user above
  }
};

module.exports = emailConfig;
