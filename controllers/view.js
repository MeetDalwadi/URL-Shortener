const handleViewPage = (req, res) => {
  return res.render("index");
};

const handleVerifyOTPPage = (req, res) => {
  const { email } = req.query;
  
  return res.render("verify-otp", { 
    email: email || '',
    error: null
  });
};

module.exports = {
  handleViewPage,
  handleVerifyOTPPage
};
