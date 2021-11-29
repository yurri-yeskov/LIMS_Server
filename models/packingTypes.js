const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const packingSchema = new Schema({
  packingType_id: { type: String },
  packingType: { type: String },
  remark: { type: String }
})

module.exports = Packings = mongoose.model("packingTypes", packingSchema);