module.exports = app => {
  require("./AuthRoutes")(app);
  require("./MainRoutes")(app);
  require("./FileRoutes")(app);
  require("./BirdRoutes")(app);
};
