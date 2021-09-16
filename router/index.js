var usersController = require("../controllers/users.js");
var objectivesController = require("../controllers/objectives.js");
var packingTypesController = require("../controllers/packingTypes.js");
var certificateTypesController = require("../controllers/certificateTypes.js");
var analysisTypesController = require("../controllers/analysisTypes.js");
var sampleTypesController = require("../controllers/sampleTypes.js");
var userTypesController = require("../controllers/userTypes.js");
var materialsController = require("../controllers/materials.js");
var unitsController = require("../controllers/units.js");
var clientsController = require("../controllers/clients.js");
var InputLaboratoryController = require("../controllers/inputLaboratory.js");
var objectiveHistory = require("../controllers/objectiveHistory.js");
var reasonController = require("../controllers/reasonController");

exports.init = function (app) {
  app.get("/get_all_users", usersController.getAllUsers);
  app.post("/get_token", usersController.getToken);
  app.post("/login_user", usersController.loginUser);
  app.post("/create_user", usersController.createUser);
  app.post("/delete_user", usersController.deleteUser);
  app.post("/update_user", usersController.updateUser);

  app.get("/get_all_objectives", objectivesController.getAllObjectives);
  app.post("/create_objective", objectivesController.createObjective);
  app.post("/delete_objective", objectivesController.deleteObjective);
  app.post("/update_objective", objectivesController.updateObjective);

  app.get("/get_all_packingTypes", packingTypesController.getAllPackingTypes);
  app.post("/create_packingType", packingTypesController.createPackingType);
  app.post("/delete_packingType", packingTypesController.deletePackingType);
  app.post("/update_packingType", packingTypesController.updatePackingType);

  app.get(
    "/get_all_certificateTypes",
    certificateTypesController.getAllCertificateTypes
  );
  app.post(
    "/create_certificateType",
    certificateTypesController.createCertificateType
  );
  app.post(
    "/delete_certificateType",
    certificateTypesController.deleteCertificateType
  );
  app.post(
    "/update_certificateType",
    certificateTypesController.updateCertificateType
  );

  app.get(
    "/get_all_analysisTypes",
    analysisTypesController.getAllAnalysisTypes
  );
  app.post("/create_analysisType", analysisTypesController.createAnalysisType);
  app.post("/delete_analysisType", analysisTypesController.deleteAnalysisType);
  app.post("/update_analysisType", analysisTypesController.updateAnalysisType);

  app.get("/get_all_sampleTypes", sampleTypesController.getAllSampleTypes);
  app.post("/create_sampleType", sampleTypesController.createSampleType);
  app.post("/delete_sampleType", sampleTypesController.deleteSampleType);
  app.post("/update_sampleType", sampleTypesController.updateSampleType);

  app.get("/get_all_userTypes", userTypesController.getAllUserTypes);
  app.post("/create_userType", userTypesController.createUserType);
  app.post("/delete_userType", userTypesController.deleteUserType);
  app.post("/update_userType", userTypesController.updateUserType);

  app.get("/get_all_materials", materialsController.getAllMaterials);
  app.post("/create_material", materialsController.createMaterial);
  app.post("/delete_material", materialsController.deleteMaterial);
  app.post("/update_material", materialsController.updateMaterial);

  app.get("/get_all_units", unitsController.getAllUnits);
  app.post("/create_unit", unitsController.createUnit);
  app.post("/delete_unit", unitsController.deleteUnit);
  app.post("/update_unit", unitsController.updateUnit);

  app.get("/get_all_clients", clientsController.getAllClients);
  app.post("/create_client", clientsController.createClient);
  app.post("/delete_client", clientsController.deleteClient);
  app.post("/update_client", clientsController.updateClient);
  app.post("/upload_client_csv", clientsController.uploadClientCSV);

  app.post(
    "/create_input_laboratory",
    InputLaboratoryController.createInputLaboratory
  );
  app.post(
    "/update_input_laboratory",
    InputLaboratoryController.updateInputLaboratory
  );
  app.get("/get_all_input_laboratory", InputLaboratoryController.getAllData);
  app.post(
    "/delete_input_laboratory",
    InputLaboratoryController.deleteInputLaboratory
  );
  app.post(
    "/upload_laboratory_csv",
    InputLaboratoryController.uploadLaboratoryCSV
  );
  app.post("/add_weight", InputLaboratoryController.addWeight);
  app.post("/add_charge", InputLaboratoryController.addCharge);
  app.post("/get_userTypes", InputLaboratoryController.getUserTypes);

  app.get("/get_objective_history", objectiveHistory.getObjectiveHistory);
  app.post(
    "/create_objective_history",
    objectiveHistory.createObjectiveHistory
  );

  app.get("/get_all_reason", reasonController.getAllReason);
  app.post("/create_reason", reasonController.createReason);
  app.post("/delete_reason", reasonController.deleteReason);
  app.post("/update_reason", reasonController.updateReason);

  app.get("*", (req, res) => {
    res.status(404).send({ message: "Invalid URL" });
  });
};
