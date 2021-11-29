const jwt = require("jsonwebtoken");
const InputLaboratory = require("../models/inputLaboratory");
const Client = require("../models/clients");
const UserType = require("../models/userTypes");
const CSV = require("csv-string");
const moment = require("moment");

exports.getAllData = function (req, res) {
  InputLaboratory.find()
    .populate("Weight.user", ["_id", "userName"])
    .populate("Charge.user", ["_id", "userName"])
    .then((data) => {
      return res.send(data);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.createInputLaboratory = function (req, res) {
  if (req.body === undefined || req.body.sample_type === undefined) {
    res.status(400).send({ message: "Sample name can not be empty!" });
    return;
  }

  let inputLaboratory = new InputLaboratory({
    self_analysis_cnt: req.body.analysiscnt,
    self_certificate_cnt: req.body.certificatecnt,
    stockinfo: req.body.vvState,
    sample_type: req.body.sample_type,
    material: req.body.material,
    client: req.body.client,
    packing_type: req.body.packing_type,
    due_date: moment(req.body.due_date).format("YYYY-MM-DD"),
    sample_date: moment(req.body.sample_date).format("YYYY-MM-DD"),
    sending_date: moment(req.body.sending_date).format("YYYY-MM-DD"),
    a_types: req.body.a_types,
    c_types: req.body.c_types,
    distributor: req.body.distributor,
    geo_locaion: req.body.geo_locaion,
    remark: req.body.remark,
    client_id: req.body.client_id,
    delivering: req.body.delivering,
  });

  inputLaboratory
    .save()
    .then((data) => {
      InputLaboratory.find().then((item) => {
        return res.send(item);
      });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.updateInputLaboratory = function (req, res) {
  if (req.body === undefined || req.body.id === undefined || !req.body.id) {
    res.status(400).send({ message: "InputLaboratory id can not be empty!" });
    return;
  }

  let id = req.body.id;

  InputLaboratory.findByIdAndUpdate(
    id,
    {
      sample_type: req.body.sample_type,
      material: req.body.material,
      client: req.body.client,
      packing_type: req.body.packing_type,
      due_date: moment(req.body.due_date).format("YYYY-MM-DD"),
      sample_date: moment(req.body.sample_date).format("YYYY-MM-DD"),
      sending_date: moment(req.body.sending_date).format("YYYY-MM-DD"),
      a_types: req.body.a_types,
      c_types: req.body.c_types,
      distributor: req.body.distributor,
      geo_locaion: req.body.geo_locaion,
      remark: req.body.remark,
      client_id: req.body.client_id,
      delivering: req.body.delivering,
    },
    { useFindAndModify: false }
  )
    .then((data) => {
      if (!data)
        res.status(404).send({
          message: `Cannot update object with id = ${id}. Maybe object was not found!`,
        });
      else {
        InputLaboratory.find().then((data) => {
          return res.send(data);
        });
      }
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Could not update object with id = " + id });
    });
};

exports.deleteInputLaboratory = function (req, res) {
  if (req.body === undefined || req.body.id === undefined || !req.body.id) {
    res.status(400).send({ message: "InputLaboratory id can not be empty!" });
    return;
  }

  let id = req.body.id;

  InputLaboratory.findByIdAndRemove(id, { useFindAndModify: false })
    .then((data) => {
      if (!data)
        res.status(404).send({
          message: `Cannot delete object with id = ${id}. Maybe object was not found!`,
        });
      else {
        InputLaboratory.find().then((data) => {
          return res.send(data);
        });
      }
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Could not delete object with id = " + id });
    });
};

exports.uploadLaboratoryCSV = async function (req, res) {
  const parsedCSV = CSV.parse(req.body.data);

  let update = { delivering: {} };

  if (parsedCSV.length > 0) {
    await InputLaboratory.deleteMany();
  }

  // try {
  for (let j = 1; j < parsedCSV.length; j++) {
    for (let i = 0; i < parsedCSV[0].length; i++) {
      if (parsedCSV[0][i] === "Due Date") {
        update.due_date = parsedCSV[j][i];
      }
      if (parsedCSV[0][i] === "Sample Type") {
        update.sample_type = parsedCSV[j][i];
      }
      if (parsedCSV[0][i] === "Material") {
        update.material = parsedCSV[j][i];
      }
      if (parsedCSV[0][i] === "Client") {
        let data = "";
        await Client.findOne({ name: parsedCSV[j][i] }).then((res) => {
          data = res._id;
        });
        update.client = parsedCSV[j][i];
        update.client_id = data;
      }
      if (parsedCSV[0][i] === "Packing Type") {
        update.packing_type = parsedCSV[j][i];
      }
      if (parsedCSV[0][i] === "Analysis Type") {
        let analysis = parsedCSV[j][i].split(",");
        if (parsedCSV[j][i] === "") {
          analysis = [];
        }
        update.a_types = analysis;
      }
      if (parsedCSV[0][i] === "Certificate") {
        let certificate = parsedCSV[j][i].split(",");
        if (parsedCSV[j][i] === "") {
          certificate = [];
        }
        update.c_types = certificate;
      }
      if (parsedCSV[0][i] === "Sending Date") {
        update.sending_date = parsedCSV[j][i];
      }
      if (parsedCSV[0][i] === "Sample Date") {
        update.sample_date = parsedCSV[j][i];
      }
      if (parsedCSV[0][i] === "Distributor") {
        update.distributor = parsedCSV[j][i];
      }
      if (parsedCSV[0][i] === "Geo Location") {
        update.geo_locaion = parsedCSV[j][i];
      }
      if (parsedCSV[0][i] === "Remark") {
        update.remark = parsedCSV[j][i];
      }
      if (parsedCSV[0][i] === "Delivering.Address.Name1") {
        update.delivering.address_name1 = parsedCSV[j][i];
      }
      if (parsedCSV[0][i] === "Delivering.Address.Name2") {
        update.delivering.address_name2 = parsedCSV[j][i];
      }
      if (parsedCSV[0][i] === "Delivering.Address.Name3") {
        update.delivering.address_name3 = parsedCSV[j][i];
      }
      if (parsedCSV[0][i] === "Delivering.Address.Title") {
        update.delivering.address_title = parsedCSV[j][i];
      }
      if (parsedCSV[0][i] === "Delivering.Address.Country") {
        update.delivering.address_country = parsedCSV[j][i];
      }
      if (parsedCSV[0][i] === "Delivering.Address.Street") {
        update.delivering.address_street = parsedCSV[j][i];
      }
      if (parsedCSV[0][i] === "Delivering.Address.ZIP") {
        update.delivering.address_zip = parsedCSV[j][i];
      }
      if (parsedCSV[0][i] === "CustomProductCode") {
        update.delivering.customer_product_code = parsedCSV[j][i];
      }
      if (parsedCSV[0][i] === "E-mail Address") {
        let emails = parsedCSV[j][i].split(",");
        if (parsedCSV[j][i] === "") {
          emails = [];
        }
        update.delivering.email_address = emails;
      }
      if (parsedCSV[0][i] === "Fetch Date") {
        update.delivering.fetch_date = parsedCSV[j][i];
      }
      if (parsedCSV[0][i] === "Order.ID") {
        update.delivering.order_id = parsedCSV[j][i];
      }
      if (parsedCSV[0][i] === "Pos.ID") {
        update.delivering.pos_id = parsedCSV[j][i];
      }
      if (parsedCSV[0][i] === "Weight(target") {
        update.delivering.w_target = parsedCSV[j][i];
      }
    }

    let laboratory1 = new InputLaboratory(update);
    await laboratory1.save();
  }

  await InputLaboratory.find().then((data) => {
    return res.send(data);
  });
  // } catch (err) {
  //   res.status(500).send({ message: err.message });
  // }
};

exports.getUserTypes = function (req, res) {
  let token = jwt.decode(req.body.token);
  UserType.findOne({ userType: token.userType }).then((data) => {
    if (data) {
      if (data.userType === "General Admin" || data.labAdmin === true) {
        return res.send({ accept_visible: true });
      } else {
        return res.send({ accept_visible: false });
      }
    }
  });
};

exports.addWeight = function (req, res) {
  if (req.body === undefined) {
    res.status(400).send({ message: "InputLaboratory id can not be empty!" });
    return;
  }

  let token = jwt.decode(req.body.token);

  let WeightHistory = [];

  if (req.body.data.id === "") {
    WeightHistory.push({
      weight: req.body.data.weight,
      update_date: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
      user: token.id,
      comment: req.body.comment,
    });

    InputLaboratory.findByIdAndUpdate(req.body.data.parent_id, {
      $push: {
        Weight: WeightHistory,
      },
      $set: {
        material_left: req.body.material_left,
      },
    })
      .then((data) => {
        InputLaboratory.find()
          .populate("Weight.user", ["_id", "userName"])
          .then((laboratory) => {
            return res.send(laboratory);
          })
          .catch((err) => res.status(500).send({ message: err.message }));
      })
      .catch((err) => res.status(500).send({ message: err.message }));
  } else {
    InputLaboratory.findOne({
      _id: req.body.data.parent_id,
      "Weight._id": req.body.data.id,
      "Weight.weight": req.body.data.weight,
    }).then((data) => {
      if (!data) {
        WeightHistory.push({
          weight: req.body.data.weight,
          update_date: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
          user: token.id,
          comment: req.body.comment,
        });

        InputLaboratory.findByIdAndUpdate(req.body.data.parent_id, {
          $push: {
            Weight: WeightHistory,
          },
          $set: {
            material_left: req.body.material_left,
          },
        })
          .then((data) => {
            InputLaboratory.find()
              .populate("Weight.user", ["_id", "userName"])
              .then((laboratory) => {
                return res.send(laboratory);
              })
              .catch((err) => res.status(500).send({ message: err.message }));
          })
          .catch((err) => res.status(500).send({ message: err.message }));
      }
    });
  }
};

exports.addCharge = function (req, res) {
  if (req.body === undefined) {
    res.status(400).send({ message: "InputLaboratory id can not be empty!" });
    return;
  }

  let token = jwt.decode(req.body.token);

  let ChargeHistory = [];

  if (req.body.data.id === "") {
    ChargeHistory.push({
      charge: moment(req.body.data.charge).format("YYYY-MM-DD HH:mm:ss"),
      update_date: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
      user: token.id,
      comment: req.body.comment,
    });

    InputLaboratory.findByIdAndUpdate(req.body.data.parent_id, {
      $push: {
        Charge: ChargeHistory,
      },
    })
      .then((data) => {
        InputLaboratory.find()
          .populate("Charge.user", ["_id", "userName"])
          .then((laboratory) => {
            res.send(laboratory);
          });
      })
      .catch((err) => res.status(500).send({ message: err.message }));
  } else {
    InputLaboratory.findOne({
      _id: req.body.parent_id,
      "Charge._id": req.body.data.id,
      "Charge.charge": req.body.data.charge,
    }).then((data) => {
      if (!data) {
        ChargeHistory.push({
          charge: moment(req.body.data.charge).format("YYYY-MM-DD HH:mm:ss"),
          update_date: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
          user: token.id,
          comment: req.body.comment,
        });

        InputLaboratory.findByIdAndUpdate(req.body.data.parent_id, {
          $push: {
            Charge: ChargeHistory,
          },
        })
          .then((data) => {
            InputLaboratory.find()
              .populate("Charge.user", ["_id", "userName"])
              .then((laboratory) => {
                res.send(laboratory);
              })
              .catch((err) => res.status(500).send({ message: err.message }));
          })
          .catch((err) => res.status(500).send({ message: err.message }));
      }
    });
  }
};

exports.add_material = (req, res) => {
  InputLaboratory.findById(req.body._id)
    .then((data) => {
      data.material_left = data.material_left - req.body.totalValue;
      data.save().then((e) => {
        InputLaboratory.find()
          .populate("Charge.user", ["_id", "userName"])
          .then((laboratory) => {
            res.send(laboratory);
          });
      });
    })
    .catch((err) => res.status(500).send({ message: err.message }));
};

exports.add_multi_material = (req, res) => {
  req.body.modaladdval.map((v) => {
    InputLaboratory.findById(v.id)
      .then((data1) => {
        data1.material_left = data1.material_left - v.val;
        data1.save().then();
      })
      .catch((err) => res.status(500).send({ message: err.message }));
  });
};

// Successful (Analysis, Certificate)
exports.analysis_mataterial = (req, res) => {
  InputLaboratory.findByIdAndUpdate(
    req.body.selfid,
    {
      a_types: req.body.analysisMerged,
    },
    { useFindAndModify: false }
  )
    .then((data) => {
      if (!data)
        res.status(404).send({
          message: "Error",
        });
      else {
        InputLaboratory.find().then((data) => {
          return res.send(data);
        });
      }
    })
    .catch((err) => {
      res.status(500).send({ message: "Error" });
    });
};

exports.certificate_mataterial = (req, res) => {
  InputLaboratory.findByIdAndUpdate(
    req.body.selfid,
    {
      c_types: req.body.certificateMerged,
    },
    { useFindAndModify: false }
  )
    .then((data) => {
      if (!data)
        res.status(404).send({
          message: "Error",
        });
      else {
        InputLaboratory.find().then((data) => {
          return res.send(data);
        });
      }
    })
    .catch((err) => {
      res.status(500).send({ message: "Error" });
    });
};

// Successful (Weight, Lot Number)
exports.weight_material = (req, res) => {
  InputLaboratory.findById(req.body.selfid)
    .then((e2) => {
      if (e2.Weight.length == 0) {
        let totalWeightValue = req.body.weight_value;
      } else {
        let totalWeightValue =
          Number(req.body.weight_value) +
          Number(e2.Weight[e2.Weight.length - 1].weight);
      }
      let weightarr = {
        weight: totalWeightValue,
        update_date: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
      };
      e2.Weight.push(weightarr);
      e2.save().then((data) => {
        InputLaboratory.find()
          .populate("Charge.user", ["_id", "userName"])
          .then((laboratory) => {
            res.send(laboratory);
          });
      });
    })
    .catch((error) => res.status(500).send({ message: error.message }));
};

exports.lot_material = (req, res) => {
  InputLaboratory.findByIdAndUpdate(
    req.body.selfid,
    {
      Charge: req.body.lotValue,
    },
    { useFindAndModify: false }
  )
    .then((data) => {
      if (!data)
        res.status(404).send({
          message: "Error",
        });
      else {
        InputLaboratory.find().then((data) => {
          return res.send(data);
        });
      }
    })
    .catch((err) => {
      res.status(500).send({ message: "Error" });
    });
};

exports.stocksample_material = (req, res) => {
  InputLaboratory.findByIdAndUpdate(
    req.body.selfid,
    {
      stockSample: req.body.sampleinfo,
    },
    { useFindAndModify: false }
  )
    .then((data) => {
      if (!data)
        res.status(404).send({
          message: "Error",
        });
      else {
        InputLaboratory.find().then((data) => {
          return res.send(data);
        });
      }
    })
    .catch((err) => {
      res.status(500).send({ message: "Error" });
    });
};
