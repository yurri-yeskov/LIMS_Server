const User = require("../models/users");
const UserType = require("../models/userTypes");
const jwt = require("jsonwebtoken");
const CSV = require("csv-string");
const bcrypt = require('bcrypt')

exports.getToken = async function (req, res) {
  const token = req.body.token;
  if (!token) return res.json("error unknow");
  const header = jwt.decode(token);
  if (!header) return res.json("error jwt decode");
  const now = Math.floor(Date.now() / 1000);
  if (header.exp <= now) return res.json("error math");
  let exit_user = User.findOne({ _id: header.id });
  if (exit_user.length == 0) return res.json("error user not found");
  return res.json(token);
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.aggregate([
      {
        $lookup: {
          from: 'usertypes',
          localField: 'userType',
          foreignField: '_id',
          as: 'userType'
        }
      },
      {
        $unwind: '$userType'
      },
      {
        $project: {
          user_id: 1,
          userName: 1,
          email: 1,
          password: 1,
          user_type: '$userType.userType',
          remark: 1,
        }
      }
    ])
    const userTypes = await UserType.find();
    return res.json({
      users: users,
      userTypes: userTypes
    })
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.loginUser = async function (req, res) {
  const { userName, password } = req.body;
  try {
    let errors = {}
    let user = await User.findOne({ userName: userName });
    if (!user) {
      errors.userName = "User not found"
      return res.status(404).json(errors)
    }
    let usertype_search = await UserType.findOne({ _id: user.userType });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      errors.password = "Incorrect username or password"
      return res.status(400).json(errors);
    }

    const payload = {
      id: user.id,
      userType: usertype_search.userType,
      labInput: usertype_search.labInput,
      labAnalysis: usertype_search.labAnalysis,
      stockUser: usertype_search.stockUser,
      stockAdmin: usertype_search.stockAdmin,
      hsImport: usertype_search.hsImport,
      hsExport: usertype_search.hsExport,
      hsAdmin: usertype_search.hsAdmin,
      geologyImport: usertype_search.geologyImport,
      geologyExport: usertype_search.geologyExport,
      geologyAdmin: usertype_search.geologyAdmin,
      remark: usertype_search.remark,
    };
    jwt.sign(payload, "secret", { expiresIn: 86400 }, (err, token) => {
      if (err) throw err;
      return res.json({
        success: true,
        token: 'Bearer ' + token
      });
    });
  } catch (err) {
    res.status(500).send("Server error");
  }
};

exports.createUser = async function (req, res) {
  if (
    req.body === undefined ||
    req.body.userName === undefined ||
    !req.body.userName
  ) {
    res.status(400).send({ message: "User name can not be empty!" });
    return;
  }
  let user = new User({
    user_id: req.body.user_id,
    auto_id: req.body.user_id,
    userName: req.body.userName,
    email: req.body.email,
    password: req.body.password,
    userType: req.body.userType,
    remark: req.body.remark,
  });

  try {
    await user.save();
    const users = await User.aggregate([
      {
        $lookup: {
          from: 'usertypes',
          localField: 'userType',
          foreignField: '_id',
          as: 'userType'
        }
      },
      {
        $unwind: '$userType'
      },
      {
        $project: {
          user_id: 1,
          userName: 1,
          email: 1,
          password: 1,
          user_type: '$userType.userType',
          remark: 1,
        }
      }
    ])
    const userTypes = await UserType.find();

    res.json({
      users: users,
      userTypes: userTypes
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.updateUser = async function (req, res) {
  if (req.body === undefined || req.body.id === undefined || !req.body.id) {
    res.status(400).send({ message: "User id can not be empty!" });
    return;
  }

  let id = req.body.id;

  try {
    const typeData = await UserType.findOne({ userType: req.body.userType })
    const userType = typeData._id
    const data = await User.findByIdAndUpdate(
      id,
      {
        userName: req.body.userName,
        email: req.body.email,
        password: req.body.password,
        userType: userType,
        remark: req.body.remark,
      },
      { useFindAndModify: false }
    );
    if (!data)
      res.status(404).send({
        message: `Cannot update object with id = ${id}. Maybe object was not found!`,
      });
    else {
      const users = await User.aggregate([
        {
          $lookup: {
            from: 'usertypes',
            localField: 'userType',
            foreignField: '_id',
            as: 'userType'
          }
        },
        {
          $unwind: '$userType'
        },
        {
          $project: {
            user_id: 1,
            userName: 1,
            email: 1,
            password: 1,
            user_type: '$userType.userType',
            remark: 1,
          }
        }
      ])
      const userTypes = await UserType.find();
      return res.json({
        users: users,
        userTypes: userTypes
      })
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.deleteUser = async function (req, res) {
  if (req.body === undefined || req.body.id === undefined || !req.body.id) {
    res.status(400).send({ message: "User id can not be empty!" });
    return;
  }

  let id = req.body.id;

  try {
    const data = await User.findByIdAndRemove(id, { useFindAndModify: false });
    if (!data)
      res.status(404).send({
        message: `Cannot update object with id = ${id}. Maybe object was not found!`,
      });
    else {
      const users = await User.aggregate([
        {
          $lookup: {
            from: 'usertypes',
            localField: 'userType',
            foreignField: '_id',
            as: 'userType'
          }
        },
        {
          $unwind: '$userType'
        },
        {
          $project: {
            user_id: 1,
            userName: 1,
            email: 1,
            password: 1,
            user_type: '$userType.userType',
            remark: 1,
          }
        }
      ])
      const userTypes = await UserType.find();
      return res.json({
        users: users,
        userTypes: userTypes
      })
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.uploadUserCSV = async function (req, res) {
  if (req.body === undefined) {
    res.status(400).send({ message: "User CSV can not be empty!" });
    return;
  }
  const parsedCSV = CSV.parse(req.body.data);
  try {
    for (let i = 1; i < parsedCSV.length; i++) {
      let aCSV = parsedCSV[i];
      const userTypes = await UserType.findOne({ userType: aCSV[4] });
      // console.log(userTypes);
      if (userTypes._id != undefined) {
        let query = { user_id: aCSV[0] };
        let update = {
          userName: aCSV[1],
          email: aCSV[2],
          password: aCSV[3],
          userType: userTypes._id,
          remark: aCSV[5],
        };
        let options = {
          upsert: true,
          new: true,
          setDefaultsOnInsert: true,
          useFindAndModify: false,
        };
        await User.findOneAndUpdate(query, update, options);
      }
    }
    const users = await User.find();
    res.send({ users });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
