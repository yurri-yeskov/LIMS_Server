const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let certificateType = new Schema(
  {
    material: { type: String },
    client: { type: String },
    certificateType: { type: String },
    analysises: { type: Array },
    packing: { type: String },
    remark: { type: String }
  },
  { collection: "certificateTypes" }
);

module.exports = mongoose.model("certificateTypes", certificateType);