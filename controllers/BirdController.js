const mongoose = require("mongoose");
const Util = require("../util");
const User = mongoose.model("User");
const File = mongoose.model("File");

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

module.exports.PARAM_birdId = async (req, res, next, id) => {
  const bird = await User.findById(id);

  req.bird = bird;
  if (!req.bird) {
    return Util.error("user not found", next, 404);
  }
  return next();
};

module.exports.GET_birds_birdId_files = async (req, res) => {
  if (String(req.session.userId) === String(req.bird._id)) {
    return res.redirect("/files");
  }

  // get all public files
  const files = await File.find({ _user: req.bird._id, private: false }).select(
    {
      _id: true,
      originalName: true
    }
  );

  return res.render("bird/files", { files });
};
