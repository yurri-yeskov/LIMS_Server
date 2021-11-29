const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const sampleType = new Schema({
  sampleType_id: { type: String, default: '' },
  sampleType: { type: String, default: '' },
  stockSample: { type: Boolean, default: false },
  material: { type: Boolean, default: false },
  client: { type: Boolean, default: false },
  packingType: { type: Boolean, default: false },
  dueDate: { type: Boolean, default: false },
  sampleDate: { type: Boolean, default: false },
  sendingDate: { type: Boolean, default: false },
  analysisType: { type: Boolean, default: false },
  incomingProduct: { type: Boolean, default: false },
  distributor: { type: Boolean, default: false },
  certificateType: { type: Boolean, default: false },
  remark: { type: String, default: '' },
});

module.exports = mongoose.model("sampleTypes", sampleType);
