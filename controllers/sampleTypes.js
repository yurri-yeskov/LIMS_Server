var SampleType = require("../models/sampleTypes");
var CSV = require("csv-string");

exports.getAllSampleTypes = function (req, res) {
  SampleType.find()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
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

  var sampleType = new SampleType({
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

  var id = req.body.id;

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

exports.deleteSampleType = function (req, res) {
  if (req.body === undefined || req.body.id === undefined || !req.body.id) {
    res.status(400).send({ message: "SampleType id can not be empty!" });
    return;
  }

  var id = req.body.id;

  SampleType.findByIdAndRemove(id, { useFindAndModify: false })
    .then((data) => {
      if (!data)
        res.status(404).send({
          message: `Cannot delete object with id = ${id}. Maybe object was not found!`,
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
        .send({ message: "Could not delete object with id = " + id });
    });
};
exports.uploadSampleTypeCSV = async function (req, res) {
  const parsedCSV = CSV.parse(req.body.data);
  try {
    for (var i = 1; i < parsedCSV.length; i++) {
      var aCSV = parsedCSV[i];
      let query = { sampleType_id: aCSV[0] };
      if (aCSV[2] === "") {
        aCSV[2] = false;
      } else if (aCSV[2] === "TRUE") {
        aCSV[2] = true;
      }
      if (aCSV[3] === "") {
        aCSV[3] = false;
      } else if (aCSV[3] === "TRUE") {
        aCSV[3] = true;
      }
      if (aCSV[4] === "") {
        aCSV[4] = false;
      } else if (aCSV[4] === "TRUE") {
        aCSV[4] = true;
      }
      if (aCSV[5] === "") {
        aCSV[5] = false;
      } else if (aCSV[5] === "TRUE") {
        aCSV[5] = true;
      }
      if (aCSV[6] === "") {
        aCSV[6] = false;
      } else if (aCSV[6] === "TRUE") {
        aCSV[6] = true;
      }
      if (aCSV[7] === "") {
        aCSV[7] = false;
      } else if (aCSV[7] === "TRUE") {
        aCSV[7] = true;
      }
      if (aCSV[8] === "") {
        aCSV[8] = false;
      } else if (aCSV[8] === "TRUE") {
        aCSV[8] = true;
      }
      if (aCSV[9] === "") {
        aCSV[9] = false;
      } else if (aCSV[9] === "TRUE") {
        aCSV[9] = true;
      }
      if (aCSV[10] === "") {
        aCSV[10] = false;
      } else if (aCSV[10] === "TRUE") {
        aCSV[10] = true;
      }
      if (aCSV[11] === "") {
        aCSV[11] = false;
      } else if (aCSV[11] === "TRUE") {
        aCSV[11] = true;
      }
      if (aCSV[12] === "") {
        aCSV[12] = false;
      } else if (aCSV[12] === "TRUE") {
        aCSV[12] = true;
      }
      let update = {
        sampleType: aCSV[1],
        stockSample: aCSV[2],
        material: aCSV[3],
        client: aCSV[4],
        packingType: aCSV[5],
        dueDate: aCSV[6],
        sampleDate: aCSV[7],
        sendingDate: aCSV[8],
        analysisType: aCSV[9],
        incomingProduct: aCSV[10],
        distributor: aCSV[11],
        certificateType: aCSV[12],
        remark: aCSV[13],
      };
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
    res.status(500).send({ message: err.message });
  }
};
