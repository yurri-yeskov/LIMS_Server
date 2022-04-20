const logger = require("node-color-log");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require('path')
const bcrypt = require('bcrypt')
const passport = require('passport')
const fileupload = require('express-fileupload');

const database = require("./database");
const router = require("./router");
const config = require("./config.js");
const User = require("./models/users");
const UserType = require("./models/userTypes");
const Client = require('./models/clients')
const Language = require('./models/language')

const UserRoute = require('./router/User.Route')
const MaterialRoute = require('./router/Material.Route')
const InputLaboratoryRoute = require('./router/InputLab.Route')
const WeightRoute = require('./router/Weight.Route')
const ChargeRoute = require('./router/Charge.Route')
const AnalysisRoute = require('./router/Analysis.Route')
const ClientRoute = require('./router/Client.Route')
const CertificateRoute = require('./router/Certificate.Route')

const languageData = require('./language.json')

const express = require("express");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(bodyParser.json());

app.use(fileupload());

database.init();

app.use(passport.initialize());

// Passport Config
require("./config/passport")(passport);


/** ----------API Routes---------- **/
app.use('/api/users/', UserRoute)
app.use('/api/materials', MaterialRoute)
app.use('/api/inputLabs', InputLaboratoryRoute)
app.use('/api/weights', WeightRoute)
app.use('/api/charges', ChargeRoute)
app.use('/api/analysis', AnalysisRoute)
app.use('/api/clients', ClientRoute)
app.use('/api/certificates', CertificateRoute)

const server = require("http").createServer(app);

app.get('/uploads/certificates/:filename', async (req, res) => {
  const filename = req.params.filename;
  res.sendFile(path.join(__dirname, './uploads/certificates/' + filename));
})


const userFind = async () => {
  let userType = await UserType.find({ userType: "General Admin" });
  if (userType.length == 0) {
    try {
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
      await defaultUserType.save();

      let userInfo = await User.find({ email: "Sev123@gmail.com" });
      if (userInfo.length == 0) {
        let defaultUser = new User();
        defaultUser.user_id = '1';
        defaultUser.userName = "Severin";
        defaultUser.email = "Sev123@gmail.com";
        defaultUser.password_text = "sev123!@#";
        defaultUser.userType = defaultUserType._id;
        defaultUser.remark = ''

        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash("sev123!@#", salt)
        defaultUser.password = hash
        await defaultUser.save();
      }
    } catch (err) {
      console.log(err)
    }
  }
};

// userTypeFind();
userFind();

const addDefaultClient = async () => {
  const defaultClient = await Client.find({ name: 'Default' })
  if (defaultClient.length === 0) {
    var defaultClientData = new Client({
      name: 'Default',
      clientId: 0,
      other: '',
      countryL: '',
      zipCodeL: '',
      cityL: '',
      addressL: '',
      address2L: '',
      countryB: '',
      zipCodeB: '',
      cityB: '',
      addressB: '',
      address2B: '',
      email: '',
      email2: '',
      email3: '',
      remark1: '',
      remark2: ''
    });
    await defaultClientData.save();
  }
}

addDefaultClient();

const addLanguage = async () => {
  const languages = await Language.find()
  if (languages.length === 0) {
    for (let i = 0; i < languageData.length; i++) {
      const language = new Language({
        _id: languageData[i]._id,
        English: languageData[i].English,
        German: languageData[i].German,
        label: languageData[i].label
      })
      await language.save()
    }
  }
}

addLanguage()

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

