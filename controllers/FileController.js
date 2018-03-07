const path = require("path");
const mongoose = require("mongoose");
const File = mongoose.model("File");
const Util = require("../util");

module.exports.PARAM_fileID = async (req, res, next, id) => {
  try {
    req.file = await File.findById(id);
    if (!req.file) {
      return Util.error("File Not Found", next, 404);
    }
    return next();
  } catch (err) {
    return Util.error(err.message, next, err.status);
  }
};

module.exports.GET_files = async (req, res, next) => {
  try {
    const files = await File.find({ _user: req.session.userId });
    return res.render("file/index", { files });
  } catch (err) {
    return Util.error(err.message, next, err.status);
  }
};

module.exports.GET_files_upload = (req, res) => {
  return res.render("file/upload");
};

module.exports.POST_files_upload = async (req, res, next) => {
  try {
    const file = await File.create({
      _user: req.session.userId,
      originalName: req.file.originalname,
      path: `${req.file.filename}`,
      private: req.body.public === "on" ? false : true
    });

    return res.redirect("/files");
  } catch (err) {
    return Util.error(err.message, next, err.status);
  }
};

module.exports.GET_files_fileID = async (req, res, next) => {
  return res.sendFile(path.resolve(__dirname, "..", "store", req.file.path));
};
