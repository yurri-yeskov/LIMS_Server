const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const analysisType = new Schema(
  {
    analysisType_id: { type: String },
    analysisType: { type: String },
    norm: { type: String },
    objectives: [
      {
        id: {
          type: Schema.Types.ObjectId,
          ref: 'objectives'
        },
        unit: {
          type: Schema.Types.ObjectId,
          ref: 'units'
        }
      }
    ],
    remark: { type: String }
  },
  { collection: "analysisTypes" }
);

module.exports = mongoose.model("analysisTypes", analysisType);