const InputLaboratory = require("../models/inputLaboratory");
const Language = require("../models/language");
const objectiveHistory = require("../models/objectiveHistory");

exports.getGraphData = function (req, res) {
    if (req.body === undefined) {
        res.status(400).send({ message: "Chart can't display without filter!" });
        return;
    }
    let query = {
        material: {$in : req.body.data.material},
        client_id: {$in : req.body.data.client},
        a_types:{$in:req.body.data.combinations},
        'Charge.charge':{ $gte: req.body.data.dateRange[0], $lte: req.body.data.dateRange[1] }
    }
    InputLaboratory.find(query)
        .then((data)=> {
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({ message: err.message });
        });
}
exports.getAvailableanalysisType = function(req, res) {
    if (req.body === undefined) {
        res.status(400).send({ message: "Chart can't display without filter!" });
        return;
    }
    let query = {
        material: {$in : req.body.data.material},
        client_id: {$in : req.body.data.client}
    }
    InputLaboratory.find(query)
    .then((data)=> {
        res.send(data);
    })
    .catch((err) => {
        res.status(500).send({ message: err.message });
    });
}
exports.getinputlaboratorybyid = function(req, res) {
    if (req.body === undefined) {
        res.status(400).send({ message: "Chart can't display without filter!" });
        return;
    }
    let query = {
        _id: req.body.data,
    }
    InputLaboratory.findOne(query)
    .then((data)=> {
        res.send(data);
    })
    .catch((err) => {
        res.status(500).send({ message: err.message });
    });
}
exports.getObjectiveHistoryData = function(req, res) {
    if (req.body === undefined) {
        res.status(400).send({ message: "Chart can't display without filter!" });
        return;
    }
    let query = {id: {$in: req.body.data }};
    objectiveHistory.find(query)
        .populate("userid", ["_id", "userName"])
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({ message: err.message });
        });
}

exports.getLanguage = function(req, res) {
    Language.find()
    .then((data)=> {
        res.send(data);
    })
    .catch((err) => {
        res.status(500).send({ message: err.message });
    });
}   