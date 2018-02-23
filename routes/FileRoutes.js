const path = require("path");
const mongoose = require("mongoose");
const File = mongoose.model("File");
const multer = require("multer");
const { requireLogin, hasAccess } = require("../middleware");
const Util = require("../util");

const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}${path.extname(file.originalname)}`);
  },
  destination: (req, file, cb) => {
    cb(null, path.resolve(__dirname, "..", "store"));
  }
});

const upload = multer({
  storage
});

module.exports = app => {
  app.param("fileID", async (req, res, next, id) => {
    try {
      req.file = await File.findById(id);
      if (!req.file) {
        return Util.error("File Not Found", next, 404);
      }
      return next();
    } catch (err) {
      return Util.error(err.message, next, err.status);
    }
  });

  app.get("/files", requireLogin, async (req, res, next) => {
    try {
      const files = await File.find({ _user: req.session.userId });
      return res.render("file/index", { files });
    } catch (err) {
      return Util.error(err.message, next, err.status);
    }
  });

  app.get("/files/upload", requireLogin, (req, res) => {
    return res.render("file/upload");
  });

  app.post(
    "/files/upload",
    requireLogin,
    upload.single("file"),
    async (req, res, next) => {
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
    }
  );

  app.get(
    "/files/:fileID/",
    requireLogin,
    hasAccess,
    async (req, res, next) => {
      return res.sendFile(
        path.resolve(__dirname, "..", "store", req.file.path)
      );
    }
  );
};
