const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const reasonSchema = new Schema({
  reason_id: { type: String },
  reason: { type: String },
  remark: { type: String },
});

module.exports = Reason = mongoose.model("reasons", reasonSchema);
