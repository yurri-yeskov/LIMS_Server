const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  user_id: {
    type: String,
    default: ''
  },
  auto_id: {
    type: String
  },
  userName: {
    type: String,
    require: true
  },
  email: {
    type: String,
    require: true
  },
  password: {
    type: String,
    require: true
  },
  userType: {
    type: Schema.Types.ObjectId,
    ref: 'userTypes'
  },
  remark: {
    type: String
  }
})

module.exports = User = mongoose.model("users", userSchema);
