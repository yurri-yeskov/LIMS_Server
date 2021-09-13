const ObjectiveHistory = require("../models/objectiveHistory");
const Unit = require("../models/units");
var jwt = require("jsonwebtoken");
const moment = require("moment");

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
  console.log(req.body);

  var token = jwt.decode(req.body.token);
  var objectiveHistory = [];

  req.body.data.map((item) => {
    if (item._id !== undefined) {
      ObjectiveHistory.findOne({
        _id: item._id,
        limitValue: item.value,
        min: item.min,
        max: item.max,
      }).then((history) => {
        if (history) {
          ObjectiveHistory.findByIdAndUpdate(
            item._id,
            {
              userid: token.id,
              limitValue: item.value,
              update_date: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
              // d.getFullYear() + '-' + month + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds()
            },
            { useFindAndModify: false }
          )
            .then((data) => {
              if (!data)
                res.status(404).send({
                  message: `Cannot update object with id = ${id}. Maybe object was not found!`,
                });
              else {
                ObjectiveHistory.find().then((data) => {
                  res.send(data);
                });
              }
            })
            .catch((err) => {
              res
                .status(500)
                .send({ message: "Could not update object with id = " + id });
            });
        } else {
          objectiveHistory = new ObjectiveHistory({
            userid: token.id,
            label: item.label,
            limitValue: item.value,
            comment: req.body.comment,
            id: item.id,
            analysis: item.analysis,
            obj_value: item.obj_value,
            min: item.min,
            max: item.max,
            unit: item.unit,
            update_date: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
            // d.getFullYear() + '-' + month + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds()
          });

          objectiveHistory.save().then((data) => {
            ObjectiveHistory.find()
              .populate("userid", ["_id", "userName"])
              .then((item) => {
                res.send(item);
              });
          });
        }
      });
    } else {
      console.log("!");
      objectiveHistory = new ObjectiveHistory({
        userid: token.id,
        label: item.label,
        limitValue: item.value,
        comment: req.body.comment,
        id: item.id,
        analysis: item.analysis,
        obj_value: item.obj_value,
        min: item.min,
        max: item.max,
        unit: item.unit,
        update_date: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
        // d.getFullYear() + '-' + month + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds()
      });

      objectiveHistory.save().then((data) => {
        ObjectiveHistory.find()
          .populate("userid", ["_id", "userName"])
          .then((item) => {
            res.send(item);
          })
          .catch((err) => console.log(err));
      });
    }
  });
};
