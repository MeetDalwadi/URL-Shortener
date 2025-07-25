const express = require("express");
const {
  handleGenerateNewSortURL,
  handleRediractURL,
  handleGetClick,
  handleGoToHome
} = require("../controllers/url");
const router = express.Router();

router.get("/", handleGoToHome);
router.post("/", handleGenerateNewSortURL);
router.get("/:shortID", handleRediractURL);
router.get("/analytics/:shortID", handleGetClick);

module.exports = router;
