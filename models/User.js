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

UserSchema.methods.authenticate = function(candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, function(err, matching) {
    if (err) return callback(err);
    return callback(null, matching);
  });
};

module.exports = UserSchema;
