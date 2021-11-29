const ClientModel = require("../models/clients");
const AnalyModel = require("../models/analysisTypes");
const Labo = require("../models/inputLaboratory");
const ObjModel = require("../models/objectives");
const UnitsModel = require("../models/units");
const HistoryModel = require("../models/objectiveHistory");
const UserModel = require("../models/users");
const CerModel = require("../models/certificateTypes");
const moment = require("moment");

exports.getaddress = function (req, res) {
  ClientModel.findById(req.body.id)
    .then((e) => {
      if (e) {
        return res.json(e);
      }
    })
    .catch((err) => console.log(err));
};
exports.getanaldata = async function (req, res) {
  let data = [];
  await Promise.all(
    req.body.productdata.map(async (v, i) => {
      let obj = { name: v.name, value: "" };
      if (v.pagename == 0) {
        await Labo.findById(req.body.rowid)
          .then((e) => {
            if (e) {
              if (v.fieldname == "Due Date")
                obj.value = moment(e.due_date).format(req.body.dateformat);
              else if (v.fieldname == "Sample Type") obj.value = e.sample_type;
              else if (v.fieldname == "Material") obj.value = e.material;
              else if (v.fieldname == "Client")
                obj.value = e.client.split("-")[0];
              else if (v.fieldname == "Packing Type")
                obj.value = e.packing_type;
              else if (v.fieldname == "Analysis Type") {
                let atypesvalue = "";
                e.a_types.map((item) => {
                  atypesvalue += "," + item;
                });
                obj.value = atypesvalue.substr(1, atypesvalue.length);
              } else if (v.fieldname == "Certificate") {
                let ctypesvalue = "";
                e.c_types.map((item) => {
                  ctypesvalue += "," + item;
                });
                obj.value = ctypesvalue.substr(1, ctypesvalue.length);
              } else if (v.fieldname == "Sending Date")
                obj.value = moment(e.sending_date).format(req.body.dateformat);
              else if (v.fieldname == "Sample Date")
                obj.value = moment(e.sample_date).format(req.body.dateformat);
              else if (v.fieldname == "Weight(actual)") {
                let wei = "";
                e.Weight.map((item) => {
                  wei += "," + item.weight;
                });
                obj.value = wei.substr(1, wei.length);
                let arr = obj.value.split(",");
                obj.value = arr[arr.length - 1];
              } else if (v.fieldname == "Charge") {
                let chargee = "";
                e.Charge.map((item) => {
                  chargee += "," + item.charge;
                });
                obj.value = chargee.substr(1, chargee.length);
                let arr = obj.value.split(",");
                obj.value = arr[arr.length - 1];
              } else if (v.fieldname == "Remark") obj.value = e.remark;
              else if (v.fieldname == "Delivering.Address.Name1") {
                obj.value = req.body.c_rowdata.delivering.address_name1;
              } else if (v.fieldname == "Delivering.Address.Title") {
                obj.value = req.body.c_rowdata.delivering.address_title;
              } else if (v.fieldname == "Delivering.Address.Country") {
                obj.value = req.body.c_rowdata.delivering.address_country;
              } else if (v.fieldname == "Delivering.Address.Name2") {
                obj.value = req.body.c_rowdata.delivering.address_name2;
              } else if (v.fieldname == "Delivering.Address.Name3") {
                obj.value = req.body.c_rowdata.delivering.address_name3;
              } else if (v.fieldname == "Delivering.Address.Street") {
                obj.value = req.body.c_rowdata.delivering.address_street;
              } else if (v.fieldname == "Delivering.Address.ZIP") {
                obj.value = req.body.c_rowdata.delivering.address_zip;
              } else if (v.fieldname == "CustomerProductCode") {
                obj.value = req.body.c_rowdata.delivering.customer_product_code;
              } else if (v.fieldname == "E-mail Address") {
                req.body.c_rowdata.delivering.email_address.map((v) => {
                  obj.value += "," + v;
                });
                obj.value = obj.value.substr(1, obj.value.length);
              } else if (v.fieldname == "FetchDate") {
                obj.value = moment(
                  req.body.c_rowdata.delivering.fetch_date
                ).format(req.body.dateformat);
              } else if (v.fieldname == "OrderId") {
                obj.value = req.body.c_rowdata.delivering.order_id;
              } else if (v.fieldname == "Pos.ID") {
                obj.value = req.body.c_rowdata.delivering.pos_id;
              } else if (v.fieldname == "Weight(target)") {
                obj.value = req.body.c_rowdata.delivering.w_target;
              }
            }
          })
          .catch((err) => {
            console.log(err);
          });
        data.push(obj);
      } else if (v.pagename == 1) {
        if (v.fieldname == "Analysis Type") {
          req.body.analdata.map((v) => {
            obj.value += "," + v;
          });
          obj.value = obj.value.substr(1, obj.value.length);
        } else if (v.fieldname == "Norm") {
          req.body.analdata.map((v) => {
            AnalyModel.find({ analysisType: v })
              .then((e) => {
                if (e) {
                  if (e.norm) {
                    obj.value += e.norm;
                  }
                }
              })
              .catch((err) => console.log(err));
          });
          obj.value = obj.value.substr(1, obj.value.length);
        } else if (v.fieldname == "Objectives") {
          await Promise.all(
            req.body.analdata.map(async (v) => {
              await AnalyModel.find({ analysisType: v })
                .then(async (e) => {
                  if (e) {
                    await Promise.all(
                      e[0].objectives.map(async (v) => {
                        let objvalue = await ObjModel.findById(v.id)
                          .then((re) => {
                            if (re) {
                              return re.objective;
                            }
                          })
                          .catch((err) => console.log(err));
                        let unitvalue = await UnitsModel.findById(v.unit)
                          .then((eu) => {
                            if (eu) {
                              return eu.unit;
                            }
                          })
                          .catch((err) => console.log(err));
                        obj.value += "," + objvalue + "-" + unitvalue;
                      })
                    );
                    obj.value = obj.value.substr(1, obj.value.length);
                  }
                })
                .catch((err) => console.log(err));
            })
          );
        } else if (v.fieldname == "Remark") {
          await Promise.all(
            req.body.analdata.map(async (v) => {
              await AnalyModel.find({ analysisType: v })
                .then((re) => {
                  if (re) {
                    obj.value += "," + re[0].remark;
                  }
                })
                .catch((err) => console.log(err));
            })
          );
          obj.value = obj.value.substr(1, obj.value.length);
        }
        data.push(obj);
      } else if (v.pagename == 2) {
        if (v.fieldname == "Name") {
          await ClientModel.findById(req.body.clientid)
            .then(async (v) => {
              if (v) {
                await (obj.value = v.name);
              }
            })
            .catch((err) => console.log(err));
        } else if (v.fieldname == "Country B") {
          await ClientModel.findById(req.body.clientid)
            .then(async (v) => {
              if (v) {
                await (obj.value = v.countryB);
              }
            })
            .catch((err) => console.log(err));
        } else if (v.fieldname == "Zip Code B") {
          await ClientModel.findById(req.body.clientid)
            .then(async (v) => {
              if (v) {
                await (obj.value = v.zipCodeB);
              }
            })
            .catch((err) => console.log(err));
        } else if (v.fieldname == "City B") {
          await ClientModel.findById(req.body.clientid)
            .then(async (v) => {
              if (v) {
                await (obj.value = v.cityB);
              }
            })
            .catch((err) => console.log(err));
        } else if (v.fieldname == "Address B") {
          await ClientModel.findById(req.body.clientid)
            .then(async (v) => {
              if (v) {
                await (obj.value = v.addressB);
              }
            })
            .catch((err) => console.log(err));
        } else if (v.fieldname == "Address2 B") {
          await ClientModel.findById(req.body.clientid)
            .then(async (v) => {
              if (v) {
                await (obj.value = v.address2B);
              }
            })
            .catch((err) => console.log(err));
        }
        data.push(obj);
      }
    })
  );

  return res.json(data);
};
exports.gethistorydata = async function (req, res) {
  const { data, rowid, analdata, dateformat, rowObj } = req.body;
  let tbldata = [];
  let res_data = {};
  let all_data = [];
  let filter_data = [];
  let allhis = await HistoryModel.find({ id: rowid })
    .then((v) => {
      if (v) {
        return v;
      }
    })
    .catch((err) => console.log(err));
  await Promise.all(
    rowObj.map(async (anal) => {
      await CerModel.findOne({
        certificateType: anal.certificate,
        client: anal.client,
        material: anal.material,
      }).then(async (cer) => {
        if (cer) {
          cer.analysises.map((item) => {
            if (item) {
              item.objectives.map((obj) => {
                if (obj) {
                  if (obj.id == anal.value && obj.unit == anal.unit_id) {
                    all_data.push(anal);
                  }
                }
              });
            }
          });
        }
      });
    })
  );

  filter_data = Array.from(
    all_data.reduce((a, o) => a.set(`${o.analysis}`, o), new Map()).values()
  );

  await Promise.all(
    filter_data.map(async (anal) => {
      await Promise.all(
        allhis.map(async (e) => {
          let rowdata = {};
          if (
            anal.label == e.label &&
            anal.value == e.obj_value &&
            anal.min == e.min &&
            anal.max == e.max &&
            anal.unit_id == e.unit
          ) {
            let variable_analdata = "";
            variable_analdata = e.analysis;
            await Promise.all(
              data.map(async (ev) => {
                if (ev.fieldname == 0) {
                  //Analysis Types
                  variable_analdata = e.analysis;
                  rowdata[ev.name] = e.analysis;
                } else if (ev.fieldname == 1) {
                  //value
                  rowdata[ev.name] = e.limitValue;
                } else if (ev.fieldname == 2) {
                  //author
                  let author = "";
                  await UserModel.findById(e.userid)
                    .then(async (et) => {
                      await (author = et.userName);
                    })
                    .catch((err) => console.log(err));
                  rowdata[ev.name] = author;
                } else if (ev.fieldname == 3) {
                  //data
                  rowdata[ev.name] = moment(e.update_date).format(dateformat);
                } else if (ev.fieldname == 4) {
                  //reason
                  rowdata[ev.name] = e.reason ? e.reason : "";
                } else if (ev.fieldname == 5) {
                  //spec
                  let str = "";
                  await Promise.all(
                    req.body.rowObj.map(async (item) => {
                      await CerModel.findOne({
                        certificateType: item.certificate,
                        material: item.material,
                        client: item.client,
                      }).then(async (certificate) => {
                        if (certificate) {
                          await certificate.analysises.map((temp) => {
                            if (temp) {
                              temp.objectives.map((v) => {
                                if (
                                  v.id === item.value &&
                                  v.unit === item.unit_id
                                ) {
                                  str = `[${e.min}, ${e.max}]`;
                                }
                              });
                            }
                          });
                        } else {
                          return false;
                        }
                      });
                    })
                  );
                  rowdata[ev.name] = str;
                } else if (ev.fieldname == 6) {
                  //comment
                  rowdata[ev.name] = e.comment ? e.comment : "";
                } else if (ev.fieldname == 7) {
                  rowdata[ev.name] = req.body.selectCertificate
                    ? req.body.selectCertificate
                    : "";
                } else if (ev.fieldname == 8) {
                  // AnalysisTypes-Objective
                  let str = "";
                  await Promise.all(
                    req.body.rowObj.map(async (item) => {
                      await CerModel.findOne({
                        certificateType: item.certificate,
                        material: item.material,
                        client: item.client,
                      }).then(async (certificate) => {
                        if (certificate) {
                          await certificate.analysises.map((temp) => {
                            if (temp) {
                              temp.objectives.map((v) => {
                                if (
                                  v.id === item.value &&
                                  v.unit === item.unit_id &&
                                  item.analysis === e.analysis
                                ) {
                                  let unit = "";
                                  if (v.unit == item.unit_id) {
                                    unit = item.unit;
                                  }
                                  str = `${e.analysis} - ${e.label} ${unit}`;
                                }
                              });
                            }
                          });
                        }
                      });
                    })
                  );
                  rowdata[ev.name] = str;
                } else if (ev.fieldname == 9) {
                  let str = "";
                  let sub_str = [];
                  await Promise.all(
                    analdata.map(async (v) => {
                      await AnalyModel.findOne({ analysisType: v })
                        .then((e) => {
                          if (e) {
                            str =
                              variable_analdata == e.analysisType ? e.norm : "";
                            sub_str.push(str);
                          }
                        })
                        .catch((err) => console.log(err));
                    })
                  );
                  let res_str = sub_str.filter((item) => item !== "");
                  rowdata[ev.name] = res_str;
                }
              })
            );
          }
          res_data = rowdata;
        })
      );
      tbldata.push(res_data);
    })
  );

  return res.json(tbldata);
};
