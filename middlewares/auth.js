const { getUser } = require("../service/auth.js");

const restrictToLoggedinUserOnly = async (req, res, next) => {
  const userId = req.cookies.uid;
  if (!userId) {
    return res.redirect("/user/login");
  }
  const user = getUser(userId);
  if (!user) {
    return res.redirect("/user/login");
  }
  req.user = user;
  next();
};

module.exports = {
  restrictToLoggedinUserOnly,
};
