var Material = require('../models/materials');
var Objective = require('../models/objectives');
var Unit = require('../models/units');
var Client = require('../models/clients');
const AnalysisTypes = require('../models/analysisTypes');
var CSV = require('csv-string');

exports.getAllMaterials = async function(req, res) {
  try {
    const materials = await Material.find();
    const objectives = await Objective.find();
    const analysisTypes = await AnalysisTypes.find();
    const units = await Unit.find();
    const clients = await Client.find().select("_id, name");

    res.send({materials, objectives, analysisTypes, units, clients});
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
}

exports.createMaterial = async function(req, res) {
    if (req.body === undefined || req.body.material === undefined || !req.body.material) {
        res.status(400).send({ message: "Material name can not be empty!" });
        return;
    }

    var objectiveValues = req.body.objectiveValues;
    var aTypesValues = req.body.aTypesValues;
    for (var i = 0; i < aTypesValues.length; i++) {
      objectiveValues[i]["analysis"] = aTypesValues[i]["value"];
      objectiveValues[i]["min"] = aTypesValues[i]["min"];
      objectiveValues[i]["max"] = aTypesValues[i]["max"];
    }
    var material = new Material({
      material_id: req.body.material_id,
      material: req.body.material,
      objectiveValues: objectiveValues,
      aTypesValues: req.body.aTypesValues,
      clients: req.body.clients,
      remark: req.body.remark
    });

    try {
      await material.save();
      const materials = await Material.find();
      const objectives = await Objective.find();
      const analysisTypes = await AnalysisTypes.find();
      const units = await Unit.find();
      const clients = await Client.find().select("_id, name");
  
      res.send({materials, objectives, analysisTypes, units, clients});
    } catch (err) {
      res.status(500).send({ message: err.message });
    }
}

exports.updateMaterial = async function(req, res) {
    if (req.body === undefined || req.body.id === undefined || !req.body.id) {
      res.status(400).send({ message: "Material id can not be empty!" });
      return;
    }

    var id = req.body.id;
    
    try {
      const data = await Material.findByIdAndUpdate(id, {
        material_id: req.body.material_id,
        material: req.body.material,
        objectiveValues: req.body.objectiveValues,
        aTypesValues: req.body.aTypesValues,
        clients: req.body.clients,
        remark: req.body.remark},
        { useFindAndModify: false }); 
      if (!data)
        res.status(404).send({ message: `Cannot update object with id = ${id}. Maybe object was not found!` });
      else {
        const materials = await Material.find();
        const objectives = await Objective.find();
        const analysisTypes = await AnalysisTypes.find();
        const units = await Unit.find();
        const clients = await Client.find().select("_id, name");
    
        res.send({materials, objectives, analysisTypes, units, clients});
      }
    } catch (err) {
      res.status(500).send({ message: err.message });
    }
}

exports.deleteMaterial = async function(req, res) {
    if (req.body === undefined || req.body.id === undefined || !req.body.id) {
        res.status(400).send({ message: "Material id can not be empty!" });
        return;
    }

    var id = req.body.id;

    try {
      const data = await Material.findByIdAndRemove(id, { useFindAndModify: false })
      if (!data)
        res.status(404).send({ message: `Cannot update object with id = ${id}. Maybe object was not found!` });
      else {
        const materials = await Material.find();
        const objectives = await Objective.find();
        const analysisTypes = await AnalysisTypes.find();
        const units = await Unit.find();
        const clients = await Client.find().select("_id, name");
    
        res.send({materials, objectives, analysisTypes, units, clients});
      }
    } catch (err) {
      res.status(500).send({ message: err.message });
    }
}
exports.uploadMaterialCSV = async function(req, res) {
  if (req.body === undefined) {
    res.status(400).send({ message: "Material CSV can not be empty!" });
    return;
  }
  const parsedCSV = CSV.parse(req.body.data);
  try{
    for (var i = 1; i < parsedCSV.length; i ++) {
      var aCSV = parsedCSV[i];
      var client_list = aCSV[2].split('\n');
      var client_id_list = [];
      for (var i = 1; i < client_list.length-1; i++) {
        var client = await Client.findOne({name:client_list[i]})
         client_id_list.push(client._id);
      }
      var aTypesValuesList = [];
      var objectiveValuesList = [];
      var combinations_group = aCSV[3].split('\n');
      for(var i = 0; i < combinations_group.length-1; i++){
        if(combinations_group[i] === 'No Objectives'){
           continue;
        }
        
        combiantions = combinations_group[i].split(', ');
        for (var j = 0; j < combiantions.length-1; j++) {
            var comb_temp = combiantions[j].split('-');          
            var split_content = comb_temp[1].split(' ');
            var analysis = await AnalysisTypes.findOne({analysisType:comb_temp[0]});
            var obj = await Objective.findOne({objective:split_content[0]});
            var unit_temp = await Unit.findOne({unit:split_content[1].split(':')[0]});
            var min_val = split_content[2].replace(/[^\d\.]*/g, "");
            var max_val = comb_temp[2].replace(/[^\d\.]*/g, "");
            var client_id = ''; 
            if(i === 0){
              client_id = '';
            }else{
              client_id = client_id_list[i-1];
            }
            aTypesValuesList.push({"client":client_id, "label": comb_temp[0],"max": max_val, "min": min_val, "obj":obj._id + '-'+unit_temp._id, "value":analysis._id});
            objectiveValuesList.push({analysis:analysis._id, client:client_id, id:obj._id,unit:unit_temp._id, min: min_val,max:max_val});
        }
      }
      
        let query = { material_id: aCSV[0] };
        let update = {
          material:aCSV[1],
          clients:client_id_list,
          aTypesValues:aTypesValuesList,
          objectiveValues:objectiveValuesList,
          remark:aCSV[4]
        };
        let options = {upsert: true, new: true, setDefaultsOnInsert: true, useFindAndModify: false};
        await Material.findOneAndUpdate(query, update, options)
    }
    const materials = await Material.find();
    res.send({materials});
  }
  catch (err){
    res.status(500).send({ message: err.message });
  }
}