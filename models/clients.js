const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const clientSchema = new Schema(
  {
    name: { type: String, default: '' },
    clientId: { type: String, default: '' },
    other: { type: String, default: '' },
    countryL: { type: String, default: '' },
    countryB: { type: String, default: '' },
    zipCodeL: { type: String, default: '' },
    zipCodeB: { type: String, default: '' },
    cityL: { type: String, default: '' },
    cityB: { type: String, default: '' },
    addressL: { type: String, default: '' },
    address2L: { type: String, default: '' },
    addressB: { type: String, default: '' },
    address2B: { type: String, default: '' },
    email: { type: String, default: '' },
    email2: { type: String, default: '' },
    email3: { type: String, default: '' },
    remark1: { type: String, default: '' },
    remark2: { type: String, default: '' }
  }
);

module.exports = Client = mongoose.model("clients", clientSchema);