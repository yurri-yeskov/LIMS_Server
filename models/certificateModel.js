const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let Reason = new Schema(
  {
    name: { type: String },
    company: { type: String },
    // logo: { type: Object },
    // footer: { type: Object },
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
    logo_filename: {
      type: String,
      default: ''
    },
    footer_filename: {
      type: String,
      default: ''
    },
    header_styles: {
      left: {
        type: Number,
        default: 0
      },
      top: {
        type: Number,
        default: 0
      },
      width: {
        type: Number,
        default: 0
      },
      height: {
        type: Number,
        default: 0
      },
      keep_distance: {
        type: Boolean,
        default: false
      }
    },
    footer_styles: {
      left: {
        type: Number,
        default: 0
      },
      bottom: {
        type: Number,
        default: 0
      },
      width: {
        type: Number,
        default: 0
      },
      height: {
        type: Number,
        default: 0
      },
      keep_distance: {
        type: Boolean,
        default: false
      }
    }
  },
  { collection: "certificates" }
);

module.exports = mongoose.model("certificates", Reason);
