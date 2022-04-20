
const Objective = require('../models/objectives');
const AnalysisType = require('../models/analysisTypes');
const Unit = require('../models/units');
const CSV = require('csv-string');

exports.getAllObjectives = async function (req, res) {
  try {
    const units = await Unit.find();
    const objectives = await Objective.find().populate('units')

    return res.json({
      units: units,
      objectives: objectives
    })
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
}

exports.createObjective = async function (req, res) {
  if (req.body === undefined || req.body.objective === undefined || !req.body.objective) {
    res.status(400).send({ message: "Objective name can not be empty!" });
    return;
  }

  try {
    let objective = new Objective({
      objective_id: req.body.objective_id,
      objective: req.body.objective,
      units: req.body.units,
      remark: req.body.remark
    });
    await objective.save();

    const units = await Unit.find();
    const objectives = await Objective.find().populate('units')

    return res.json({
      units: units,
      objectives: objectives
    })
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
}

exports.updateObjective = async function (req, res) {
  if (req.body === undefined || req.body.id === undefined || !req.body.id) {
    res.status(400).send({ message: "Objective id can not be empty!" });
    return;
  }

  let id = req.body.id;
  try {
    const data = await Objective.findById(id);
    if (data) {
      const data = await Objective.findByIdAndUpdate(id, {
        objective: req.body.objective,
        objective_id: req.body.objective_id,
        units: req.body.units,
        remark: req.body.remark
      },
        { useFindAndModify: false });

      if (!data)
        res.status(404).send({ message: `Cannot update object with id = ${id}. Maybe object was not found!` });
      else {
        const objectives = await Objective.find().populate('units');
        const units = await Unit.find();

        res.json({
          units: units,
          objectives: objectives
        });
      }
    }
    else {
      res.send({ status: 0 });
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
}

exports.checkObjective = async function (req, res) {
  try {
    const analysisTypes = await AnalysisType.find()
    const result = analysisTypes.filter(aType => aType.objectives.filter(obj => String(obj.id) === String(req.body.id)).length > 0)
    res.json({ status: result.length })
  } catch (err) {
    res.status(500).json("Server error!")
  }
}

exports.deleteObjective = async function (req, res) {
  if (req.body === undefined || req.body.id === undefined || !req.body.id) {
    res.status(400).send({ message: "Objective id can not be empty!" });
    return;
  }

  let id = req.body.id;

  try {
    const data = await Objective.findByIdAndRemove(id, { useFindAndModify: false })
    if (!data)
      res.status(404).send({ message: `Cannot update object with id = ${id}. Maybe object was not found!` });
    else {
      const objectives = await Objective.find();
      const units = await Unit.find();

      res.send({ units, objectives });
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
}

exports.uploadObjectiveCSV = async function (req, res) {
  const parsedCSV = CSV.parse(req.body.data);
  try {
    for (let i = 1; i < parsedCSV.length; i++) {
      let aCSV = parsedCSV[i];
      let unit_data = [];
      if (aCSV[2] !== '') {
        let units = [];
        if (aCSV[2].indexOf('\n') === -1) {
          units.push(aCSV[2])
        } else {
          units = aCSV[2].split('\n');
        }
        for (let j = 0; j < units.length; j++) {
          let temp = await Unit.findOne({ unit: units[j] })
          unit_data.push(temp._id);
        }
      }
      let query = { objective_id: aCSV[0] };
      let _objective = aCSV[1].replace(/ /g, '_')
      _objective = _objective.replace(/-/g, '_')
      _objective = _objective.replace(/,/g, '')
      let update = {
        objective: _objective,
        units: unit_data,
        remark: aCSV[3],
      };
      if (parsedCSV[0].indexOf('Id') > -1) {
        update._id = aCSV[4];
      }
      let options = { upsert: true, new: true, setDefaultsOnInsert: true, useFindAndModify: false };
      await Objective.findOneAndUpdate(query, update, options)
    }
    const objectives = await Objective.find().populate('units');
    res.send({ objectives });
  }
  catch (err) {
    console.log(err)
    res.status(500).send({ message: err.message });
  }
}