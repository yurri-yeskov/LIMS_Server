const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let user = new Schema(
  {
    user_id: { type: String },
    auto_id: { type: String },
    userName: { type: String },
    email: { type: String },
    password: { type: String },
    userType: { type: Schema.Types.ObjectId, ref: "userTypes" },
    remark: { type: String },
  },
  { collection: "users" }
);

module.exports = User = mongoose.model("users", user);
