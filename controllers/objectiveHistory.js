const ObjectiveHistory = require("../models/objectiveHistory");
const Unit = require("../models/units");
var jwt = require("jsonwebtoken");
const moment = require("moment");
const async = require("async");

exports.getObjectiveHistory = async function (req, res) {
  try {
    const unit = await Unit.find();
    const objectivehistory = await ObjectiveHistory.find().populate("userid", [
      "_id",
      "userName",
    ]);

    res.send({ unit, objectivehistory });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.createObjectiveHistory = function (req, res) {
  var token = jwt.decode(req.body.token);
  var objectiveHistory = [];

  req.body.data.map((item) => {
    if (item.value === undefined) {
      var value = 0;
      objectiveHistory = new ObjectiveHistory({
        userid: token.id,
        label: item.label,
        limitValue: value,
        comment: req.body.comment,
        id: item.id,
        analysis: item.analysis,
        obj_value: item.obj_value,
        min: item.min,
        max: item.max,
        unit: item.unit,
        update_date: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
        reason: item.reason,
        accept: item.accept,
      });

      objectiveHistory.save().then((data) => {
        async.mapSeries(
          item,
          function (data, callback) {
            ObjectiveHistory.find()
              .populate("userid", ["_id", "userName"])
              .then((data) => {
                return callback(null, data);
              });
          },
          function (err, result) {
            res.send(result[result.length - 1]);
          }
        );
      });
    } else if (item._id !== undefined) {
      ObjectiveHistory.findOne({
        _id: item._id,
        limitValue: item.value,
        min: item.min,
        max: item.max,
      }).then((history) => {
        var value = 0;
        if (!history) {
          if (item.value !== "") {
            value = item.value;
          }
          objectiveHistory = new ObjectiveHistory({
            userid: token.id,
            label: item.label,
            limitValue: value,
            comment: req.body.comment,
            id: item.id,
            analysis: item.analysis,
            obj_value: item.obj_value,
            min: item.min,
            max: item.max,
            unit: item.unit,
            update_date: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
            reason: item.reason,
            accept: item.accept,
          });

          objectiveHistory.save().then((data) => {
            async.mapSeries(
              item,
              function (data, callback) {
                ObjectiveHistory.find()
                  .populate("userid", ["_id", "userName"])
                  .then((data) => {
                    return callback(null, data);
                  });
              },
              function (err, result) {
                res.send(result[result.length - 1]);
              }
            );
          });
        }
      });
    } else {
      var value = 0;
      if (item.value !== "") {
        value = item.value;
      }
      objectiveHistory = new ObjectiveHistory({
        userid: token.id,
        label: item.label,
        limitValue: value,
        comment: req.body.comment,
        id: item.id,
        analysis: item.analysis,
        obj_value: item.obj_value,
        min: item.min,
        max: item.max,
        unit: item.unit,
        update_date: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
        reason: item.reason,
        accept: item.accept,
      });

      objectiveHistory.save().then((data) => {
        async.mapSeries(
          item,
          function (data, callback) {
            ObjectiveHistory.find()
              .populate("userid", ["_id", "userName"])
              .then((data) => {
                return callback(null, data);
              });
          },
          function (err, result) {
            res.send(result[result.length - 1]);
          }
        );
      });
    }
  });
};
