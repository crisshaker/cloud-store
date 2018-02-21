const express = require("express");
const pug = require("pug");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const bodyParser = require("body-parser");
const keys = require("./config/keys");

const app = express();

// serve static files
app.use(express.static(__dirname + "/public"));

// connect to Database
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://127.0.0.1:27017/cloud-store");
const db = mongoose.connection;
db.on("error", () => console.log("Error: Database connection failed"));
db.on("open", () => console.log("Success: Connected to Database"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.set("view engine", "pug");
app.set("views", __dirname + "/views");

app.use(
  session({
    secret: keys.sessionSecret,
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({
      mongooseConnection: db
    })
  })
);

app.use((req, res, next) => {
  if (req.session.userId) {
    res.locals.user = req.session.userId;
    return next();
  }

  return next();
});

require("./models");
require("./routes")(app);

app.use((req, res, next) => {
  const err = new Error("ooops.... not found");
  err.status = 404;
  return next(err);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  return res.render("error", { error });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`the server is running on PORT ${PORT}`));
