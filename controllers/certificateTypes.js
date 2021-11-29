const CertificateType = require('../models/certificateTypes');
const AnalysisType = require('../models/analysisTypes');
const Objective = require('../models/objectives');
const Material = require('../models/materials');
const Client = require('../models/clients');
const Unit = require('../models/units');
const Packings = require('../models/packingTypes');
const CSV = require('csv-string');

exports.getAllCertificateTypes = async function (req, res) {
  try {
    const certificateTypes = await CertificateType.find();
    const objectives = await Objective.find();
    const analysises = await AnalysisType.find();
    const materials = await Material.find();
    const clients = await Client.find().select("_id, name");
    const units = await Unit.find().select("_id, unit");
    const packings = await Packings.find();

    res.send({ certificateTypes, objectives, analysises, materials, clients, units, packings });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
}

exports.createCertificateType = async function (req, res) {
  if (req.body === undefined || req.body.certificateType === undefined || !req.body.certificateType) {
    res.status(400).send({ message: "CertificateType name can not be empty!" });
    return;
  }

  let certificateType = new CertificateType({
    material: req.body.material,
    client: req.body.client,
    certificateType_id: req.body.certificateType_id,
    certificateType: req.body.certificateType,
    analysises: req.body.analysises,
    remark: req.body.remark,
    packing: req.body.packing,
  });

  try {
    await certificateType.save();
    const certificateTypes = await CertificateType.find();
    const objectives = await Objective.find();
    const analysises = await AnalysisType.find();
    const materials = await Material.find();
    const clients = await Client.find().select("_id, name");
    const units = await Unit.find().select("_id, unit");
    const packings = await Packings.find();

    res.send({ certificateTypes, objectives, analysises, materials, clients, units, packings });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
}

exports.updateCertificateType = async function (req, res) {
  if (req.body === undefined || req.body.id === undefined || !req.body.id) {
    res.status(400).send({ message: "CertificateType id can not be empty!" });
    return;
  }

  let id = req.body.id;

  try {
    const data = await CertificateType.findByIdAndUpdate(id, {
      material: req.body.material,
      client: req.body.client,
      certificateType_id: req.body.certificateType_id,
      certificateType: req.body.certificateType,
      analysises: req.body.analysises,
      remark: req.body.remark,
      packing: req.body.packing,
    },
      { useFindAndModify: false });
    if (!data)
      res.status(404).send({ message: `Cannot update object with id = ${id}. Maybe object was not found!` });
    else {
      const certificateTypes = await CertificateType.find();
      const objectives = await Objective.find();
      const analysises = await AnalysisType.find();
      const materials = await Material.find();
      const clients = await Client.find().select("_id, name");
      const units = await Unit.find().select("_id, unit");
      const packings = await Packings.find();

      res.send({ certificateTypes, objectives, analysises, materials, clients, units, packings });
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
}

exports.deleteCertificateType = async function (req, res) {
  if (req.body === undefined || req.body.id === undefined || !req.body.id) {
    res.status(400).send({ message: "CertificateType id can not be empty!" });
    return;
  }

  let id = req.body.id;

  try {
    const data = await CertificateType.findByIdAndRemove(id, { useFindAndModify: false })
    if (!data)
      res.status(404).send({ message: `Cannot update object with id = ${id}. Maybe object was not found!` });
    else {
      const certificateTypes = await CertificateType.find();
      const objectives = await Objective.find();
      const analysises = await AnalysisType.find();
      const materials = await Material.find();
      const clients = await Client.find().select("_id, name");
      const units = await Unit.find().select("_id, unit");
      const packings = await Packings.find();

      res.send({ certificateTypes, objectives, analysises, materials, clients, units, packings });
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
}

exports.uploadCertificateTypeCSV = async function (req, res) {
  if (req.body === undefined) {
    res.status(400).send({ message: "PackingType name can not be empty!" });
    return;
  }
  const parsedCSV = CSV.parse(req.body.data);
  try {
    for (let i = 1; i < parsedCSV.length; i++) {
      let aCSV = parsedCSV[i];
      material = aCSV[1].split('-');
      let material_temp = await Material.findOne({ material: material[0] })
      let client = ''
      if (material[1] === 'Default') {
        client = ''
      } else {
        let client_temp = await Client.findOne({ name: material[1] })
        client = client_temp._id;
      }
      let packing_temp = await Packings.findOne({ packingType: aCSV[3] })
      let combinedata_list = [];
      if (aCSV[4] != '') {
        let combine = [];
        if (aCSV[4].indexOf('\n') === -1) {
          combine.push(aCSV[4]);
        } else {
          combine = aCSV[4].split('\n');
        }
        for (let j = 0; j < combine.length; j++) {
          let combine_temp = combine[j].split(' - ');
          let analysisType_data = await AnalysisType.findOne({ analysisType: combine_temp[0] });
          let temp = combine_temp[1].split(' ');

          let one_objective = await Objective.findOne({ objective: temp[0] });
          let one_unit = await Unit.findOne({ unit: temp[1] });
          let objective_data = [];
          objective_data.push({ id: one_objective._id, unit: one_unit._id });
          let flag = null;
          for (let k = 0; k < combinedata_list.length; k++) {
            if (combinedata_list[k].id == analysisType_data._id.toString()) {
              flag = k;
              break;
            }
          }
          if (flag != null) {
            combinedata_list[flag].objectives.push({ id: one_objective._id, unit: one_unit._id });
          } else {
            combinedata_list.push({ id: analysisType_data._id, objectives: objective_data });
          }

        }
      }

      let query = { certificateType_id: aCSV[0] };
      let update = {
        material: material_temp._id,
        client: client,
        certificateType: aCSV[2],
        analysises: combinedata_list,
        packing: packing_temp._id,
        remark: aCSV[5],
      };
      let options = { upsert: true, new: true, setDefaultsOnInsert: true, useFindAndModify: false };
      await CertificateType.findOneAndUpdate(query, update, options)
    }
    const certificateTypes = await CertificateType.find();
    res.send(certificateTypes);
  }
  catch (err) {
    res.status(500).send({ message: err.message });
  }
}