var Reason = require("../models/reasonModel");

exports.getAllReason = function (req, res) {
  Reason.find()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.createReason = function (req, res) {
  if (
    req.body === undefined ||
    req.body.reason === undefined ||
    !req.body.reason
  ) {
    res.status(400).send({ message: "Reason name can not be empty!" });
    return;
  }

  var reason = new Reason({
    reason: req.body.reason,
    remark: req.body.remark,
  });

  reason
    .save()
    .then((data) => {
      Reason.find().then((data) => {
        res.send(data);
      });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.updateReason = function (req, res) {
  if (req.body === undefined || req.body.id === undefined || !req.body.id) {
    res.status(400).send({ message: "Reason id can not be empty!" });
    return;
  }

  var id = req.body.id;

  Reason.findByIdAndUpdate(
    id,
    {
      reason: req.body.reason,
      remark: req.body.remark,
    },
    { useFindAndModify: false }
  )
    .then((data) => {
      if (!data)
        res.status(404).send({
          message: `Cannot update object with id = ${id}. Maybe object was not found!`,
        });
      else {
        Reason.find().then((data) => {
          res.send(data);
        });
      }
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Could not update object with id = " + id });
    });
};

exports.deleteReason = function (req, res) {
  if (req.body === undefined || req.body.id === undefined || !req.body.id) {
    res.status(400).send({ message: "Reason id can not be empty!" });
    return;
  }

  var id = req.body.id;

  Reason.findByIdAndRemove(id, { useFindAndModify: false })
    .then((data) => {
      if (!data)
        res.status(404).send({
          message: `Cannot delete object with id = ${id}. Maybe object was not found!`,
        });
      else {
        Reason.find().then((data) => {
          res.send(data);
        });
      }
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Could not delete object with id = " + id });
    });
};
