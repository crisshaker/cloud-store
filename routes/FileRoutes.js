const path = require("path");
const multer = require("multer");
const { requireLogin, hasAccess } = require("../middleware");
const {
  PARAM_fileID,
  GET_files,
  GET_files_fileID,
  GET_files_upload,
  POST_files_upload
} = require("../controllers/FileController");

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
  app.param("fileID", PARAM_fileID);
  app.get("/files", requireLogin, GET_files);
  app.get("/files/upload", requireLogin, GET_files_upload);
  app.post(
    "/files/upload",
    requireLogin,
    upload.single("file"),
    POST_files_upload
  );
  app.get("/files/:fileID/", requireLogin, hasAccess, GET_files_fileID);
};
