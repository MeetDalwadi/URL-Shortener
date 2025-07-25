const express = require("express");
require('dotenv').config();

// Environment validation
const { checkEnvironment } = require('./utils/envCheck');
checkEnvironment();

const app = express();
const port = process.env.PORT || 8000;
const path = require("path");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const urlRoute = require("./routes/url");
const userRoute = require("./routes/user");
const authRoute = require("./routes/auth");
const staticRouter = require("./routes/staticRouter");
const { connectMongoDb } = require("./connection");
const { restrictToLoggedinUserOnly } = require("./middlewares/auth.js");

// Connect to MongoDB
connectMongoDb(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/learning-SortURL")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(`MongoDB Error: ${err}`));

// View engine setup
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET || 'urlShortenerSecret',
  resave: false,
  saveUninitialized: true,
  cookie: { 
    secure: process.env.NODE_ENV === 'production', 
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Make BASE_URL available to all views
app.use((req, res, next) => {
  res.locals.baseUrl = process.env.BASE_URL || `http://localhost:${port}`;
  next();
});

// Routes
app.use("/", staticRouter);
app.use("/user", userRoute);
app.use("/auth", authRoute);
app.use("/url", restrictToLoggedinUserOnly, urlRoute);

// Start server
app.listen(port, () => {
  console.log(`Server started at \n${process.env.BASE_URL || `http://localhost:${port}`}`);
});
