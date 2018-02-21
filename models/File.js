const mongoose = require("mongoose");
const { Schema } = mongoose;

const FileSchema = new Schema(
  {
    _user: { type: Schema.Types.ObjectId, ref: "User" },
    originalName: String,
    path: String
  },
  { timestamps: true }
);

module.exports = FileSchema;
