const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let Reason = new Schema(
  {
    name: { type: String },
    company: { type: String },
    logo: { type: Object },
    footer: { type: Object },
    productdata: {
      productTitle: {
        type: String,
        default: "",
      },
      productData: {
        type: Array,
      },
    },
    freetext: {
      type: String,
      default: "",
    },
    tablecol: { type: Array },
    place: { type: String },
    logoUid: { type: String },
    footerUid: { type: String },
    certificatetitle: { type: String },
    date_format: { type: String },
  },
  { collection: "certificates" }
);

module.exports = mongoose.model("certificates", Reason);
