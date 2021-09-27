
var ClientModel = require('../models/clients');
var AnalyModel = require('../models/analysisTypes');
var Labo = require('../models/inputLaboratory');
var ObjModel = require('../models/objectives');
var UnitsModel = require('../models/units');
var HistoryModel = require('../models/objectiveHistory');
var UserModel = require('../models/users');



exports.getaddress = function (req, res) {
    ClientModel
        .findById(req.body.id)
        .then(e => {
            if (e) {
                return res.json(e);
            }
        })
        .catch(err => console.log(err));
}
exports.getanaldata = async function (req, res) {
    let data = [];
    await Promise.all(req.body.productdata.map(async (v, i) => {
        var obj = { name: v.name, value: "" };
        if (v.pagename == 0) {
            await Labo
                .findById(req.body.rowid)
                .then(e => {
                    if (e) {
                        if (v.fieldname == "Due Date") obj.value = e.due_date;
                        else if (v.fieldname == "Sample Type") obj.value = e.sample_type;
                        else if (v.fieldname == "Material") obj.value = e.material;
                        else if (v.fieldname == "Client") obj.value = e.client.split("-")[0];
                        else if (v.fieldname == "Packing Type") obj.value = e.packing_type;
                        else if (v.fieldname == "Analysis Type") {
                            var atypesvalue = "";
                            e.a_types.map(item => {
                                atypesvalue += "," + item;
                            })
                            obj.value = atypesvalue.substr(1, atypesvalue.length);
                        }
                        else if (v.fieldname == "Certificate") {
                            var ctypesvalue = "";
                            e.c_types.map(item => {
                                ctypesvalue += "," + item;
                            })
                            obj.value = ctypesvalue.substr(1, ctypesvalue.length);
                        }
                        else if (v.fieldname == "Sending Date") obj.value = e.sending_date;
                        else if (v.fieldname == "Sample Date") obj.value = e.sample_date;
                        else if (v.fieldname == "Weight(actual)") {
                            var wei = "";
                            e.Weight.map(item => {
                                wei += "," + item.weight;
                            })
                            obj.value = wei.substr(1, wei.length);
                        }
                        else if (v.fieldname == "Charge") {
                            var chargee = "";
                            e.Charge.map(item => {
                                chargee += "," + item;
                            })
                            obj.value = chargee.substr(1, chargee.length);
                        }
                        else if (v.fieldname == "Remark") obj.value = e.remark;
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
                            req.body.c_rowdata.delivering.email_address.map(v => {
                                obj.value += "," + v;
                            })
                            obj.value = obj.value.substr(1, obj.value.length);
                        } else if (v.fieldname == "FetchDate") {
                            obj.value = req.body.c_rowdata.delivering.fetch_date;
                        }
                        else if (v.fieldname == "OrderId") {
                            obj.value = req.body.c_rowdata.delivering.order_id;
                        }
                        else if (v.fieldname == "Pos.ID") {
                            obj.value = req.body.c_rowdata.delivering.pos_id;
                        }
                        else if (v.fieldname == "Weight(target)") {
                            console.log(232323, req.body.c_rowdata);
                            obj.value = req.body.c_rowdata.delivering.w_target;
                        }
                    }
                })
                .catch(err => {
                    console.log(err);
                });
            data.push(obj);
        }
        else if (v.pagename == 1) {
            if (v.fieldname == "Analysis Type") {
                req.body.analdata.map(v => {
                    obj.value += "," + v;
                })
                obj.value = obj.value.substr(1, obj.value.length);
            }
            else if (v.fieldname == "Norm") {
                req.body.analdata.map(v => {
                    AnalyModel.find({ analysisType: v })
                        .then((e) => {
                            if (e) {
                                if (e.norm) {
                                    obj.value += e.norm;
                                }
                            }
                        })
                        .catch(err => console.log(err))
                })
                obj.value = obj.value.substr(1, obj.value.length);
            }
            else if (v.fieldname == "Objectives") {
                await Promise.all(req.body.analdata.map(async v => {
                    await AnalyModel.find({ analysisType: v })
                        .then(async e => {
                            if (e) {
                                await Promise.all(e[0].objectives.map(async v => {
                                    let objvalue = await ObjModel.findById(v.id)
                                        .then(re => {
                                            if (re) {
                                                return re.objective;
                                            }
                                        })
                                        .catch(err => console.log(err));
                                    let unitvalue = await UnitsModel.findById(v.unit)
                                        .then(eu => {
                                            if (eu) {
                                                return eu.unit;
                                            }
                                        }).catch(err => console.log(err))
                                    obj.value += "," + objvalue + "-" + unitvalue;
                                }));
                                obj.value = obj.value.substr(1, obj.value.length);
                            }
                        })
                        .catch(err => console.log(err))
                }));
            }
            else if (v.fieldname == "Remark") {
                await Promise.all(req.body.analdata.map(async v => {
                    await AnalyModel.find({ analysisType: v })
                        .then(re => {
                            if (re) {
                                obj.value += "," + re[0].remark;
                            }
                        }).catch(err => console.log(err));
                })
                )
                obj.value = obj.value.substr(1, obj.value.length);
            }
            data.push(obj);
        }
        else if (v.pagename == 2) {
            if (v.fieldname == "Name") {
                await ClientModel.findById(req.body.clientid)
                    .then(async v => {
                        if (v) {
                            await (obj.value = v.name);
                        }
                    }).catch(err => console.log(err))
            }
            else if (v.fieldname == "Country B") {
                await ClientModel.findById(req.body.clientid)
                    .then(async v => {
                        if (v) {
                            await (obj.value = v.countryB);
                        }
                    }).catch(err => console.log(err))
            }
            else if (v.fieldname == "Zip Code B") {
                await ClientModel.findById(req.body.clientid)
                    .then(async v => {
                        if (v) {
                            await (obj.value = v.zipCodeB);
                        }
                    }).catch(err => console.log(err))
            }
            else if (v.fieldname == "City B") {
                await ClientModel.findById(req.body.clientid)
                    .then(async v => {
                        if (v) {
                            await (obj.value = v.cityB);
                        }
                    }).catch(err => console.log(err))
            }
            else if (v.fieldname == "Address B") {
                await ClientModel.findById(req.body.clientid)
                    .then(async v => {
                        if (v) {
                            await (obj.value = v.addressB);
                        }
                    }).catch(err => console.log(err))
            }
            else if (v.fieldname == "Address2 B") {
                await ClientModel.findById(req.body.clientid)
                    .then(async v => {
                        if (v) {
                            await (obj.value = v.address2B);
                        }
                    }).catch(err => console.log(err))
            }
            data.push(obj);
        }
    }));

    return res.json(data);
}
exports.gethistorydata = async function (req, res) {
    const { data, rowid, analdata } = req.body;
    let tbldata = [];
    let allhis = await HistoryModel.find({ id: rowid })
        .then(v => {
            if (v) {
                return v;
            }
        }).catch(err => console.log(err))
    await Promise.all(allhis.map(async e => {
        var rowdata = {};
        await Promise.all(data.map(async ev => {
            if (ev.fieldname == 0) {
                //Analysis Types
                rowdata[ev.name] = e.analysis;
            }
            else if (ev.fieldname == 1) {
                //value
                rowdata[ev.name] = e.limitValue;
            }
            else if (ev.fieldname == 2) {
                //author
                var author = "";
                await UserModel.findById(e.userid).then(async et => {
                    await (author = et.userName);
                }).catch(err => console.log(err));
                rowdata[ev.name] = author;
            }
            else if (ev.fieldname == 3) {
                //data
                rowdata[ev.name] = e.update_date;
            }
            else if (ev.fieldname == 4) {
                //reason
                rowdata[ev.name] = e.reason ? e.reason : "";
            }
            else if (ev.fieldname == 5) {
                //accept
                rowdata[ev.name] = e.accept;
            }
            else if (ev.fieldname == 6) {
                //comment
                rowdata[ev.name] = e.comment ? e.comment : "";
            }
        }))
        tbldata.push(rowdata);
    }))
    return res.json(tbldata);
}