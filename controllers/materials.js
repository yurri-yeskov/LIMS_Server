const Material = require('../models/materials');
const Objective = require('../models/objectives');
const Unit = require('../models/units');
const Client = require('../models/clients');
const AnalysisTypes = require('../models/analysisTypes');
const CSV = require('csv-string');

exports.getAllMaterials = async function (req, res) {
  try {
    const materials = await Material.find().populate(['clients']);
    // const materials = await Material.find();
    const objectives = await Objective.find().populate('units');
    const analysisTypes = await AnalysisTypes.find();
    const units = await Unit.find();
    const clients = await Client.find();

    const obj_units = await Objective.aggregate([
      {
        $lookup: {
          from: 'units',
          localField: 'units',
          foreignField: '_id',
          as: 'unitsData'
        }
      },
      { $unwind: '$unitsData' },
      {
        $project: {
          _id: 1,
          objective: 1,
          unit: '$unitsData.unit',
          unit_id: '$unitsData._id',
        }
      },
      { $unwind: '$_id' },
      { $unwind: '$objective' },
      { $unwind: '$unit' },
      { $unwind: '$unit_id' },
      {
        "$addFields": {
          "obj_id": { "$toString": "$_id" },
          "u_id": { "$toString": "$unit_id" }
        }
      },
      { $unwind: '$obj_id' },
      { $unwind: '$u_id' },
      {
        $project: {
          label: { $concat: ['$objective', ' ', '$unit'] },
          value: { $concat: ['$obj_id', '-', '$u_id'] },
        }
      }
    ])

    res.send({ materials, objectives, analysisTypes, units, clients, obj_units });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
}

exports.createMaterial = async function (req, res) {
  if (req.body === undefined || req.body.material === undefined || !req.body.material) {
    res.status(400).send({ message: "Material name can not be empty!" });
    return;
  }

  let objectiveValues = req.body.objectiveValues;
  let aTypesValues = req.body.aTypesValues;
  for (let i = 0; i < aTypesValues.length; i++) {
    objectiveValues[i]["analysis"] = aTypesValues[i]["value"];
    objectiveValues[i]["min"] = aTypesValues[i]["min"];
    objectiveValues[i]["max"] = aTypesValues[i]["max"];
  }
  let material = new Material({
    material_id: req.body.material_id,
    material: req.body.material,
    objectiveValues: objectiveValues,
    aTypesValues: req.body.aTypesValues,
    clients: req.body.clients,
    remark: req.body.remark
  });

  try {
    await material.save();
    const materials = await Material.find().populate(['clients']);
    const objectives = await Objective.find().populate('units');
    const analysisTypes = await AnalysisTypes.find();
    const units = await Unit.find();
    const clients = await Client.find();
    const obj_units = await Objective.aggregate([
      {
        $lookup: {
          from: 'units',
          localField: 'units',
          foreignField: '_id',
          as: 'unitsData'
        }
      },
      { $unwind: '$unitsData' },
      {
        $project: {
          _id: 1,
          objective: 1,
          unit: '$unitsData.unit',
          unit_id: '$unitsData._id',
        }
      },
      { $unwind: '$_id' },
      { $unwind: '$objective' },
      { $unwind: '$unit' },
      { $unwind: '$unit_id' },
      {
        "$addFields": {
          "obj_id": { "$toString": "$_id" },
          "u_id": { "$toString": "$unit_id" }
        }
      },
      { $unwind: '$obj_id' },
      { $unwind: '$u_id' },
      {
        $project: {
          label: { $concat: ['$objective', ' ', '$unit'] },
          value: { $concat: ['$obj_id', '-', '$u_id'] },
        }
      }
    ])

    res.send({ materials, objectives, analysisTypes, units, clients, obj_units });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
}

exports.updateMaterial = async function (req, res) {
  if (req.body === undefined || req.body.id === undefined || !req.body.id) {
    res.status(400).send({ message: "Material id can not be empty!" });
    return;
  }

  let id = req.body.id;

  try {
    const data = await Material.findByIdAndUpdate(id, {
      material_id: req.body.material_id,
      material: req.body.material,
      objectiveValues: req.body.objectiveValues,
      aTypesValues: req.body.aTypesValues,
      clients: req.body.clients,
      remark: req.body.remark
    },
      { useFindAndModify: false });
    if (!data)
      res.status(404).send({ message: `Cannot update object with id = ${id}. Maybe object was not found!` });
    else {
      const materials = await Material.find().populate(['clients']);
      const objectives = await Objective.find().populate('units');
      const analysisTypes = await AnalysisTypes.find();
      const units = await Unit.find();
      const clients = await Client.find().select("_id, name");
      const obj_units = await Objective.aggregate([
        {
          $lookup: {
            from: 'units',
            localField: 'units',
            foreignField: '_id',
            as: 'unitsData'
          }
        },
        { $unwind: '$unitsData' },
        {
          $project: {
            _id: 1,
            objective: 1,
            unit: '$unitsData.unit',
            unit_id: '$unitsData._id',
          }
        },
        { $unwind: '$_id' },
        { $unwind: '$objective' },
        { $unwind: '$unit' },
        { $unwind: '$unit_id' },
        {
          "$addFields": {
            "obj_id": { "$toString": "$_id" },
            "u_id": { "$toString": "$unit_id" }
          }
        },
        { $unwind: '$obj_id' },
        { $unwind: '$u_id' },
        {
          $project: {
            label: { $concat: ['$objective', ' ', '$unit'] },
            value: { $concat: ['$obj_id', '-', '$u_id'] },
          }
        }
      ])

      res.send({ materials, objectives, analysisTypes, units, clients, obj_units });
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
}

exports.deleteMaterial = async function (req, res) {
  if (req.body === undefined || req.body.id === undefined || !req.body.id) {
    res.status(400).send({ message: "Material id can not be empty!" });
    return;
  }

  let id = req.body.id;

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

      res.send({ materials, objectives, analysisTypes, units, clients });
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
}

exports.uploadMaterialCSV = async function (req, res) {
  if (req.body === undefined) {
    res.status(400).send({ message: "Material CSV can not be empty!" });
    return;
  }
  const parsedCSV = CSV.parse(req.body.data);
  try {
    for (let i = 1; i < parsedCSV.length; i++) {
      let aCSV = parsedCSV[i];
      let client_list = aCSV[2].split('\n');
      let client_id_list = [];
      for (let i = 1; i < client_list.length - 1; i++) {
        let client = await Client.findOne({ name: client_list[i] })
        client_id_list.push(client._id);
      }
      let aTypesValuesList = [];
      let objectiveValuesList = [];
      let combinations_group = aCSV[3].split('\n');
      for (let i = 0; i < combinations_group.length - 1; i++) {
        if (combinations_group[i] === 'No Objectives') {
          continue;
        }

        combiantions = combinations_group[i].split(', ');
        for (let j = 0; j < combiantions.length - 1; j++) {
          let comb_temp = combiantions[j].split('-');
          let split_content = comb_temp[1].split(' ');
          let analysis = await AnalysisTypes.findOne({ analysisType: comb_temp[0] });
          let obj = await Objective.findOne({ objective: split_content[0] });
          let unit_temp = await Unit.findOne({ unit: split_content[1].split(':')[0] });
          let min_val = split_content[2].replace(/[^\d\.]*/g, "");
          let max_val = comb_temp[2].replace(/[^\d\.]*/g, "");
          let client_id = '';
          if (i === 0) {
            client_id = '';
          } else {
            client_id = client_id_list[i - 1];
          }
          aTypesValuesList.push({ "client": client_id, "label": comb_temp[0], "max": max_val, "min": min_val, "obj": obj._id + '-' + unit_temp._id, "value": analysis._id });
          objectiveValuesList.push({ analysis: analysis._id, client: client_id, id: obj._id, unit: unit_temp._id, min: min_val, max: max_val });
        }
      }

      let query = { material_id: aCSV[0] };
      let update = {
        material: aCSV[1],
        clients: client_id_list,
        aTypesValues: aTypesValuesList,
        objectiveValues: objectiveValuesList,
        remark: aCSV[4]
      };
      let options = { upsert: true, new: true, setDefaultsOnInsert: true, useFindAndModify: false };
      await Material.findOneAndUpdate(query, update, options)
    }
    const materials = await Material.find().populate(['clients']);
    res.send({ materials });
  }
  catch (err) {
    res.status(500).send({ message: err.message });
  }
}