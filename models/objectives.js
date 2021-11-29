const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let objective = new Schema(
  {
    objective_id: { type: String },
    objective: { type: String },
    units: [{
      type: Schema.Types.ObjectId,
      ref: 'units'
    }],
    remark: { type: String }
  },
  { collection: "objectives" }
);

module.exports = mongoose.model("objectives", objective);