module.exports.requireLogin = (req, res, next) => {
  if (!req.session.userId) {
    return res.redirect("/login");
  }

  return next();
};

module.exports.loggedOut = (req, res, next) => {
  if (req.session.userId) {
    return res.redirect("/profile");
  }

  return next();
};

module.exports.ownsFile = (req, res, next) => {
  if (String(req.file._user) !== String(req.session.userId)) {
    const error = new Error("Access Denied");
    error.status = 403;
    return next(error);
  }

  return next();
};

module.exports.hasAccess = (req, res, next) => {
  if (
    !req.file.private ||
    String(req.file._user) === String(req.session.userId)
  ) {
    return next();
  }
  const error = new Error("Access Denied");
  error.status = 403;
  return next(error);
};
