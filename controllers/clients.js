const Client = require('../models/clients');
const CertificateType = require('../models/certificateTypes')
const InputLab = require('../models/inputLab')
const mongoose = require('mongoose');
const CSV = require('csv-string');

exports.getAllClients = function (req, res) {

  Client.find().then(data => {
    res.json(data);
  })
    .catch(err => {
      res.status(500).json({ message: err.message });
    });
}

exports.createClient = async (req, res) => {
  if (req.body === undefined || req.body.clientId === undefined || !req.body.clientId) {
    res.status(400).json({ message: "Client name can not be empty!" });
    return;
  }
  try {
    const defaultClient = await Client.find({ name: 'Default' })
    if (defaultClient.length === 0) {
      var defaultClientData = new Client({
        name: 'Default',
        clientId: 0,
        other: '',
        countryB: '',
        zipCodeB: '',
        cityB: '',
        addressB: '',
        address2B: '',
        address3B: '',
        address_street: '',
        email: '',
        email2: '',
        email3: '',
        remark1: '',
        remark2: ''
      });
      await defaultClientData.save();
    }

    var client = new Client({
      name: req.body.name,
      clientId: req.body.clientId,
      other: req.body.other,
      countryB: req.body.countryB,
      zipCodeB: req.body.zipCodeB,
      cityB: req.body.cityB,
      addressB: req.body.addressB,
      address2B: req.body.address2B,
      address3B: req.body.address3B,
      address_street: req.body.address_street,
      email: req.body.email,
      email2: req.body.email2,
      email3: req.body.email3,
      remark1: req.body.remark1,
      remark2: req.body.remark2
    });
    await client.save();
    const clients = await Client.find()
    return res.json(clients)
  } catch (err) {
    console.log(err.message);
  }
}

exports.updateClient = function (req, res) {
  if (req.body === undefined || req.body.id === undefined || !req.body.id) {
    res.status(400).json({ message: "Client id can not be empty!" });
    return;
  }

  var id = req.body.id;

  Client.findByIdAndUpdate(id, {
    name: req.body.name,
    clientId: req.body.clientId,
    other: req.body.other,
    countryB: req.body.countryB,
    zipCodeB: req.body.zipCodeB,
    cityB: req.body.cityB,
    addressB: req.body.addressB,
    address2B: req.body.address2B,
    address3B: req.body.address3B,
    address_street: req.body.address_street,
    email: req.body.email,
    email2: req.body.email2,
    email3: req.body.email3,
    remark1: req.body.remark1,
    remark2: req.body.remark2
  },
    { useFindAndModify: false }).then(data => {
      if (!data)
        res.status(404).json({ message: `Cannot update object with id = ${id}. Maybe object was not found!` });
      else {
        Client.find().then(data => {
          res.json(data);
        })
      }
    })
    .catch(err => {
      res.status(500).json({ message: "Could not update object with id = " + id });
    });
}

exports.deleteClient = async function (req, res) {
  try {
    if (req.body === undefined || req.body.id === undefined || !req.body.id) {
      res.status(400).json({ message: "Client id can not be empty!" });
      return;
    }
    var id = req.body.id;
    let result = await Material.aggregate([
      { $unwind: '$clients' },
      { $project: { clients: 1 } },
      { $match: { clients: mongoose.Types.ObjectId(id) } }
    ])
    const _available1 = result.length === 0;
    result = await CertificateType.find({ client: mongoose.Types.ObjectId(id) })
    const _available2 = result.length === 0;
    result = await InputLab.find({ client: mongoose.Types.ObjectId(id) })
    const _available3 = result.length === 0;

    if (!_available1 || !_available2 || !_available3) return res.status(400).json({ message: 'This client has been already used in material or certificate type' });

    const data = await Client.findByIdAndRemove(id, { useFindAndModify: false });
    if (!data)
      res.status(404).json({ message: `Cannot delete object with id = ${id}. Maybe object was not found!` });
    else {
      Client.find().then(data => {
        res.json(data);
      })
    }
  } catch (err) {
    return res.status(500).json({ message: "Could not delete object with id = " + id });
  }
}

exports.uploadClientCSV = async function (req, res) {
  const parsedCSV = CSV.parse(req.body.data);

  try {
    for (var i = 1; i < parsedCSV.length; i++) {
      var aCSV = parsedCSV[i];
      let query = { clientId: aCSV[1] };
      let update = {
        name: aCSV[0],
        other: aCSV[2],
        countryB: aCSV[3],
        zipCodeB: aCSV[4],
        cityB: aCSV[5],
        addressB: aCSV[6],
        address2B: aCSV[7],
        address3B: aCSV[8],
        address_street: aCSV[9],
        email: aCSV[10],
        email2: aCSV[11],
        email3: aCSV[12],
        remark1: aCSV[13],
        remark2: aCSV[14],
      };
      if (parsedCSV[0].indexOf('Id') > -1) {
        update._id = aCSV[15];
      }
      let options = { upsert: true, new: true, setDefaultsOnInsert: true, useFindAndModify: false };

      await Client.findOneAndUpdate(query, update, options)
    }

    const clients = await Client.find();
    res.json({ clients });
  }
  catch (err) {
    res.status(500).json({ message: err.message });
  }
}