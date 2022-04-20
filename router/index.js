const usersController = require("../controllers/users.js");
const objectivesController = require("../controllers/objectives.js");
const packingTypesController = require("../controllers/packingTypes.js");
const certificateTypesController = require("../controllers/certificateTypes.js");
const analysisTypesController = require("../controllers/analysisTypes.js");
const sampleTypesController = require("../controllers/sampleTypes.js");
const userTypesController = require("../controllers/userTypes.js");
const materialsController = require("../controllers/materials.js");
const unitsController = require("../controllers/units.js");
const clientsController = require("../controllers/clients.js");
const InputLaboratoryController = require("../controllers/inputLaboratory.js");
const AnalysisLaboratoryController = require("../controllers/analysisLaboratory.js");
const objectiveHistory = require("../controllers/objectiveHistory.js");
const reasonController = require("../controllers/reasonController");
const certificateCtr = require("../controllers/certificateCtr");
const PDFCtr = require("../controllers/getPDFCtr");
const multer = require("multer");
const passport = require('passport');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // console.log(__dirname);
    cb(
      null,
      __dirname.substr(0, __dirname.length - 13) + "client\\public\\uploads"
    );
    console.log(__dirname);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });

exports.init = function (app) {
  app.post("/get_language", AnalysisLaboratoryController.getLanguage);

  app.get("/get_all_users", passport.authenticate('jwt', { session: false }), usersController.getAllUsers);
  app.post("/upload_user_csv", passport.authenticate('jwt', { session: false }), usersController.uploadUserCSV);
  app.post("/get_token", passport.authenticate('jwt', { session: false }), usersController.getToken);
  app.post("/login_user", usersController.loginUser);
  app.post("/create_user", passport.authenticate('jwt', { session: false }), usersController.createUser);
  app.post("/delete_user", passport.authenticate('jwt', { session: false }), usersController.deleteUser);
  app.post("/update_user", passport.authenticate('jwt', { session: false }), usersController.updateUser);
  // app.post("/remove_mat", InputLaboratoryController.Del_material);

  app.get("/get_all_objectives", passport.authenticate('jwt', { session: false }), objectivesController.getAllObjectives);
  app.post("/create_objective", passport.authenticate('jwt', { session: false }), objectivesController.createObjective);
  app.post("/delete_objective", passport.authenticate('jwt', { session: false }), objectivesController.deleteObjective);
  app.post("/update_objective", passport.authenticate('jwt', { session: false }), objectivesController.updateObjective);
  app.post("/upload_objective_csv", passport.authenticate('jwt', { session: false }), objectivesController.uploadObjectiveCSV);
  app.post("/check_objective", passport.authenticate('jwt', { session: false }), objectivesController.checkObjective);

  app.get("/get_all_packingTypes", passport.authenticate('jwt', { session: false }), packingTypesController.getAllPackingTypes);
  app.post("/create_packingType", passport.authenticate('jwt', { session: false }), packingTypesController.createPackingType);
  app.post("/delete_packingType", passport.authenticate('jwt', { session: false }), packingTypesController.deletePackingType);
  app.post("/update_packingType", passport.authenticate('jwt', { session: false }), packingTypesController.updatePackingType);
  app.post("/upload_packingType_csv", passport.authenticate('jwt', { session: false }), packingTypesController.uploadPackingTypeCSV);

  app.get("/get_all_certificateTypes", passport.authenticate('jwt', { session: false }), certificateTypesController.getAllCertificateTypes);
  app.post("/create_certificateType", passport.authenticate('jwt', { session: false }), certificateTypesController.createCertificateType);
  app.post("/delete_certificateType", passport.authenticate('jwt', { session: false }), certificateTypesController.deleteCertificateType);
  app.post("/update_certificateType", passport.authenticate('jwt', { session: false }), certificateTypesController.updateCertificateType);
  app.post("/upload_certificatetype_csv", passport.authenticate('jwt', { session: false }), certificateTypesController.uploadCertificateTypeCSV);

  app.get("/get_all_analysisTypes", passport.authenticate('jwt', { session: false }), analysisTypesController.getAllAnalysisTypes);
  app.post("/create_analysisType", passport.authenticate('jwt', { session: false }), analysisTypesController.createAnalysisType);
  app.post("/delete_analysisType", passport.authenticate('jwt', { session: false }), analysisTypesController.deleteAnalysisType);
  app.post("/update_analysisType", passport.authenticate('jwt', { session: false }), analysisTypesController.updateAnalysisType);
  app.post("/upload_analysisType_csv", passport.authenticate('jwt', { session: false }), analysisTypesController.uploadAnalysisTypeCSV);
  app.post('/check_remove_objective', passport.authenticate('jwt', { session: false }), analysisTypesController.checkRemoveObjective);

  app.get("/get_all_sampleTypes", passport.authenticate('jwt', { session: false }), sampleTypesController.getAllSampleTypes);
  app.post("/create_sampleType", passport.authenticate('jwt', { session: false }), sampleTypesController.createSampleType);
  app.post("/delete_sampleType", passport.authenticate('jwt', { session: false }), sampleTypesController.deleteSampleType);
  app.post("/update_sampleType", passport.authenticate('jwt', { session: false }), sampleTypesController.updateSampleType);
  app.post("/upload_sampletype_csv", passport.authenticate('jwt', { session: false }), sampleTypesController.uploadSampleTypeCSV);
  app.post('/check_sampleType', passport.authenticate('jwt', { session: false }), sampleTypesController.checkSampleType);

  app.get("/get_all_userTypes", passport.authenticate('jwt', { session: false }), userTypesController.getAllUserTypes);
  app.post("/create_userType", passport.authenticate('jwt', { session: false }), userTypesController.createUserType);
  app.post("/delete_userType", passport.authenticate('jwt', { session: false }), userTypesController.deleteUserType);
  app.post("/update_userType", passport.authenticate('jwt', { session: false }), userTypesController.updateUserType);
  app.post("/upload_usertype_csv", passport.authenticate('jwt', { session: false }), userTypesController.uploadUserTypeCSV);

  app.get("/get_all_materials", passport.authenticate('jwt', { session: false }), materialsController.getAllMaterials);
  app.post("/create_material", passport.authenticate('jwt', { session: false }), materialsController.createMaterial);
  app.post("/delete_material", passport.authenticate('jwt', { session: false }), materialsController.deleteMaterial);
  app.post("/update_material", passport.authenticate('jwt', { session: false }), materialsController.updateMaterial);
  app.post("/upload_material_csv", passport.authenticate('jwt', { session: false }), materialsController.uploadMaterialCSV);

  app.get("/get_all_units", passport.authenticate('jwt', { session: false }), unitsController.getAllUnits);
  app.post("/create_unit", passport.authenticate('jwt', { session: false }), unitsController.createUnit);
  app.post("/delete_unit", passport.authenticate('jwt', { session: false }), unitsController.deleteUnit);
  app.post("/update_unit", passport.authenticate('jwt', { session: false }), unitsController.updateUnit);
  app.post("/upload_unit_csv", passport.authenticate('jwt', { session: false }), unitsController.uploadUnitCSV);

  app.get("/get_all_clients", passport.authenticate('jwt', { session: false }), clientsController.getAllClients);
  app.post("/create_client", passport.authenticate('jwt', { session: false }), clientsController.createClient);
  app.post("/delete_client", passport.authenticate('jwt', { session: false }), clientsController.deleteClient);
  app.post("/update_client", passport.authenticate('jwt', { session: false }), clientsController.updateClient);
  app.post("/upload_client_csv", passport.authenticate('jwt', { session: false }), clientsController.uploadClientCSV);

  app.post("/create_input_laboratory", passport.authenticate('jwt', { session: false }), InputLaboratoryController.createInputLaboratory);
  app.post("/update_input_laboratory", passport.authenticate('jwt', { session: false }), InputLaboratoryController.updateInputLaboratory);
  app.get("/get_all_input_laboratory", passport.authenticate('jwt', { session: false }), InputLaboratoryController.getAllData);
  app.post("/delete_input_laboratory", passport.authenticate('jwt', { session: false }), InputLaboratoryController.deleteInputLaboratory);
  app.post("/upload_laboratory_csv", passport.authenticate('jwt', { session: false }), InputLaboratoryController.uploadLaboratoryCSV);
  app.post("/add_weight", passport.authenticate('jwt', { session: false }), InputLaboratoryController.addWeight);
  app.post("/add_charge", passport.authenticate('jwt', { session: false }), InputLaboratoryController.addCharge);
  app.post("/get_userTypes", passport.authenticate('jwt', { session: false }), InputLaboratoryController.getUserTypes);

  app.get("/get_objective_history", passport.authenticate('jwt', { session: false }), objectiveHistory.getObjectiveHistory);
  app.post("/create_objective_history", passport.authenticate('jwt', { session: false }), objectiveHistory.createObjectiveHistory);

  app.get("/get_all_reason", passport.authenticate('jwt', { session: false }), reasonController.getAllReason);
  app.post("/create_reason", passport.authenticate('jwt', { session: false }), reasonController.createReason);
  app.post("/delete_reason", passport.authenticate('jwt', { session: false }), reasonController.deleteReason);
  app.post("/update_reason", passport.authenticate('jwt', { session: false }), reasonController.updateReason);
  app.post("/upload_reason_csv", passport.authenticate('jwt', { session: false }), reasonController.uploadReasonCSV);

  app.post("/get_graph_data", passport.authenticate('jwt', { session: false }), AnalysisLaboratoryController.getGraphData);
  app.post("/get_objective_history_for_chart", passport.authenticate('jwt', { session: false }), AnalysisLaboratoryController.getObjectiveHistoryData);
  app.post("/get_available_analysis_type", passport.authenticate('jwt', { session: false }), AnalysisLaboratoryController.getAvailableanalysisType);
  app.post("/get_input_laboratory_by_id", passport.authenticate('jwt', { session: false }), AnalysisLaboratoryController.getinputlaboratorybyid);
  app.get("/get_certificate", passport.authenticate('jwt', { session: false }), certificateCtr.getCertificate);
  app.post('/upload_certificate_template', passport.authenticate('jwt', { session: false }), certificateCtr.uploadFile);
  app.post("/get_certificate_datefotmat", passport.authenticate('jwt', { session: false }), certificateCtr.getCertificate_dateformat);
  app.post("/add_certificate", upload.array("files"), certificateCtr.AddCertificate);
  app.post("/del_certificate", passport.authenticate('jwt', { session: false }), certificateCtr.DelCertificate);
  app.post("/copy_productdata", passport.authenticate('jwt', { session: false }), certificateCtr.CopyCertificate);
  app.post("/update_productdata", passport.authenticate('jwt', { session: false }), certificateCtr.Upproductdata);
  app.post("/update_tabledata", passport.authenticate('jwt', { session: false }), certificateCtr.Uptabledata);
  app.post("/update_Freetext", passport.authenticate('jwt', { session: false }), certificateCtr.UpFreetext);

  //pdf data collection
  app.post("/pdf_getaddressdata", passport.authenticate('jwt', { session: false }), PDFCtr.getaddress);
  app.post("/pdf_getanaldata", passport.authenticate('jwt', { session: false }), PDFCtr.getanaldata);
  app.post("/pdf_gethistorydata", passport.authenticate('jwt', { session: false }), PDFCtr.gethistorydata);

  app.get("*", (req, res) => {
    res.status(404).send({ message: "Invalid URL" });
  });

  // KCH NEW CODING
  app.post("/analysis_mat", passport.authenticate('jwt', { session: false }), InputLaboratoryController.analysis_mataterial);
  app.post("/certificate_mat", passport.authenticate('jwt', { session: false }), InputLaboratoryController.certificate_mataterial);
  app.post("/weight_mat", passport.authenticate('jwt', { session: false }), InputLaboratoryController.weight_material);
  app.post("/lot_mat", passport.authenticate('jwt', { session: false }), InputLaboratoryController.lot_material);
  app.post("/stocksample_mat", passport.authenticate('jwt', { session: false }), InputLaboratoryController.stocksample_material);
  app.post("/add_multi_mat", passport.authenticate('jwt', { session: false }), InputLaboratoryController.add_multi_material);

  app.post("/add_mat", passport.authenticate('jwt', { session: false }), InputLaboratoryController.add_material);
};
