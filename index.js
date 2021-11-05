const logger = require("node-color-log");
const cors = require("cors");
const bodyParser = require("body-parser");

var database = require("./database");
var router = require("./router");
var config = require("./config.js");
var User = require("./models/users");
var UserType = require("./models/userTypes");

var express = require("express");

var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(bodyParser.json());

var server = require("http").createServer(app);
var port = config.Port;

server.listen(port);
server.on("error", onError);
server.on("listening", onListening);

// const userTypeFind = async() => {
//   let userType = await UserType.find({userType: 'General Admin'});
//   if(userType.length == 0) {
//     //general_id.save()
//     userType.save();
//   }
// }

const userFind = async () => {
  let userType = await UserType.find({ userType: "General Admin" });
  if (userType.length == 0) {
    //general_id.save()
    var defaultUserType = new UserType();
    defaultUserType.userType = "General Admin";
    defaultUserType.save();

    let userInfo = await User.find({ email: "Sev123@gmail.com" });
    if (userInfo.length == 0) {
      var defaultUser = new User();
      defaultUser.userName = "Severin";
      defaultUser.email = "Sev123@gmail.com";
      defaultUser.password = "sev123!@#";
      defaultUser.userType = defaultUserType._id;

      defaultUser.save();
    }
  }
};

// userTypeFind();
userFind();

function onError(error) {
  if (error.syscall != "listen") {
    throw error;
  }
  var bind = "Port " + port;

  switch (error.code) {
    case "EACCES":
      logger.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      logger.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  logger.info("Listening on port: " + port);

  database.init();
  router.init(app);
}
