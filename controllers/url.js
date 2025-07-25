const shortid = require("shortid");
const URL = require("../models/url");

const handleGoToHome = async (req, res) => {
  const allUrls = await URL.find({ createdBy: req.user._id });
  return res.render("home", {
    urls: allUrls,
    user: req.user
  });
};

const handleGenerateNewSortURL = async (req, res) => {
  const body = req.body;
  if (!body.url) return res.status(400).json({ error: "URL is required" });

  const shortID = shortid.generate();
  await URL.create({
    shortID: shortID,
    redirectURL: body.url,
    visitHistory: [],
    createdBy: req.user._id,
  });
  
  // Get all URLs for the user to display on the home page
  const allUrls = await URL.find({ createdBy: req.user._id });
  
  return res.render("home", { 
    id: shortID,
    urls: allUrls,
    user: req.user
  });
};

const handleRediractURL = async (req, res) => {
  const shortID = req.params.shortID;
  const user = await URL.findOneAndUpdate(
    { shortID },
    {
      $push: {
        visitHistory: {
          timestamp: Date.now(),
        },
      },
    }
  );
  res.redirect(user.redirectURL);
};

const handleGetClick = async (req, res) => {
  const shortID = req.params.shortID;
  const user = await URL.findOne({ shortID });
  return res.json({
    totalClicks: user.visitHistory.length,
    analytics: user.visitHistory,
  });
};

module.exports = {
  handleGenerateNewSortURL,
  handleRediractURL,
  handleGetClick,
  handleGoToHome,
};
