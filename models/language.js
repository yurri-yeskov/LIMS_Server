const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let language = new Schema(
  {
    English: { type: String },
    German: { type: String },
    label: { type: String }
  },
  { collection: "language" }
);

module.exports = mongoose.model("language", language);