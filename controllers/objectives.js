
var Objective = require('../models/objectives');
var Unit = require('../models/units');
var CSV = require('csv-string');

exports.getAllObjectives = async function(req, res) {
  try {
    const objectives = await Objective.find();
    const units = await Unit.find();

    res.send({units, objectives});
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
}

exports.createObjective = async function(req, res) {
    if (req.body === undefined || req.body.objective === undefined || !req.body.objective) {
        res.status(400).send({ message: "Objective name can not be empty!" });
        return;
    }

    var objective = new Objective({
      objective_id: req.body.objective_id,
      objective: req.body.objective,
      units: req.body.units,
      remark: req.body.remark
    });

    try {
      const existing = await Objective.find({objective: req.body.objective});
      if (existing.length > 0) {
        res.send({ status: 0 });
      }
      else {
        await objective.save();
        const objectives = await Objective.find();
        const units = await Unit.find();
    
        res.send({units, objectives});
      }
    } catch (err) {
      res.status(500).send({ message: err.message });
    }
}

exports.updateObjective = async function(req, res) {
    if (req.body === undefined || req.body.id === undefined || !req.body.id) {
      res.status(400).send({ message: "Objective id can not be empty!" });
      return;
    }

    var id = req.body.id;
    
    try {
      const existing = await Objective.find({objective: req.body.objective});
      if (existing.length > 0 && existing[0]._id != id) {
        res.send({ status: 0 });
      }
      else {
        const data = await Objective.findByIdAndUpdate(id, {
          objective: req.body.objective,
          objective_id: req.body.objective_id,
          units: req.body.units,
          remark: req.body.remark},
          { useFindAndModify: false }); 
        if (!data)
          res.status(404).send({ message: `Cannot update object with id = ${id}. Maybe object was not found!` });
        else {
          const objectives = await Objective.find();
          const units = await Unit.find();
      
          res.send({units, objectives});
        }
      }
    } catch (err) {
      res.status(500).send({ message: err.message });
    }
}

exports.deleteObjective = async function(req, res) {
    if (req.body === undefined || req.body.id === undefined || !req.body.id) {
        res.status(400).send({ message: "Objective id can not be empty!" });
        return;
    }

    var id = req.body.id;

    try {
      const data = await Objective.findByIdAndRemove(id, { useFindAndModify: false })
      if (!data)
        res.status(404).send({ message: `Cannot update object with id = ${id}. Maybe object was not found!` });
      else {
        const objectives = await Objective.find();
        const units = await Unit.find();
    
        res.send({units, objectives});
      }
    } catch (err) {
      res.status(500).send({ message: err.message });
    }
}

exports.uploadObjectiveCSV = async function(req, res){
  const parsedCSV = CSV.parse(req.body.data);
  try{
    for (var i = 1; i < parsedCSV.length; i ++) {
      var aCSV = parsedCSV[i];
      var unit_data = [];
      if(aCSV[2] != ''){
        var units = [];
        if(aCSV[2].indexOf('\n') === -1){
          units.push(aCSV[2])
        }else{
          units = aCSV[2].split('\n');
        }
        for(var j=0; j< units.length; j++){
          var temp = await Unit.findOne({unit:units[j]})
          unit_data.push(temp._id);
        }
      }
        let query = { objective_id: aCSV[0] };
        let update = {
          objective:aCSV[1],
          units:unit_data,
          remark:aCSV[3]
        };
        let options = {upsert: true, new: true, setDefaultsOnInsert: true, useFindAndModify: false};
        await Objective.findOneAndUpdate(query, update, options)
    }
    const objectives = await Objective.find();
    res.send({objectives});
  }
  catch (err){
    res.status(500).send({ message: err.message });
  }
}