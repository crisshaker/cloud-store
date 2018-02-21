const mongoose = require("mongoose");
const User = mongoose.model("User");
const { requireLogin, loggedOut } = require("../middleware");

module.exports = app => {
  app.get("/", loggedOut, (req, res) => {
    return res.render("index");
  });

  app.get("/profile", requireLogin, async (req, res) => {
    const user = await User.findById(req.session.userId).select({
      email: true
    });

    res.render("profile", { user });
  });
};
