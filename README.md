# URL Shortener Service

A practical URL shortening service built with Node.js, Express, and MongoDB that demonstrates advanced concepts like URL routing, redirection, and click analytics tracking.

## 🚀 Deploy to Vercel

This project is ready for deployment! See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for complete instructions on deploying to Vercel.

## What's in this Project?

This project implements a complete URL shortening service similar to Bitly or TinyURL with these features:

- User signup with email verification via OTP
- Secure authentication system
- Generate short, unique IDs for long URLs
- Redirect users from short URLs to original destinations
- Track and analyze click statistics for each short URL
- Store URL mappings and analytics data in MongoDB

## Project Structure

- **index.js**: Main application file that sets up Express server and routes
- **models/url.js**: Defines the MongoDB schema for URL storage
- **controllers/url.js**: Contains the business logic for URL operations
- **routes/url.js**: Defines the API endpoints
- **connection.js**: Handles MongoDB connection setup

## Key Concepts Demonstrated

### 1. URL Shortening Logic
- Using the `shortid` package to generate unique, compact URL identifiers
- Creating a mapping between short IDs and original URLs in MongoDB

### 2. Redirection System
- HTTP 302 redirects from short URLs to original destinations
- Handling visits to ensure proper redirection

### 3. Analytics Tracking
- Recording timestamp data for each visit to a short URL
- Providing analytics endpoints to retrieve usage statistics

### 4. MongoDB Integration
- Schema design with Mongoose for URL data
- Document structure with embedded visit history

## API Endpoints

### 1. Create a Short URL

**Endpoint:** `POST /url`

**Request Body:**
```json
{
  "url": "https://example.com/very/long/url/that/you/want/to/shorten"
}
```

**Response:**
```json
{
  "id": "abc123",
  "shortUrl": "http://localhost:8000/url/abc123",
  "originalUrl": "https://example.com/very/long/url/that/you/want/to/shorten"
}
```

### 2. Access a Short URL

**Endpoint:** `GET /url/:shortId`

This will redirect you to the original URL.

### 3. Get URL Analytics

**Endpoint:** `GET /url/analytics/:shortId`

**Response:**
```json
{
  "totalClicks": 5,
  "analytics": [
    { "timestamp": 1687828492000 },
    { "timestamp": 1687828495000 },
    { "timestamp": 1687828498000 },
    { "timestamp": 1687828501000 },
    { "timestamp": 1687828504000 }
  ]
}
```

## Email Verification System

This project implements a secure email verification system using one-time passwords (OTP):

### 1. User Registration Flow

1. User signs up with name, email and password
2. System generates a 6-digit OTP and sends it to the user's email
3. User is redirected to the OTP verification page
4. User enters the OTP received in their email
5. If verified successfully, user can access URL shortening features

### 2. Email Service

- Uses Nodemailer for sending emails
- In development, uses Ethereal Email (a fake SMTP service) for testing
- **IMPORTANT**: In development, no real emails are sent. Instead:
  - A preview URL is displayed on the OTP verification page
  - The preview URL is also logged in the console
  - Click the preview URL to see the email with your OTP
- Can be configured for production email services by updating the email transport configuration

### 3. OTP Verification Features

- 6-digit numeric OTP
- 10-minute expiration period
- Option to resend OTP if expired
- Secure verification process

## How to Use

1. Install dependencies:
   ```
   npm install
   ```
   
2. Make sure MongoDB is running locally

3. Start the server:
   ```
   npm start
   ```

4. Access the signup page:
   ```
   http://localhost:8000/user/signup
   ```

4. Create a short URL by sending a POST request:
   ```
   curl -X POST http://localhost:8000/url \
     -H "Content-Type: application/json" \
     -d '{"url": "https://example.com/long/url"}'
   ```

5. Use the returned short URL to access the original URL

6. View analytics by accessing:
   ```
   curl http://localhost:8000/url/analytics/YOUR_SHORT_ID
   ```

## Common Issues and Solutions

### 404 Error When Creating URLs
If you encounter a 404 error, check:
- You're sending a POST request to `/url` (not `/`)
- Your request includes the Content-Type header set to `application/json`
- The request body contains a `url` property: `{"url": "https://example.com"}`

### Database Connection Issues
- Ensure MongoDB is running on port 27017
- Check the connection string in index.js
