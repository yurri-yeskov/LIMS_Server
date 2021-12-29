const InputLaboratory = require("../models/inputLab");
const Language = require("../models/language");
const Material = require('../models/materials')
const AnalysisType = require('../models/analysisTypes')
const Objective = require('../models/objectives')
const Unit = require('../models/units')
const objectiveHistory = require("../models/objectiveHistory");

exports.getGraphData = async (req, res) => {
    if (req.body === undefined) {
        res.status(400).send({ message: "Chart can't display without filter!" });
        return;
    }

    const materials = await Material.find()
    const material_ids = materials.filter(m => req.body.data.material.indexOf(m.material) > -1)
        .map(mm => String(mm._id))

    let query = {
        material: { $in: material_ids },
        client: { $in: req.body.data.client },
        a_types: { $in: req.body.data.combinations },
        'charge.date': { $gte: req.body.data.dateRange[0], $lte: req.body.data.dateRange[1] }
    }
    // console.log(query)
    InputLaboratory.find(query)
        .populate(['material'])
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({ message: err.message });
        });
}
exports.getAvailableanalysisType = async (req, res) => {
    if (req.body === undefined) {
        res.status(400).send({ message: "Chart can't display without filter!" });
        return;
    }
    try {
        let objValues = []
        const materials = await Material.find({ material: { $in: req.body.data.material } })
        await Promise.all(materials.map(async (material) => {
            await material.objectiveValues.filter(obj => req.body.data.client.indexOf(String(obj.client)) > -1)
                .map(obj => objValues.push(obj))
        }))
        const analysisTypes = await AnalysisType.find()
        const units = await Unit.find()
        const objectives = await Objective.find()
        return res.json({
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