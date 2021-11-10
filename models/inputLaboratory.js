const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let inputLaboratory = new Schema(
  {
    self_analysis_cnt: { type: Number },
    self_certificate_cnt: { type: Number },
    stockinfo: { type: String },
    sample_type: { type: String },
    material: { type: String },
    client: { type: String },
    packing_type: { type: Array, default: [] },
    due_date: { type: String },
    sample_date: { type: String },
    sending_date: { type: String },
    a_types: { type: Array, default: [] },
    c_types: { type: Array, default: [] },
    idstore: { type: Array, default: [] },
    distributor: { type: String },
    geo_locaion: { type: String },
    remark: { type: String },
    client_id: { type: String },
    material_left: { type: String },
    stockSample: { type: Array, default: [] },
    Weight: [
      {
        weight: { type: String },
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "users",
        },
        update_date: { type: String },
        comment: { type: String },
      },
    ],
    Charge: [
      {
        charge: { type: String },
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "users",
        },
        update_date: { type: String },
        comment: { type: String },
      },
    ],
    delivering: { type: Object },
  },
  { collection: "inputLaboratory" }
);

module.exports = mongoose.model("inputLaboratory", inputLaboratory);
