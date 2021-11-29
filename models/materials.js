const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const materialSchema = new Schema({
  material_id: {
    type: String
  },
  material: {
    type: String
  },
  objectiveValues: {
    type: Array
  },
  clients: [{
    type: Schema.Types.ObjectId,
    ref: 'clients'
  }],
  aTypesValues: {
    type: Array
  },
  remark: {
    type: String
  }
});

module.exports = Material = mongoose.model("materials", materialSchema);