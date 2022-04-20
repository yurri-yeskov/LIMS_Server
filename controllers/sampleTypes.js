const mongoose = require('mongoose')
const InputLab = require('../models/inputLab')
const SampleType = require("../models/sampleTypes");
const CSV = require("csv-string");

exports.getAllSampleTypes = async (req, res) => {
  try {
    const types = await SampleType.find()
    return res.json(types)
  } catch (err) {
    return res.status(500).json({ message: 'Fetch data failed' })
  }
};

exports.createSampleType = function (req, res) {
  if (
    req.body === undefined ||
    req.body.sampleType === undefined ||
    !req.body.sampleType
  ) {
    res.status(400).send({ message: "SampleType name can not be empty!" });
    return;
  }

  let sampleType = new SampleType({
    sampleType: req.body.sampleType,
    sampleType_id: req.body.sampleType_id,
    stockSample: req.body.stockSample,
    material: req.body.material,
    client: req.body.client,
    packingType: req.body.packingType,
    dueDate: req.body.dueDate,
    sampleDate: req.body.sampleDate,
    sendingDate: req.body.sendingDate,
    analysisType: req.body.analysisType,
    incomingProduct: req.body.incomingProduct,
    distributor: req.body.distributor,
    certificateType: req.body.certificateType,
    remark: req.body.remark,
  });

  sampleType
    .save()
    .then((data) => {
      SampleType.find().then((data) => {
        res.send(data);
      });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.updateSampleType = function (req, res) {
  if (req.body === undefined || req.body.id === undefined || !req.body.id) {
    res.status(400).send({ message: "SampleType id can not be empty!" });
    return;
  }

  let id = req.body.id;

  SampleType.findByIdAndUpdate(
    id,
    {
      sampleType: req.body.sampleType,
      sampleType_id: req.body.sampleType_id,
      stockSample: req.body.stockSample,
      material: req.body.material,
      client: req.body.client,
      packingType: req.body.packingType,
      dueDate: req.body.dueDate,
      sampleDate: req.body.sampleDate,
      sendingDate: req.body.sendingDate,
      analysisType: req.body.analysisType,
      incomingProduct: req.body.incomingProduct,
      distributor: req.body.distributor,
      certificateType: req.body.certificateType,
      remark: req.body.remark,
    },
    { useFindAndModify: false }
  )
    .then((data) => {
      if (!data)
        res.status(404).send({
          message: `Cannot update object with id = ${id}. Maybe object was not found!`,
        });
      else {
        SampleType.find().then((data) => {
          res.send(data);
        });
      }
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Could not update object with id = " + id });
    });
};

exports.deleteSampleType = async function (req, res) {
  if (req.body === undefined || req.body.id === undefined || !req.body.id) {
    res.status(400).send({ message: "SampleType id can not be empty!" });
    return;
  }

  let id = req.body.id;
  try {
    const data = await SampleType.findByIdAndRemove(id, { useFindAndModify: false });
    if (!data)
      res.status(404).send({
        message: `Cannot delete object with id = ${id}. Maybe object was not found!`,
      });
    else {
      SampleType.find().then((data) => {
        res.send(data);
      });
    }
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
};
exports.uploadSampleTypeCSV = async function (req, res) {
  const parsedCSV = CSV.parse(req.body.data);
  try {
    for (let i = 1; i < parsedCSV.length; i++) {
      let aCSV = parsedCSV[i];
      let query = { sampleType_id: aCSV[0] };
      let update = {
        sampleType: aCSV[1],
        material: String(aCSV[2]) === 'true' ? true : false,
        client: String(aCSV[3]) === 'true' ? true : false,
        packingType: String(aCSV[4]) === 'true' ? true : false,
        stockSample: String(aCSV[5]) === 'true' ? true : false,
        dueDate: String(aCSV[6]) === 'true' ? true : false,
        sampleDate: String(aCSV[7]) === 'true' ? true : false,
        sendingDate: String(aCSV[8]) === 'true' ? true : false,
        analysisType: String(aCSV[9]) === 'true' ? true : false,
        incomingProduct: String(aCSV[10]) === 'true' ? true : false,
        distributor: String(aCSV[11]) === 'true' ? true : false,
        certificateType: String(aCSV[12]) === 'true' ? true : false,
        remark: aCSV[13],
      };
      if (parsedCSV[0].indexOf('Id') > -1) {
        update._id = aCSV[14];
      }
      let options = {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
        useFindAndModify: false,
      };
      await SampleType.findOneAndUpdate(query, update, options);
    }
    SampleType.find().then((data) => {
      res.send(data);
    });
  } catch (err) {
    console.log(err)
    res.status(500).send({ message: err.message });
  }
};

exports.checkSampleType = async (req, res) => {
  try {
    let id = req.body.id;
    const result = await InputLab.find({ sample_type: mongoose.Types.ObjectId(id) })
    return res.json({ changeable: result.length === 0 });
  } catch (err) {
    return res.status(500).json({ message: 'Server error' })
  }
}
