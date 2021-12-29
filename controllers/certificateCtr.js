const CertificateModel = require("../models/certificateModel");
const fs = require('fs')
const path = require('path')
const CSV = require('csv-string');
const { Certificate } = require("crypto");

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
  console.log(">>>>>>>>>>>>>>>>>>", req.body.rowid)
  console.log("<<<<<<<<<<<<<<<<<<", req.files)
  return;
  if (req.body.rowid === "") {
    const uploadPath = path.join(__dirname, `../uploads/certificates`);
    if (!fs.existsSync(uploadPath)) {
      fs.mkdir(uploadPath, (err) => {
        if (err) {
          return console.error(err);
        }
      });
    }

    const file = req.files.files;
    console.log(file)
    if (file instanceof Array) {
      file.forEach(f => {
        console.log(f)
        const filename = f.filename;
        f.mv(`${uploadPath}/${filename}`);
      });
    } else {
      console.log(file)
      const filename = file.filename;
      file.mv(`${uploadPath}/${filename}`);
    }

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
    const certData = CertificateModel.findById(req.body.rowid)

    const uploadPath = path.join(__dirname, `../uploads/certificates`);
    if (!fs.existsSync(uploadPath)) {
      fs.mkdir(uploadPath, (err) => {
        if (err) {
          return console.error(err);
        }
      });
    }

    fs.unlinkSync(`${uploadPath}/${certData.logo.filename}`)
    fs.unlinkSync(`${uploadPath}/${certData.footer.filename}`)

    const file = req.files.files;
    console.log(file)
    if (file instanceof Array) {
      file.forEach(f => {
        console.log(f)
        const filename = f.filename;
        f.mv(`${uploadPath}/${filename}`);
      });
    } else {
      console.log(file)
      const filename = file.filename;
      file.mv(`${uploadPath}/${filename}`);
    }

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

exports.DelCertificate = async (req, res) => {
  try {
    const certificateData = await CertificateModel.findById(req.body.id)

    const uploadPath = path.join(__dirname, `../uploads/certificates`);
    if (!fs.existsSync(uploadPath)) {
      fs.mkdir(uploadPath, (err) => {
        if (err) {
          return console.error(err);
        }
      });
    }
    if (fs.existsSync(`${uploadPath}/${certificateData.logo_filename}`)) {
      fs.unlinkSync(`${uploadPath}/${certificateData.logo_filename}`)
    }
    if (fs.existsSync(`${uploadPath}/${certificateData.footer_filename}`)) {
      fs.unlinkSync(`${uploadPath}/${certificateData.footer_filename}`)
    }
    await certificateData.remove()
    return res.json({ success: true })
  } catch (err) {
    return res.status(500).json({ success: false, error: err })
  }
};
exports.Upproductdata = async function (req, res) {
  const certificate = await CertificateModel.findById(req.body.rowid)
  certificate.productdata.productData = req.body.data;
  certificate.productdata.productTitle = req.body.title;
  await certificate.save()
  return res.json({ certificate })
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

exports.uploadFile = async (req, res) => {
  const parsedCSV = CSV.parse(req.body.data);

  try {
    for (let i = 1; i < parsedCSV.length; i++) {
      let pData = parsedCSV[i][7].split("\n").map(data => {
        return {
          name: data.split(" ")[0],
          pagename: parseInt(data.split(" ")[1]),
          fieldname: data.split(" ")[2]
        }
      })
      for (let i = 0; i < 10 - pData.length; i++) {
        pData.push({
          name: '',
          pagename: null,
          fieldname: ''
        })
      }
      let columnData = parsedCSV[i][8].split("\n").map(data => {
        return {
          name: data.split(" ")[0],
          fieldname: data.split(' ')[1]
        }
      })
      for (let i = 0; i < 10 - columnData.length; i++) {
        columnData.push({
          name: '',
          fieldname: null
        })
      }
      let query = { name: parsedCSV[i][0] };
      let update = {
        productdata: {
          productTitle: parsedCSV[i][6],
          productData: pData
        },
        freetext: parsedCSV[i][9],
        tablecol: columnData,
        logo_filename: parsedCSV[i][3],
        footer_filename: parsedCSV[i][10],
        name: parsedCSV[i][0],
        company: parsedCSV[i][2],
        place: parsedCSV[i][4],
        certificatetitle: parsedCSV[i][1],
        date_format: parsedCSV[i][5],
        logoUid: parsedCSV[i][11],
        footerUid: parsedCSV[i][12],
      };
      let options = { upsert: true, new: true, setDefaultsOnInsert: true, useFindAndModify: false };
      await CertificateModel.findOneAndUpdate(query, update, options)
    }
    const certificateTemplates = await CertificateModel.find()
    return res.json(certificateTemplates)
  } catch (err) {
    console.log(err)
    return res.status(500).json({ message: 'Upload Failed' })
  }
}

exports.CopyCertificate = async (req, res) => {
  try {
    const uploadPath = path.join(__dirname, `../uploads/certificates`);
    const oldCertificate = await CertificateModel.findById(req.body.id)
    const new_logo_filename = new Date().getTime() + "_" + oldCertificate.logo_filename.split("_")[1]
    const new_footer_filename = new Date().getTime() + "_" + oldCertificate.footer_filename.split("_")[1]

    if (fs.existsSync(`${uploadPath}/${oldCertificate.logo_filename}`)) {
      await fs.copyFile(`${uploadPath}/${oldCertificate.logo_filename}`, `${uploadPath}/${new_logo_filename}`, () => console.log("copy success"))
    }
    if (fs.existsSync(`${uploadPath}/${oldCertificate.footer_filename}`)) {
      await fs.copyFile(`${uploadPath}/${oldCertificate.footer_filename}`, `${uploadPath}/${new_footer_filename}`, () => console.log("copy success"))
    }

    const newCertificate = new CertificateModel({
      productData: oldCertificate.productData,
      freetext: oldCertificate.freetext,
      tableCol: oldCertificate.tableCol,
      logo_filename: new_logo_filename,
      footer_filename: new_footer_filename,
      name: oldCertificate.name,
      company: oldCertificate.company,
      place: oldCertificate.place,
      certificatetitle: oldCertificate.certificatetitle,
      date_format: oldCertificate.date_format,
      logoUid: oldCertificate.logoUid,
      footerUid: oldCertificate.footerUid
    })
    await newCertificate.save()
    const data = await CertificateModel.find()
    return res.json(data)
  } catch (err) {
    console.log(err)
    return res.status(500).json(err)
  }
}