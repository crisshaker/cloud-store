const { loggedOut, requireLogin } = require("../middleware");
const {
  GET_register,
  POST_register,
  GET_login,
  POST_login,
  GET_logout
} = require("../controllers/AuthController");

module.exports = app => {
  app.get("/register", loggedOut, GET_register);
  app.post("/register", loggedOut, POST_register);
  app.get("/login", loggedOut, GET_login);
  app.post("/login", POST_login);
  app.get("/logout", requireLogin, GET_logout);
};
