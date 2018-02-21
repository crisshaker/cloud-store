const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { Schema } = mongoose;

const UserSchema = new Schema({
  email: {
    type: String,
    lowercase: true,
    unique: true,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  }
});

UserSchema.pre("save", function(next) {
  const user = this;
  bcrypt.hash(user.password, 10, function(err, hash) {
    if (err) return next(err);
    user.password = hash;
    return next();
  });
});

UserSchema.methods.authenticate = function(candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, function(err, matching) {
    if (err) return callback(err);
    return callback(null, matching);
  });
};

module.exports = UserSchema;
