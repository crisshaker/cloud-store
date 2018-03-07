const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = mongoose.model("User");
const Util = require("../util");
const { loggedOut, requireLogin } = require("../middleware");

module.exports = app => {
  app.get("/register", loggedOut, (req, res) => {
    return res.render("auth/register");
  });

  app.post("/register", loggedOut, async (req, res, next) => {
    const { email, password, confirmPassword } = req.body;

    if (!email.trim() || !password || !confirmPassword) {
      return Util.error("All fields required", next);
    }

    if (password !== confirmPassword) {
      return Util.error("Passwords do not match", next);
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return Util.error("Email taken", next);
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({ ...req.body, password: hash });
    req.session.userId = user._id;

    return res.redirect("/profile");
  });

  app.get("/login", loggedOut, (req, res) => {
    return res.render("auth/login");
  });

  app.post("/login", async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return Util.error("All fields required", next);
    }

    const user = await User.findOne({ email });
    if (!user) {
      return Util.error("Invalid email", next);
    }
    user.authenticate(password, (err, matching) => {
      if (err) return Util.error(err.message, next);

      if (!matching) {
        return Util.error("Wrong Password", next);
      }

      req.session.userId = user._id;
      return res.redirect("/profile");
    });
  });

  app.get("/logout", requireLogin, async (req, res) => {
    await req.session.destroy();
    return res.redirect("/");
  });
};
