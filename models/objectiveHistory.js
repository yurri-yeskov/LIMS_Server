const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let objectiveHistory = new Schema({
  userid: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
  label: {
    type: String,
  },
  limitValue: {
    type: Number,
  },
  comment: {
    type: String,
  },
  update_date: {
    type: String,
  },
  id: {
    type: String,
  },
  analysis: {
    type: String,
  },
  min: {
    type: Number,
  },
  max: {
    type: Number,
  },
  obj_value: {
    type: String,
  },
  unit: {
    type: String,
  },
  reason: {
    type: String,
  },
  accept: {
    type: Boolean,
  },
});

module.exports = ObjectiveHistory = mongoose.model(
  "objectivehistory",
  objectiveHistory
);
