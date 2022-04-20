const mongoose = require('mongoose');
const Objective = require('../models/objectives');
const Unit = require('../models/units');
const CSV = require('csv-string');
exports.getAllUnits = function (req, res) {
  Unit.find().then(data => {
    res.send(data);
  })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
}

exports.createUnit = function (req, res) {
  if (req.body === undefined || req.body.unit === undefined || !req.body.unit) {
    res.status(400).send({ message: "Unit name can not be empty!" });
    return;
  }

  let unit = new Unit({
    unit: req.body.unit,
    unit_id: req.body.unit_id,
    remark: req.body.remark
  });

  unit.save().then(data => {
    Unit.find().then(data => {
      res.send(data);
    })
  })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
}

exports.updateUnit = function (req, res) {
  if (req.body === undefined || req.body.id === undefined || !req.body.id) {
    res.status(400).send({ message: "Unit id can not be empty!" });
    return;
  }

  let id = req.body.id;

  Unit.findByIdAndUpdate(id, {
    unit: req.body.unit,
    unit_id: req.body.unit_id,
    remark: req.body.remark
  },
    { useFindAndModify: false }).then(data => {
      if (!data)
        res.status(404).send({ message: `Cannot update object with id = ${id}. Maybe object was not found!` });
      else {
        Unit.find().then(data => {
          res.send(data);
        })
      }
    })
    .catch(err => {
      res.status(500).send({ message: "Could not update object with id = " + id });
    });
}

exports.deleteUnit = async function (req, res) {
  if (req.body === undefined || req.body.id === undefined || !req.body.id) {
    res.status(400).send({ message: "Unit id can not be empty!" });
    return;
  }

  let id = req.body.id;
  try {
    const result = await Objective.aggregate([
      { $unwind: '$units' },
      { $match: { units: mongoose.Types.ObjectId(id) } }
    ])
    if (result.length > 0) return res.status(400).json({ message: 'This unit has been already used in Objective' });

    const data = await Unit.findByIdAndRemove(id, { useFindAndModify: false });
    if (!data)
      res.status(404).send({ message: `Cannot delete object with id = ${id}. Maybe object was not found!` });
    else {
      Unit.find().then(data => {
        res.send(data);
      })
    }
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
}
exports.uploadUnitCSV = async function (req, res) {
  if (req.body === undefined) {
    res.status(400).send({ message: "PackingType name can not be empty!" });
    return;
  }
  const parsedCSV = CSV.parse(req.body.data);
  try {
    for (let i = 1; i < parsedCSV.length; i++) {
      let aCSV = parsedCSV[i];
      let query = { unit_id: aCSV[0] };
      let _unit = aCSV[1].replace(/ /g, '_')
      _unit = _unit.replace(/-/g, '_')
      _unit = _unit.replace(/,/g, '')
      let update = {
        unit: _unit,
        remark: aCSV[2]
      };
      if (parsedCSV[0].indexOf('Id') > -1) {
        update._id = aCSV[3];
      }
      let options = { upsert: true, new: true, setDefaultsOnInsert: true, useFindAndModify: false };
      await Unit.findOneAndUpdate(query, update, options)
    }
    Unit.find().then(data => {
      res.send(data);
    })
  }
  catch (err) {
    res.status(500).send({ message: err.message });
  }
} 