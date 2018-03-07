const { requireLogin } = require("../middleware");
const {
  GET_birds,
  GET_birds_birdId_files,
  PARAM_birdId
} = require("../controllers/BirdController");

module.exports = app => {
  app.param("birdId", PARAM_birdId);
  app.get("/birds", requireLogin, GET_birds);
  app.get("/birds/:birdId/files", requireLogin, GET_birds_birdId_files);
};
