const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let packingType = new Schema(
  {
    packingType_id: { type: String },
    packingType: { type: String },
    remark: { type: String }
  },
  { collection: "packingTypes" }
);

module.exports = mongoose.model("packingTypes", packingType);