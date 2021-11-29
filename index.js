const logger = require("node-color-log");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require('path')
const bcrypt = require('bcrypt')
const passport = require('passport')

const database = require("./database");
const router = require("./router");
const config = require("./config.js");
const User = require("./models/users");
const UserType = require("./models/userTypes");

const UserRoute = require('./router/User.Route')
const MaterialRoute = require('./router/Material.Route')
const InputLaboratoryRoute = require('./router/InputLab.Route')

const express = require("express");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(bodyParser.json());

database.init();

app.use(passport.initialize());

// Passport Config
require("./config/passport")(passport);


/** ----------API Routes---------- **/
app.use('/api/users/', UserRoute)
app.use('/api/materials', MaterialRoute)
app.use('/api/inputLabs', InputLaboratoryRoute)

const server = require("http").createServer(app);

app.get('/uploads/:filename', async (req, res) => {
  const filename = req.params.filename;
  res.sendFile(path.join(__dirname, './uploads/' + filename));
})


const userFind = async () => {
  let userType = await UserType.find({ userType: "General Admin" });
  if (userType.length == 0) {
    //general_id.save()
    let defaultUserType = new UserType();
    defaultUserType.userType_id = "1";
    defaultUserType.userType = "General Admin";
    defaultUserType.labInput = true;
    defaultUserType.labAnalysis = true;
    defaultUserType.labAdmin = true;
    defaultUserType.stockUser = true;
    defaultUserType.stockAdmin = true;
    defaultUserType.hsImport = true;
    defaultUserType.hsExport = true;
    defaultUserType.hsAdmin = true;
    defaultUserType.geologyImport = true;
    defaultUserType.geologyExport = true;
    defaultUserType.geologyAdmin = true;
    defaultUserType.save();

    let userInfo = await User.find({ email: "Sev123@gmail.com" });
    if (userInfo.length == 0) {
      let defaultUser = new User();
      defaultUser.user_id = '1';
      defaultUser.userName = "Severin";
      defaultUser.email = "Sev123@gmail.com";
      // defaultUser.password = "sev123!@#";
      defaultUser.userType = defaultUserType._id;
      // await defaultUser.save();

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash("sev123!@#", salt, async (err, hash) => {
          if (err) throw err;
          defaultUser.password = hash;
          await defaultUser.save();
        });
      });
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

  router.init(app);
}

const port = config.Port;

server.listen(port);
server.on("error", onError);
server.on("listening", onListening);

