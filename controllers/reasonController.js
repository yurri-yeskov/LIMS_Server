var Reason = require("../models/reasonModel");
var CSV = require('csv-string');

exports.getAllReason = function (req, res) {
  Reason.find()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.createReason = function (req, res) {
  if (
    req.body === undefined ||
    req.body.reason === undefined ||
    !req.body.reason
  ) {
    res.status(400).send({ message: "Reason name can not be empty!" });
    return;
  }

  var reason = new Reason({
    reason_id: req.body.reason_id,
    reason: req.body.reason,
    remark: req.body.remark,
  });

  reason
    .save()
    .then((data) => {
      Reason.find().then((data) => {
        res.send(data);
      });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.updateReason = function (req, res) {
  if (req.body === undefined || req.body.id === undefined || !req.body.id) {
    res.status(400).send({ message: "Reason id can not be empty!" });
    return;
  }

  var id = req.body.id;

  Reason.findByIdAndUpdate(
    id,
    {
      reason_id: req.body.reason_id,
      reason: req.body.reason,
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
        Reason.find().then((data) => {
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

exports.deleteReason = function (req, res) {
  if (req.body === undefined || req.body.id === undefined || !req.body.id) {
    res.status(400).send({ message: "Reason id can not be empty!" });
    return;
  }

  var id = req.body.id;

  Reason.findByIdAndRemove(id, { useFindAndModify: false })
    .then((data) => {
      if (!data)
        res.status(404).send({
          message: `Cannot delete object with id = ${id}. Maybe object was not found!`,
        });
      else {
        Reason.find().then((data) => {
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
exports.uploadReasonCSV = async function(req, res){
  if (req.body === undefined) {
    res.status(400).send({ message: "PackingType name can not be empty!" });
    return;
  }
  const parsedCSV = CSV.parse(req.body.data);
  try{
    for (var i = 1; i < parsedCSV.length; i ++) {
      var aCSV = parsedCSV[i];
        let query = { reason_id: aCSV[0] };
        let update = {
          reason:aCSV[1],
          remark:aCSV[2],
        };
        let options = {upsert: true, new: true, setDefaultsOnInsert: true, useFindAndModify: false};
        await Reason.findOneAndUpdate(query, update, options)
    }
    Reason.find().then(data => {
      res.send(data);
    })
  }
  catch (err){
    res.status(500).send({ message: err.message });
  }
}