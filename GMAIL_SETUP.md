# Setting Up Gmail for Your URL Shortener

To use your Gmail account with this URL Shortener application, follow these steps:

## 1. Update Email Configuration

Edit the `config/email.config.js` file with your Gmail credentials:

```javascript
const emailConfig = {
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com',  // Your Gmail address
    pass: 'your-app-password'      // Your App Password (not your regular Gmail password)
  },
  from: {
    name: 'URL Shortener',
    email: 'your-email@gmail.com'  // Same as auth.user
  }
};
```

## 2. Create an App Password for Gmail

For security reasons, Gmail requires you to use an "App Password" instead of your regular password:

1. Go to your Google Account settings: https://myaccount.google.com/
2. Click on "Security" in the left sidebar
3. Under "Signing in to Google," click on "2-Step Verification" (enable it if not already enabled)
4. Scroll down and click on "App passwords"
5. Select "Mail" as the app and "Other" as the device
6. Enter "URL Shortener" as the name
7. Click "Create" to generate an app password
8. Copy the 16-character password that appears
9. Use this password in your `email.config.js` file

## 3. Enable "Less Secure App Access" (Alternative Method)

If you don't want to use App Passwords, you can enable "Less Secure App Access":

1. Go to https://myaccount.google.com/lesssecureapps
2. Turn on "Allow less secure apps"
3. Use your regular Gmail password in the configuration file

**Note:** This method is less secure and Google may disable it in the future.

## 4. Common Email Issues and Solutions

### Email Not Sending

If emails are not being sent:

1. Check your console for error messages
2. Verify your email and password are correct
3. Make sure your Gmail account has 2-Step Verification enabled and you're using an App Password
4. Check if your Gmail account has exceeded sending limits

### Gmail Sending Limits

Gmail has the following sending limits:
- Free Gmail accounts: 500 emails per day
- Google Workspace accounts: 2,000 emails per day

For production use with many users, consider a dedicated email service like SendGrid or Mailgun.

## 5. Production Email Services

For production environments, consider using a dedicated email service:

### SendGrid Configuration Example

```javascript
const emailConfig = {
  // Using SendGrid API
  host: 'smtp.sendgrid.net',
  port: 587,
  secure: false,
  auth: {
    user: 'apikey',
    pass: 'YOUR_SENDGRID_API_KEY'
  },
  from: {
    name: 'URL Shortener',
    email: 'your-verified-sender@domain.com'
  }
};
```

### Mailgun Configuration Example

```javascript
const emailConfig = {
  host: 'smtp.mailgun.org',
  port: 587,
  secure: false,
  auth: {
    user: 'postmaster@your-domain.mailgun.org',
    pass: 'YOUR_MAILGUN_PASSWORD'
  },
  from: {
    name: 'URL Shortener',
    email: 'mailgun@your-domain.com'
  }
};
```
