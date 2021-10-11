const jwt = require("jsonwebtoken");
var InputLaboratory = require("../models/inputLaboratory");
var Client = require("../models/clients");
var moment = require("moment");
const objectiveHistory = require("../models/objectiveHistory");

exports.getGraphData = function (req, res) {
    if (req.body === undefined) {
        res.status(400).send({ message: "Chart can't display without filter!" });
        return;
    }
    var token = jwt.decode(req.body.token);
    var query = {
        material: req.body.data.material,
        client_id: req.body.data.client,
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

exports.getObjectiveHistoryData = function(req, res) {
    if (req.body === undefined) {
        res.status(400).send({ message: "Chart can't display without filter!" });
        return;
    }
    var query = {id: {$in: req.body.data }};
    objectiveHistory.find(query)
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({ message: err.message });
        });
}