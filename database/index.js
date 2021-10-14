
var mongoose = require("mongoose");
var logger = require('node-color-log');

var config = require('../config.js');
const db =  config.MongoUri;

exports.init = function() {
  mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,      
    })
    .then(() => {
      logger.info("MongoDB database connection established successfully");
    })
    .catch(err => {
      logger.error("MongoDB database connection established unsuccessfully", err);
      process.exit(0);
    })
}