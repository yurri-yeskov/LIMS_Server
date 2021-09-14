const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let Reason = new Schema(
  {
    reason: { type: String },
    remark: { type: String },
  },
  { collection: "reasons" }
);

module.exports = mongoose.model("reasons", Reason);
