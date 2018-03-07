const mongoose = require("mongoose");
const User = mongoose.model("User");

module.exports.GET_birds = async (req, res) => {
  const birds = await User.find({});
  const filtered = [];
  birds.forEach(bird => {
    if (String(bird._id) !== String(req.session.userId)) {
      return filtered.push(bird);
    }
  });
  return res.render("bird/index", { birds: filtered });
};
