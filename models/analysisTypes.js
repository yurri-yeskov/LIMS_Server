const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let analysisType = new Schema(
  {
    analysisType: { type: String },
    norm: { type: String },
    objectives: { type: Array },
    remark: { type: String }
  },
  { collection: "analysisTypes" }
);

module.exports = mongoose.model("analysisTypes", analysisType);