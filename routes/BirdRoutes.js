const { requireLogin } = require("../middleware");
const mongoose = require("mongoose");
const User = mongoose.model("User");

module.exports = app => {
  app.get("/birds", requireLogin, async (req, res) => {
    const birds = await User.find({});
    const filtered = [];
    birds.forEach(bird => {
      if (String(bird._id) !== String(req.session.userId)) {
        return filtered.push(bird);
      }
    });
    return res.render("bird/index", { birds: filtered });
  });
};
