const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userTypeSchema = new Schema({
  userType_id: { type: String, default: '' },
  userType: { type: String, default: '' },
  labInput: { type: Boolean, default: false },
  labAnalysis: { type: Boolean, default: false },
  labAdmin: { type: Boolean, default: false },
  stockUser: { type: Boolean, default: false },
  stockAdmin: { type: Boolean, default: false },
  hsImport: { type: Boolean, default: false },
  hsExport: { type: Boolean, default: false },
  hsAdmin: { type: Boolean, default: false },
  geologyImport: { type: Boolean, default: false },
  geologyExport: { type: Boolean, default: false },
  geologyAdmin: { type: Boolean, default: false },
  remark: { type: String, default: '' }
});

module.exports = UserType = mongoose.model("userTypes", userTypeSchema);