
var AnalysisType = require('../models/analysisTypes');
var Objective = require('../models/objectives');
var Unit = require('../models/units');
var CSV = require('csv-string');
exports.getAllAnalysisTypes = async function(req, res) {
  try {
    const analysisTypes = await AnalysisType.find();
    const objectives = await Objective.find();
    const units = await Unit.find();

    res.send({analysisTypes, objectives, units});
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
}

exports.createAnalysisType = async function(req, res) {
    if (req.body === undefined || req.body.analysisType === undefined || !req.body.analysisType) {
        res.status(400).send({ message: "AnalysisType name can not be empty!" });
        return;
    }

    var analysisType = new AnalysisType({
        analysisType_id: req.body.analysisType_id,
        analysisType: req.body.analysisType,
        norm: req.body.norm,
        objectives: req.body.objectives,
        remark: req.body.remark
    });

    try {
      await analysisType.save();
      const analysisTypes = await AnalysisType.find();
      const objectives = await Objective.find();
      const units = await Unit.find();
  
      res.send({analysisTypes, objectives, units});
    } catch (err) {
      res.status(500).send({ message: err.message });
    }
}

exports.updateAnalysisType = async function(req, res) {
    if (req.body === undefined || req.body.id === undefined || !req.body.id) {
      res.status(400).send({ message: "AnalysisType id can not be empty!" });
      return;
    }

    var id = req.body.id;
    
    try {
      const data = await AnalysisType.findByIdAndUpdate(id, {
        analysisType_id: req.body.analysisType_id,
        analysisType: req.body.analysisType,
        norm: req.body.norm,
        objectives: req.body.objectives,
        remark: req.body.remark},
        { useFindAndModify: false }); 
      if (!data)
        res.status(404).send({ message: `Cannot update object with id = ${id}. Maybe object was not found!` });
      else {
        const analysisTypes = await AnalysisType.find();
        const objectives = await Objective.find();
        const units = await Unit.find();
    
        res.send({analysisTypes, objectives, units});
      }
    } catch (err) {
      res.status(500).send({ message: err.message });
    }
}

exports.deleteAnalysisType = async function(req, res) {
    if (req.body === undefined || req.body.id === undefined || !req.body.id) {
        res.status(400).send({ message: "AnalysisType id can not be empty!" });
        return;
    }

    var id = req.body.id;

    try {
      const data = await AnalysisType.findByIdAndRemove(id, { useFindAndModify: false })
      if (!data)
        res.status(404).send({ message: `Cannot update object with id = ${id}. Maybe object was not found!` });
      else {
        const analysisTypes = await AnalysisType.find();
        const objectives = await Objective.find();
        const units = await Unit.find();
    
        res.send({analysisTypes, objectives, units});
      }
    } catch (err) {
      res.status(500).send({ message: err.message });
    }
}
exports.uploadAnalysisTypeCSV = async function(req, res){
  if (req.body === undefined) {
    res.status(400).send({ message: "AnalysisType CSV can not be empty!" });
    return;
  }
  const parsedCSV = CSV.parse(req.body.data);

  try{
    for (var i = 1; i < parsedCSV.length; i ++) {
      var aCSV = parsedCSV[i];
      var objective_data = [];
      if(aCSV[3] != ''){
        var objectives = aCSV[3].split('\n');
        for(var j = 0; j < objectives.length-1;j++){
          var temp = objectives[j].split(' ');
          var one_objective = await Objective.findOne({objective:temp[0]});
          var one_unit = await Unit.findOne({unit:temp[1]});
          objective_data.push({id:one_objective._id, unit:one_unit._id});
        }
      }
      let query = { analysisType_id: aCSV[0] };
      let update = {
        analysisType:aCSV[1],
        norm:aCSV[2],
        objectives:objective_data,
        remark:aCSV[4]
      };
      let options = {upsert: true, new: true, setDefaultsOnInsert: true, useFindAndModify: false};
      await AnalysisType.findOneAndUpdate(query, update, options)
    }
    const analysisTypes = await AnalysisType.find();
    res.send({analysisTypes});
  }
  catch (err){
    res.status(500).send({ message: err.message });
  }
}