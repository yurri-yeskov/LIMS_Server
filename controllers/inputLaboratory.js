const jwt = require("jsonwebtoken");
var InputLaboratory = require("../models/inputLaboratory");
var Client = require("../models/clients");
var UserType = require("../models/userTypes");
var CSV = require("csv-string");
var moment = require("moment");
const { parse } = require("csv-string");

exports.getAllData = function (req, res) {
  InputLaboratory.find()
    .populate("Weight.user", ["_id", "userName"])
    .populate("Charge.user", ["_id", "userName"])
    .then((data) => {
      res.send(data);
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

  var inputLaboratory = new InputLaboratory({
    self_analysis_cnt: req.body.analysiscnt,
    self_certificate_cnt: req.body.certificatecnt,
    stockinfo: req.body.stocksampleinfo,
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
        res.send(item);
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

  var id = req.body.id;

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

exports.deleteInputLaboratory = function (req, res) {
  if (req.body === undefined || req.body.id === undefined || !req.body.id) {
    res.status(400).send({ message: "InputLaboratory id can not be empty!" });
    return;
  }

  var id = req.body.id;

  InputLaboratory.findByIdAndRemove(id, { useFindAndModify: false })
    .then((data) => {
      if (!data)
        res.status(404).send({
          message: `Cannot delete object with id = ${id}. Maybe object was not found!`,
        });
      else {
        InputLaboratory.find().then((data) => {
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

exports.uploadLaboratoryCSV = async function (req, res) {
  const parsedCSV = CSV.parse(req.body.data);

  var update = { delivering: {} };

  if (parsedCSV.length > 0) {
    await InputLaboratory.deleteMany();
  }

  // try {
  for (var j = 1; j < parsedCSV.length; j++) {
    for (var i = 0; i < parsedCSV[0].length; i++) {
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
        var data = "";
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
        var analysis = parsedCSV[j][i].split(",");
        if (parsedCSV[j][i] === "") {
          analysis = [];
        }
        update.a_types = analysis;
      }
      if (parsedCSV[0][i] === "Certificate") {
        var certificate = parsedCSV[j][i].split(",");
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
        var emails = parsedCSV[j][i].split(",");
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

    var laboratory1 = new InputLaboratory(update);
    await laboratory1.save();
  }

  await InputLaboratory.find().then((data) => {
    res.send(data);
  });
  // } catch (err) {
  //   res.status(500).send({ message: err.message });
  // }
};

exports.getUserTypes = function (req, res) {
  var token = jwt.decode(req.body.token);
  UserType.findOne({ userType: token.userType }).then((data) => {
    if (data) {
      if (data.userType === "General Admin" || data.labAdmin === true) {
        res.send({ accept_visible: true });
      } else {
        res.send({ accept_visible: false });
      }
    }
  });
};

exports.addWeight = function (req, res) {
  if (req.body === undefined) {
    res.status(400).send({ message: "InputLaboratory id can not be empty!" });
    return;
  }

  var token = jwt.decode(req.body.token);

  var WeightHistory = [];

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
            res.send(laboratory);
          });
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
                res.send(laboratory);
              });
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

  var token = jwt.decode(req.body.token);

  var ChargeHistory = [];

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
              });
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
      data
        .save()
        .then((e) => {
          InputLaboratory.find()
            .populate("Charge.user", ["_id", "userName"])
            .then((laboratory) => {
              res.send(laboratory);
            });
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => res.status(500).send({ message: err.message }));
};

exports.add_multi_material = (req, res) => {
  req.body.sendarrval.map((v) => {
    InputLaboratory.findById(v.id)
      .then((data1) => {
        data1.material_left = data1.material_left - v.val;
        data1
          .save()
          .then()
          .catch((err) => console.log(err));
      })
      .catch((err) => res.status(500).send({ message: err.message }));
  });
  InputLaboratory.findById(req.body.selfid)
    .then((data2) => {
      req.body.idstore.map((e) => {
        if (data2.idstore.filter((ee) => e == ee).length == 0) {
          data2.idstore.push(e);
        }
      });
      data2
        .save()
        .then()
        .catch((err) => console.log(err));
    })
    .catch((err) => res.status(500).send({ message: err.message }));
};

exports.del_material = (req, res) => {
  InputLaboratory.findById(req.body._id)
    .then((data) => {
      data.material_left =
        Number(data.material_left) + Number(req.body.mat_left);
      data
        .save()
        .then((e) => {
          InputLaboratory.find()
            .populate("Charge.user", ["_id", "userName"])
            .then((laboratory) => {
              return res.send(laboratory);
            });
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => res.status(500).send({ message: err.message }));
};

exports.sample_material = (req, res) => {
  var userid = "";
  var label = "";
  var limitValue = "";
  var id = "";
  var analysis = "";
  var obj_value = "";
  var min = "";
  var max = "";
  var unit = "";
  var update_date = "";
  var comment = "";
  var reason = "";
  var accept = "";

  var clientid = "";
  req.body.arrid.map((a) => {
    InputLaboratory.find({ _id: a }).then((doc1) => {
      clientid = doc1[doc1.length - 1].client_id;
      clientName = doc1[doc1.length - 1].client;
      InputLaboratory.findByIdAndUpdate(req.body.selfid, {
        $set: { client_id: clientid, client: clientName },
      }).then();
    });

    ObjectiveHistory.find({ id: a })
      .then((doc) => {
        label = doc[doc.length - 1].label;
        userid = doc[doc.length - 1].userid;
        limitValue = doc[doc.length - 1].limitValue;
        id = req.body.onlyselfid;
        analysis = doc[doc.length - 1].analysis;
        obj_value = doc[doc.length - 1].obj_value;
        min = doc[doc.length - 1].min;
        max = doc[doc.length - 1].max;
        unit = doc[doc.length - 1].unit;
        update_date = doc[doc.length - 1].update_date;
        comment = doc[doc.length - 1].comment;
        reason = doc[doc.length - 1].reason;
        accept = doc[doc.length - 1].accept;

        new ObjectiveHistory({
          userid: userid,
          label: label,
          limitValue: limitValue,
          id: id,
          analysis: analysis,
          obj_value: obj_value,
          min: min,
          max: max,
          unit: unit,
          update_date: update_date,
          comment: comment,
          reason: reason,
          accept: accept,
        })
          .save()
          .then()
          .catch((err) => res.status(500).send({ message: err.message }));
      })
      .catch((err) => res.status(500).send({ message: err.message }));
  });

  req.body.sampleinfo.map((e) => {
    InputLaboratory.findById(req.body.selfid)
      .then((e3) => {
        if (e3.stockSample != e) {
          if (e3.stockSample.filter((v) => v == e).length == 0) {
            e3.stockSample.push(e);
          }
        }
        e3.save()
          .then()
          .catch((err) => res.status(500).send({ message: err.message }));
      })
      .catch((err) => res.status(500).send({ message: err.message }));
  });

  InputLaboratory.findByIdAndUpdate(
    req.body.selfid,
    {
      // c_types: req.body.certificate,
      stockinfo: "2",
    },
    function (err, docs) {
      if (err) {
        console.log(err);
      } else {
        console.log("Updated User : ", docs);
      }
    }
  );
  req.body.analysisType.map((e) => {
    InputLaboratory.findById(req.body.selfid)
      .then((e4) => {
        e4.a_types.push(e);
        e4.save()
          .then()
          .catch((err) => res.status(500).send({ message: err.message }));
      })
      .catch((err) => res.status(500).send({ message: err.message }));
  });

  req.body.certificate.map((e) => {
    InputLaboratory.findById(req.body.selfid)
      .then((e5) => {
        e5.c_types.push(e);
        e5.save()
          .then()
          .catch((err) => res.status(500).send({ message: err.message }));
      })
      .catch((err) => res.status(500).send({ message: err.message }));
  });
};

exports.weight_material = (req, res) => {
  InputLaboratory.findById(req.body.selfid)
    .then((e2) => {
      if (e2.Weight.length == 0) {
        var allVal = req.body.tSum;
      } else {
        var allVal =
          Number(req.body.tSum) +
          Number(e2.Weight[e2.Weight.length - 1].weight);
      }

      var weightarr = {
        weight: allVal,
        update_date: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
      };
      e2.Weight.push(weightarr);
      e2.save()
        .then((er) => {
          InputLaboratory.find()
            .populate("Charge.user", ["_id", "userName"])
            .then((laboratory) => {
              res.send(laboratory);
            });
        })
        .catch((err) => res.status(500).send({ message: err.message }));
    })
    .catch((err) => res.status(500).send({ message: err.message }));
};

exports.lot_material = (req, res) => {
  req.body.lotcharge.map((e) => {
    InputLaboratory.findById(req.body.selfid)
      .then((e4) => {
        var lotarr = {
          charge: e,
          update_date: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
        };

        if (e4.Charge.length == 0) {
          e4.Charge.push(lotarr);
        } else {
          if (e4.Charge.filter((c) => c.charge == e).length == 0) {
            e4.Charge.push(lotarr);
          }
        }

        e4.save()
          .then()
          // .then((er) => {
          //   InputLaboratory.find()
          //     .populate("Charge.user", ["_id", "userName"])
          //     .then((laboratory) => {
          //       res.send(laboratory);
          //     });
          // })
          .catch((err) => res.status(500).send({ message: err.message }));
      })
      .catch((err) => res.status(500).send({ message: err.message }));
  });
};

exports.Del_material = (req, res) => {
  var stockid = req.body.stockid.toString();
  InputLaboratory.findById(req.body.selfid)
    .then((data) => {
      data.stockSample.map((v, i) => {
        if (v.id == stockid) {
          let makearr = v.val.split(" ");
          var stockarr =
            Number(makearr[makearr.length - 1]) - Number(req.body.mat_left);
          makearr[makearr.length - 1] = stockarr;
          var changed = "";
          makearr.map((v1) => {
            changed = changed + v1 + " ";
          });
          v.val = changed.trim();
        }
      });
      var ChVal = data.stockSample;
      InputLaboratory.findById(req.body.selfid).then((e1) => {
        e1.stockSample = ChVal;
        e1.save().then((er) => console.log(er));
      });
    })
    .catch((err) => res.status(500).send({ message: err.message }));
};
