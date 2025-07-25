# Deployment Guide for Vercel

This guide will help you deploy your URL Shortener application to Vercel.

## Prerequisites

1. A Vercel account (sign up at https://vercel.com)
2. A MongoDB Atlas account for cloud database (https://www.mongodb.com/cloud/atlas)
3. Your email configuration (Gmail app password)

## Step 1: Database Setup

### MongoDB Atlas Setup:
1. Go to https://mongodb.com/cloud/atlas
2. Create a new cluster (free tier is sufficient)
3. Create a database user with read/write permissions
4. Whitelist your IP address (or use 0.0.0.0/0 for all IPs)
5. Get your connection string, it should look like:
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/url_shortener?retryWrites=true&w=majority
   ```

## Step 2: Environment Variables Setup

### In Vercel Dashboard:
1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add the following variables:

```
NODE_ENV=production
BASE_URL=https://your-app-name.vercel.app
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/url_shortener?retryWrites=true&w=majority
SESSION_SECRET=your-super-secret-session-key-change-this-in-production-make-it-long-and-random
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password
EMAIL_FROM_NAME=URL Shortener
EMAIL_FROM_EMAIL=your-email@gmail.com
COOKIE_SECURE=true
```

### Important Notes:
- Replace `your-app-name` with your actual Vercel app name
- Use a strong, random SESSION_SECRET (you can generate one online)
- EMAIL_PASS should be your Gmail app password, not your regular password

## Step 3: Gmail App Password Setup

1. Enable 2-Factor Authentication on your Gmail account
2. Go to Google Account settings
3. Navigate to Security > App passwords
4. Generate a new app password for "Mail"
5. Use this app password in the EMAIL_PASS environment variable

## Step 4: Deploy to Vercel

### Option 1: Deploy via Vercel CLI
```bash
npm install -g vercel
vercel login
vercel --prod
```

### Option 2: Deploy via GitHub (Recommended)
1. Push your code to GitHub
2. Connect your GitHub repository to Vercel
3. Vercel will automatically deploy when you push to main/master

## Step 5: Post-Deployment

1. Update your BASE_URL in Vercel environment variables to match your actual domain
2. Test all features:
   - User registration
   - Email verification
   - URL shortening
   - URL redirection
   - Analytics

## Troubleshooting

### Common Issues:

1. **MongoDB Connection Error:**
   - Check your MONGODB_URI format
   - Ensure IP whitelist includes 0.0.0.0/0 or Vercel's IPs
   - Verify username/password in connection string

2. **Email Not Sending:**
   - Verify Gmail app password is correct
   - Check EMAIL_USER and EMAIL_PASS variables
   - Ensure 2FA is enabled on Gmail

3. **Session Issues:**
   - Make sure SESSION_SECRET is set and unique
   - Verify COOKIE_SECURE is set to true in production

4. **URL Generation Issues:**
   - Ensure BASE_URL matches your Vercel domain exactly
   - Check that the domain includes https://

### Environment Variables Checklist:
- [ ] NODE_ENV=production
- [ ] BASE_URL (matches your Vercel domain)
- [ ] MONGODB_URI (valid MongoDB Atlas connection string)
- [ ] SESSION_SECRET (long, random string)
- [ ] EMAIL_USER (your Gmail address)
- [ ] EMAIL_PASS (Gmail app password, not regular password)
- [ ] EMAIL_FROM_NAME
- [ ] EMAIL_FROM_EMAIL
- [ ] COOKIE_SECURE=true

## File Structure Changes Made

- ✅ Added `.env.example` with template variables
- ✅ Added `.env` for local development
- ✅ Created `vercel.json` for Vercel configuration
- ✅ Updated `package.json` with proper scripts and engines
- ✅ Modified `index.js` to use environment variables
- ✅ Updated `email.config.js` to use environment variables
- ✅ Modified `home.ejs` to use dynamic BASE_URL
- ✅ Added `.gitignore` to exclude sensitive files

## Security Notes

- Never commit `.env` files to git
- Use strong, unique SESSION_SECRET
- Keep EMAIL_PASS secure (use app passwords)
- Set COOKIE_SECURE=true in production
- Regularly rotate secrets and passwords
