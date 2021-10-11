var User = require("../models/users");
var UserType = require("../models/userTypes");
var jwt = require("jsonwebtoken");

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

exports.getAllUsers = async function (req, res) {
  try {
    const users = await User.find();
    const userTypes = await UserType.find();

    res.send({ users, userTypes });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.loginUser = async function (req, res) {
  const { userName, password } = req.body;
  try {
    let user = await User.findOne({ userName: userName });
    let usertype_search = await UserType.findOne({ _id: user.userType });

    if (user.password != password) {
      res.status(400).json("incorrect password");
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
    jwt.sign(payload, "secret", { expiresIn: "1h" }, (err, token) => {
      if (err) throw err;
      res.json({ token });
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
  var user = new User({
    userName: req.body.userName,
    email: req.body.email,
    password: req.body.password,
    userType: req.body.userType,
    remark: req.body.remark,
  });

  try {
    await user.save();
    const users = await User.find();
    const userTypes = await UserType.find();

    res.send({ users, userTypes });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.updateUser = async function (req, res) {
  if (req.body === undefined || req.body.id === undefined || !req.body.id) {
    res.status(400).send({ message: "User id can not be empty!" });
    return;
  }

  var id = req.body.id;

  try {
    const data = await User.findByIdAndUpdate(
      id,
      {
        userName: req.body.userName,
        email: req.body.email,
        password: req.body.password,
        userType: req.body.userType,
        remark: req.body.remark,
      },
      { useFindAndModify: false }
    );
    if (!data)
      res
        .status(404)
        .send({
          message: `Cannot update object with id = ${id}. Maybe object was not found!`,
        });
    else {
      const users = await User.find();
      const userTypes = await UserType.find();

      res.send({ users, userTypes });
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

  var id = req.body.id;

  try {
    const data = await User.findByIdAndRemove(id, { useFindAndModify: false });
    if (!data)
      res
        .status(404)
        .send({
          message: `Cannot update object with id = ${id}. Maybe object was not found!`,
        });
    else {
      const users = await User.find();
      const userTypes = await UserType.find();

      res.send({ users, userTypes });
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
