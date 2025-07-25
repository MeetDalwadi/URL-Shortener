const express = require("express");
const { handleViewPage, handleVerifyOTPPage } = require("../controllers/view.js");
const router = express.Router();

router.route("/").get(handleViewPage).post(handleViewPage);
router.get("/verify-otp", handleVerifyOTPPage);

module.exports = router;
