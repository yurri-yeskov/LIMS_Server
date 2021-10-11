const CertificateModel = require("../models/certificateModel");

exports.getCertificate = function (req, res) {
  CertificateModel.find()
    .then((e) => res.json(e))
    .catch((err) => console.log(err));
};
exports.getCertificate_dateformat = function (req, res) {
  CertificateModel.findOne({ name: req.body.name })
    .then((e) => res.json(e))
    .catch((err) => console.log(err));
};
exports.AddCertificate = function (req, res) {
  if (req.body.rowid === "") {
    new CertificateModel({
      name: req.body.name,
      company: req.body.company,
      place: req.body.place,
      logo: req.files[0],
      footer: req.files[1],
      logoUid: req.body.logoUid,
      footerUid: req.body.footerUid,
      certificatetitle: req.body.certificatetitle,
      date_format: req.body.date_format,
    })
      .save()
      .then((e) => res.json(e))
      .catch((err) => console.log(err));
  } else {
    CertificateModel.findById(req.body.rowid)
      .then((e) => {
        if (e) {
          if (
            e.logoUid !== req.body.logoUid &&
            e.footerUid !== req.body.footerUid
          ) {
            e.name = req.body.name;
            e.company = req.body.company;
            e.place = req.body.place;
            e.logo = req.files[0];
            e.footer = req.files[1];
            e.logoUid = req.body.logoUid;
            e.footerUid = req.body.footerUid;
            e.certificatetitle = req.body.certificatetitle;
            e.date_format = req.body.date_format;
          } else if (
            e.logoUid === req.body.logoUid &&
            e.footerUid !== req.body.footerUid
          ) {
            e.name = req.body.name;
            e.company = req.body.company;
            e.place = req.body.place;
            e.footer = req.files[0];
            e.footerUid = req.body.footerUid;
            e.certificatetitle = req.body.certificatetitle;
            e.date_format = req.body.date_format;
          } else if (
            e.logoUid !== req.body.logoUid &&
            e.footerUid === req.body.footerUid
          ) {
            e.name = req.body.name;
            e.company = req.body.company;
            e.place = req.body.place;
            e.logo = req.files[0];
            e.logoUid = req.body.logoUid;
            e.certificatetitle = req.body.certificatetitle;
            e.date_format = req.body.date_format;
          } else if (
            e.logoUid === req.body.logoUid &&
            e.footerUid === req.body.footerUid
          ) {
            e.name = req.body.name;
            e.company = req.body.company;
            e.place = req.body.place;
            e.certificatetitle = req.body.certificatetitle;
            e.date_format = req.body.date_format;
          }
          e.save()
            .then((ee) => res.json(ee))
            .catch((errr) => console.log(errr));
        }
      })
      .catch((err) => console.log(err));
  }
};

exports.DelCertificate = function (req, res) {
  CertificateModel.findByIdAndRemove(req.body.id)
    .then((e) => res.json(e))
    .catch((err) => console.log(err));
};
exports.Upproductdata = function (req, res) {
  CertificateModel.findById(req.body.rowid)
    .then((e) => {
      e.productdata.productData = req.body.data;
      e.productdata.productTitle = req.body.title;
      e.save()
        .then((r) => res.json(r))
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
};
exports.UpFreetext = function (req, res) {
  CertificateModel.findById(req.body.rowid)
    .then((e) => {
      e.freetext = req.body.text;
      e.save()
        .then((r) => res.json(r))
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
};
exports.Uptabledata = function (req, res) {
  CertificateModel.findById(req.body.rowid)
    .then((e) => {
      if (e) {
        e.tablecol = req.body.data;
        e.save()
          .then((r) => res.json(r))
          .catch((err) => console.log(err));
      }
    })
    .catch((err) => console.log(err));
};
