const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let material = new Schema(
  {
    material: { type: String },
    objectiveValues: { type: Array },    
    clients: { type: Array },
    //clients: { type: Schema.Types.ObjectId, ref:'clients' },
    aTypesValues: { type: Array },
    //aTypesValues: { type: Schema.Types.ObjectId, ref: 'analysisTypes'},
    remark: { type: String }
  },
  { collection: "materials" }
);

module.exports = mongoose.model("materials", material);