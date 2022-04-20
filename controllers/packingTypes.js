
const PackingType = require('../models/packingTypes');
const CSV = require('csv-string');

exports.getAllPackingTypes = function (req, res) {
  PackingType.find().then(data => {
    res.send(data);
  })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
}

exports.createPackingType = function (req, res) {
  if (req.body === undefined || req.body.packingType === undefined || !req.body.packingType) {
    res.status(400).send({ message: "PackingType name can not be empty!" });
    return;
  }

  let packingType = new PackingType({
    packingType_id: req.body.packingType_id,
    packingType: req.body.packingType,
    remark: req.body.remark
  });

  packingType.save().then(data => {
    PackingType.find().then(data => {
      res.send(data);
    })
  })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
}

exports.updatePackingType = function (req, res) {
  if (req.body === undefined || req.body.id === undefined || !req.body.id) {
    res.status(400).send({ message: "PackingType id can not be empty!" });
    return;
  }

  let id = req.body.id;

  PackingType.findByIdAndUpdate(id, {
    packingType_id: req.body.packingType_id,
    packingType: req.body.packingType,
    remark: req.body.remark
  },
    { useFindAndModify: false }).then(data => {
      if (!data)
        res.status(404).send({ message: `Cannot update object with id = ${id}. Maybe object was not found!` });
      else {
        PackingType.find().then(data => {
          res.send(data);
        })
      }
    })
    .catch(err => {
      res.status(500).send({ message: "Could not update object with id = " + id });
    });
}

exports.deletePackingType = function (req, res) {
  if (req.body === undefined || req.body.id === undefined || !req.body.id) {
    res.status(400).send({ message: "PackingType id can not be empty!" });
    return;
  }

  let id = req.body.id;

  PackingType.findByIdAndRemove(id, { useFindAndModify: false }).then(data => {
    if (!data)
      res.status(404).send({ message: `Cannot delete object with id = ${id}. Maybe object was not found!` });
    else {
      PackingType.find().then(data => {
        res.send(data);
      })
    }
  })
    .catch(err => {
      res.status(500).send({ message: "Could not delete object with id = " + id });
    });
}
exports.uploadPackingTypeCSV = async function (req, res) {
  if (req.body === undefined) {
    res.status(400).send({ message: "PackingType name can not be empty!" });
    return;
  }
  const parsedCSV = CSV.parse(req.body.data);
  try {
    for (let i = 1; i < parsedCSV.length; i++) {
      let aCSV = parsedCSV[i];
      let query = { packingType_id: aCSV[0] };
      let update = {
        packingType: aCSV[1],
        remark: aCSV[2],
      };
      if (parsedCSV[0].indexOf('Id') > -1) {
        update._id = aCSV[3];
      }
      let options = { upsert: true, new: true, setDefaultsOnInsert: true, useFindAndModify: false };
      await PackingType.findOneAndUpdate(query, update, options)
    }
    PackingType.find().then(data => {
      res.send(data);
    })
  }
  catch (err) {
    res.status(500).send({ message: err.message });
  }
}