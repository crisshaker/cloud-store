const { requireLogin } = require("../middleware");
const { GET_birds } = require("../controllers/BirdController");

module.exports = app => {
  app.get("/birds", requireLogin, GET_birds);
};
