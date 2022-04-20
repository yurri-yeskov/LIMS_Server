const mongoose = require('mongoose');
const AnalysisInputHistory = require('../models/AnalysisInputHistory')
const ObjectiveHistory = require("../models/objectiveHistory");
const Reason = require("../models/reasonModel");
const CSV = require('csv-string');

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

  let reason = new Reason({
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

  let id = req.body.id;

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

exports.deleteReason = async function (req, res) {
  if (req.body === undefined || req.body.id === undefined || !req.body.id) {
    res.status(400).send({ message: "Reason id can not be empty!" });
    return;
  }

  let id = req.body.id;
  try {
    const reason = await Reason.findById(id);
    let result = await AnalysisInputHistory.find({ reason: reason.reason })
    const _deleteable1 = result.length === 0;
    result = await ObjectiveHistory.find({ reason: reason.reason })
    const _deleteable2 = result.length === 0;

    if (!_deleteable1 || !_deleteable2) return res.status(400).json({ message: 'This reason has been already used in Analysis Input History or Objective Input History' });

    const data = await Reason.findByIdAndRemove(id, { useFindAndModify: false });
    if (!data)
      res.status(404).send({
        message: `Cannot delete object with id = ${id}. Maybe object was not found!`,
      });
    else {
      Reason.find().then((data) => {
        res.send(data);
      });
    }
  } catch (err) {
    return res.status(500).json({ message: 'Server error' })
  }
};
exports.uploadReasonCSV = async function (req, res) {
  if (req.body === undefined) {
    res.status(400).send({ message: "PackingType name can not be empty!" });
    return;
  }
  const parsedCSV = CSV.parse(req.body.data);
  try {
    for (let i = 1; i < parsedCSV.length; i++) {
      let aCSV = parsedCSV[i];
      let query = { reason_id: aCSV[0] };
      let update = {
        reason: aCSV[1],
        remark: aCSV[2],
      };
      if (parsedCSV[0].indexOf('Id') > -1) {
        update._id = aCSV[3];
      }
      let options = { upsert: true, new: true, setDefaultsOnInsert: true, useFindAndModify: false };
      await Reason.findOneAndUpdate(query, update, options)
    }
    Reason.find().then(data => {
      res.send(data);
    })
  }
  catch (err) {
    res.status(500).send({ message: err.message });
  }
}