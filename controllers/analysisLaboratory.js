const mongoose = require('mongoose');
const InputLaboratory = require("../models/inputLab");
const Language = require("../models/language");
const Material = require('../models/materials')
const AnalysisType = require('../models/analysisTypes')
const Objective = require('../models/objectives')
const Unit = require('../models/units')
const objectiveHistory = require("../models/objectiveHistory");
const AnalysisInputHistory = require('../models/AnalysisInputHistory');


exports.getGraphData = async (req, res) => {
    if (req.body === undefined) {
        res.status(400).send({ message: "Chart can't display without filter!" });
        return;
    }
    console.log(req.body.data);
    const { combinations, dateRange, client, material } = req.body.data;    //combinations: aType-objective-unit-material-client
    try {
        const materials = await Material.find()
        const material_ids = materials.filter(m => material.indexOf(m.material) > -1)
            .map(mm => String(mm._id))

        var histories = [];
        var retValues = [];
        for (let i = 0; i < combinations.length; i++) {
            histories = [];
            let query = {
                material: { $in: material_ids },
                material_category: { $in: client },
                a_types: { $in: combinations[i].split('-')[0] },
                'charge.date': { $gte: dateRange[0], $lte: dateRange[1] }
            }
            var _material;
            const inputLabs = await InputLaboratory.find(query);
            // console.log("Input Laboratory: ", inputLabs);
            for (let j = 0; j < inputLabs.length; j++) {
                _material = await Material.findById(inputLabs[j].material);
                // console.log("Material: ", _material);
                if (_material.objectiveValues.filter(obj =>
                    String(obj.analysis) === String(combinations[i].split('-')[0]) &&
                    String(obj.id) === String(combinations[i].split('-')[1]) &&
                    String(obj.unit) === String(combinations[i].split('-')[2]) &&
                    String(obj.client) === String(inputLabs[j].material_category)).length > 0) {
                    const result = await AnalysisInputHistory.find({
                        labId: inputLabs[j]._id,
                        analysisId: mongoose.Types.ObjectId(combinations[i].split('-')[0])
                    }).populate(['user', 'labId']).sort({ date: -1 });
                    // console.log(">>>>>>>>>>", result);
                    histories.push(result);
                }
            }
            retValues.push({
                combination: combinations[i],
                history: histories
            })
        }
        if (retValues.length === 0) {
            combinations.map(com => {
                retValues.push({
                    combination: com,
                    history: []
                })
            })
        }
        // console.log(retValues);
        return res.json(retValues);
    } catch (err) {
        console.log(err);
        return res.status(500).json(err);
    }
}
exports.getAvailableanalysisType = async (req, res) => {
    if (req.body === undefined) {
        res.status(400).send({ message: "Chart can't display without filter!" });
        return;
    }
    try {
        let objValues = []
        let material_ids = []
        const materials = await Material.find({ material: { $in: req.body.data.material } })
        await Promise.all(materials.map(async (material) => {
            await material.objectiveValues.filter(obj => req.body.data.client.indexOf(String(obj.client)) > -1)
                .map(obj => {
                    objValues.push(obj);
                    material_ids.push(material._id)
                })
        }))
        const analysisTypes = await AnalysisType.find()
        const units = await Unit.find()
        const objectives = await Objective.find()
        return res.json({
            material_ids: material_ids,
            objValues: objValues,
            analysisTypes: analysisTypes,
            units: units,
            objectives: objectives
        })
    } catch (err) {
        return res.status(500).send({ message: err.message });
    }
}
exports.getinputlaboratorybyid = function (req, res) {
    if (req.body === undefined) {
        res.status(400).send({ message: "Chart can't display without filter!" });
        return;
    }
    let query = {
        _id: req.body.data,
    }
    InputLaboratory.findOne(query)
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({ message: err.message });
        });
}
exports.getObjectiveHistoryData = function (req, res) {
    if (req.body === undefined) {
        res.status(400).send({ message: "Chart can't display without filter!" });
        return;
    }
    let query = { id: { $in: req.body.data } };
    objectiveHistory.find(query)
        .populate("userid", ["_id", "userName"])
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({ message: err.message });
        });
}

exports.getLanguage = function (req, res) {
    Language.find()
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({ message: err.message });
        });
}   