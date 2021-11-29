const User = require('../models/users');
const UserType = require('../models/userTypes');
const CSV = require('csv-string');

exports.getAllUserTypes = async (req, res) => {
  const types = await UserType.find();
  return res.json(types);
}

exports.createUserType = function(req, res) {
    if (req.body === undefined || req.body.userType === undefined || !req.body.userType) {
        res.status(400).send({ message: "UserType name can not be empty!" });
        return;
    }

    let userType = new UserType({
        userType_id: req.body.userType_id,
        userType: req.body.userType,
        labInput: req.body.labInput,
        labAnalysis: req.body.labAnalysis,
        labAdmin: req.body.labAdmin,
        stockUser: req.body.stockUser,
        stockAdmin: req.body.stockAdmin,
        hsImport: req.body.hsImport,
        hsExport: req.body.hsExport,
        hsAdmin: req.body.hsAdmin,
        geologyImport: req.body.geologyImport,
        geologyExport: req.body.geologyExport,
        geologyAdmin: req.body.geologyAdmin,
        remark: req.body.remark
    });
    
    userType.save().then(data => {
      UserType.find().then(data => {
        res.send(data);
      })
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
}

exports.updateUserType = function(req, res) {
    if (req.body === undefined || req.body.id === undefined || !req.body.id) {
      res.status(400).send({ message: "UserType id can not be empty!" });
      return;
    }

    let id = req.body.id;

    UserType.findByIdAndUpdate(id, {
      userType_id: req.body.userType_id,
      userType: req.body.userType,
      labInput: req.body.labInput,
      labAnalysis: req.body.labAnalysis,
      labAdmin: req.body.labAdmin,
      stockUser: req.body.stockUser,
      stockAdmin: req.body.stockAdmin,
      hsImport: req.body.hsImport,
      hsExport: req.body.hsExport,
      hsAdmin: req.body.hsAdmin,
      geologyImport: req.body.geologyImport,
      geologyExport: req.body.geologyExport,
      geologyAdmin: req.body.geologyAdmin,
      remark: req.body.remark},
      { useFindAndModify: false }).then(data => {
        if (!data)
          res.status(404).send({ message: `Cannot update object with id = ${id}. Maybe object was not found!` });
        else {
          UserType.find().then(data => {
            res.send(data);
          })
        }
      })
      .catch(err => {
        res.status(500).send({ message: "Could not update object with id = " + id });
      });
}

exports.deleteUserType = async function(req, res) {
    if (req.body === undefined || req.body.id === undefined || !req.body.id) {
        res.status(400).send({ message: "UserType id can not be empty!" });
        return;
    }
    let id = req.body.id;
    try {
      const data = await UserType.findByIdAndRemove(id, { useFindAndModify: false });
      if (!data)
        res.status(404).send({ message: `Cannot delete object with id = ${id}. Maybe object was not found!` });
      else {
        const users = await User.find({userType: id});
        for (let i = 0; i < users.length; i ++) {
          await User.findByIdAndRemove(users[i]._id, { useFindAndModify: false });
        }

        const data = await UserType.find();
        res.send(data);
      }
    } catch (err) {
      res.status(500).send({ message: "Could not delete object with id = " + id });
    }
}

exports.uploadUserTypeCSV = async function(req, res){
  const parsedCSV = CSV.parse(req.body.data);
  try{
    for (let i = 1; i < parsedCSV.length; i ++) {
      let aCSV = parsedCSV[i];
      let query = { userType_id: aCSV[0] };
      if(aCSV[2] === ''){
        aCSV[2] = false;
      }else if(aCSV[2] === 'TRUE'){
        aCSV[2] = true;
      }
      if(aCSV[3] === ''){
        aCSV[3] = false;
      }else if(aCSV[3] === 'TRUE'){
        aCSV[3] = true;
      }
      if(aCSV[4] === ''){
        aCSV[4] = false;
      }else if(aCSV[4] === 'TRUE'){
        aCSV[4] = true;
      }
      if(aCSV[5] === ''){
        aCSV[5] = false;
      }else if(aCSV[5] === 'TRUE'){
        aCSV[5] = true;
      }
      if(aCSV[6] === ''){
        aCSV[6] = false;
      }else if(aCSV[6] === 'TRUE'){
        aCSV[6] = true;
      }
      if(aCSV[7] === ''){
        aCSV[7] = false;
      }else if(aCSV[7] === 'TRUE'){
        aCSV[7] = true;
      }
      if(aCSV[8] === ''){
        aCSV[8] = false;
      }else if(aCSV[8] === 'TRUE'){
        aCSV[8] = true;
      }
      if(aCSV[9] === ''){
        aCSV[9] = false;
      }else if(aCSV[9] === 'TRUE'){
        aCSV[9] = true;
      }
      if(aCSV[10] === ''){
        aCSV[10] = false;
      }else if(aCSV[10] === 'TRUE'){
        aCSV[10] = true;
      }
      if(aCSV[11] === ''){
        aCSV[11] = false;
      }else if(aCSV[11] === 'TRUE'){
        aCSV[11] = true;
      }
      if(aCSV[12] === ''){
        aCSV[12] = false;
      }else if(aCSV[12] === 'TRUE'){
        aCSV[12] = true;
      }
      let update = {
        userType:aCSV[1],
        labInput:aCSV[2],
        labAnalysis:aCSV[3],
        labAdmin:aCSV[4],
        stockUser:aCSV[5],
        stockAdmin:aCSV[6],
        hsImport:aCSV[7],
        hsExport:aCSV[8],
        hsAdmin:aCSV[9],
        geologyImport:aCSV[10],
        geologyExport:aCSV[11],
        geologyAdmin:aCSV[12],
        remark:aCSV[13]
      };
      let options = {upsert: true, new: true, setDefaultsOnInsert: true, useFindAndModify: false};
      await UserType.findOneAndUpdate(query, update, options)
    }
    UserType.find().then(data => {
      res.send(data);
    });
  }
  catch (err){
    res.status(500).send({ message: err.message });
  }
}