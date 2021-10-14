
var CertificateType = require('../models/certificateTypes');
var AnalysisType = require('../models/analysisTypes');
var Objective = require('../models/objectives');
var Material = require('../models/materials');
var Client = require('../models/clients');
var Unit = require('../models/units');
var Packings = require('../models/packingTypes');
var CSV = require('csv-string');

exports.getAllCertificateTypes = async function(req, res) {
  try {
    const certificateTypes = await CertificateType.find();
    const objectives = await Objective.find();
    const analysises = await AnalysisType.find();
    const materials = await Material.find();
    const clients = await Client.find().select("_id, name");
    const units = await Unit.find().select("_id, unit");
    const packings = await Packings.find();

    res.send({certificateTypes, objectives, analysises, materials, clients, units, packings});
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
}

exports.createCertificateType = async function(req, res) {
    if (req.body === undefined || req.body.certificateType === undefined || !req.body.certificateType) {
        res.status(400).send({ message: "CertificateType name can not be empty!" });
        return;
    }

    var certificateType = new CertificateType({
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
  
      res.send({certificateTypes, objectives, analysises, materials, clients, units, packings});
    } catch (err) {
      res.status(500).send({ message: err.message });
    }
}

exports.updateCertificateType = async function(req, res) {
    if (req.body === undefined || req.body.id === undefined || !req.body.id) {
      res.status(400).send({ message: "CertificateType id can not be empty!" });
      return;
    }

    var id = req.body.id;
    
    try {
      const data = await CertificateType.findByIdAndUpdate(id, {
        material: req.body.material,
        client: req.body.client,
        certificateType_id: req.body.certificateType_id,
        certificateType: req.body.certificateType,
        analysises: req.body.analysises,
        remark: req.body.remark,
        packing : req.body.packing,
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
    
        res.send({certificateTypes, objectives, analysises, materials, clients, units, packings});
      }
    } catch (err) {
      res.status(500).send({ message: err.message });
    }
}

exports.deleteCertificateType = async function(req, res) {
    if (req.body === undefined || req.body.id === undefined || !req.body.id) {
        res.status(400).send({ message: "CertificateType id can not be empty!" });
        return;
    }

    var id = req.body.id;

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
    
        res.send({certificateTypes, objectives, analysises, materials, clients, units, packings});
      }
    } catch (err) {
      res.status(500).send({ message: err.message });
    }
}

exports.uploadCertificateTypeCSV = async function(req,res) {
  if (req.body === undefined) {
    res.status(400).send({ message: "PackingType name can not be empty!" });
    return;
  }
  const parsedCSV = CSV.parse(req.body.data);
  try{
    for (var i = 1; i < parsedCSV.length; i ++) {
      var aCSV = parsedCSV[i];
        material = aCSV[1].split('-');
        var material_temp = await Material.findOne({material:material[0]})
        var client = ''
        if(material[1] === 'Default'){
          client = ''
        }else{
          var client_temp = await Client.findOne({name:material[1]})
          client = client_temp._id;
        }
        var packing_temp = await Packings.findOne({packingType:aCSV[3]})
        var combinedata_list = [];
        if(aCSV[4] != ''){
          var combine = [];
          if(aCSV[4].indexOf('\n')=== -1){
            combine.push(aCSV[4]);
          }else{
            combine = aCSV[4].split('\n');
          }
          for(var j=0; j<combine.length; j++){
            var combine_temp = combine[j].split(' - ');
            var analysisType_data = await AnalysisType.findOne({analysisType: combine_temp[0]});
            var temp = combine_temp[1].split(' ');
            
            var one_objective = await Objective.findOne({objective:temp[0]});
            var one_unit = await Unit.findOne({unit:temp[1]});
            var objective_data = [];
            objective_data.push({id:one_objective._id, unit:one_unit._id});
            var flag = null;
            for(var k=0; k < combinedata_list.length; k++){
              if(combinedata_list[k].id == analysisType_data._id.toString()){
                flag = k;
                break;
              }
            }
            if(flag != null){
              combinedata_list[flag].objectives.push({id:one_objective._id, unit:one_unit._id});
            }else{
              combinedata_list.push({id:analysisType_data._id, objectives: objective_data});
            }
            
          }
        }
        
        let query = { certificateType_id: aCSV[0] };
        let update = {
          material:material_temp._id,
          client:client,
          certificateType:aCSV[2],
          analysises:combinedata_list,
          packing:packing_temp._id,
          remark:aCSV[5],
        };
        let options = {upsert: true, new: true, setDefaultsOnInsert: true, useFindAndModify: false};
        await CertificateType.findOneAndUpdate(query, update, options)
    }
    const certificateTypes = await CertificateType.find();
    res.send(certificateTypes);
  }
  catch (err){
    res.status(500).send({ message: err.message });
  }
}