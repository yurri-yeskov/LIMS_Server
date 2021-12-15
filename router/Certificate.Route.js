const express = require('express')
const fs = require('fs')
const path = require('path')
const CertificateModel = require('../models/certificateModel')
const mongoose = require('mongoose')
const router = express.Router()

router.post('/', async (req, res) => {

    if (req.body.rowid === "") {
        const uploadPath = path.join(__dirname, `../uploads/certificates`);
        if (!fs.existsSync(uploadPath)) {
            fs.mkdir(uploadPath, (err) => {
                if (err) {
                    return console.error(err);
                }
            });
        }
        let logo_filename = '';
        const logoImg = req.files.logo;
        if (logoImg) {
            logo_filename = new Date().getTime() + "_" + logoImg.name;
            logoImg.mv(`${uploadPath}/${logo_filename}`);
        }
        let footer_filename = ''
        const footerImg = req.files.footer
        if (footerImg) {
            footer_filename = new Date().getTime() + "_" + footerImg.name;
            footerImg.mv(`${uploadPath}/${footer_filename}`);
        }

        new CertificateModel({
            name: req.body.name,
            company: req.body.company,
            place: req.body.place,
            certificatetitle: req.body.certificatetitle,
            date_format: req.body.date_format,
            logo_filename: logo_filename,
            footer_filename: footer_filename,
            logoUid: req.body.logoUid,
            footerUid: req.body.footerUid
        }).save()
            .then((e) => res.json(e))
            .catch((err) => console.log(err));
    } else {
        const certData = await CertificateModel.findById(mongoose.Types.ObjectId(req.body.rowid))

        const uploadPath = path.join(__dirname, `../uploads/certificates`);
        if (!fs.existsSync(uploadPath)) {
            fs.mkdir(uploadPath, (err) => {
                if (err) {
                    return console.error(err);
                }
            });
        }
        let logo_filename = '';
        let footer_filename = ''
        if (req.files.logo !== null && req.files.logo !== undefined) {
            if (fs.existsSync(`${uploadPath}/${certData.logo_filename}`)) {
                fs.unlinkSync(`${uploadPath}/${certData.logo_filename}`)
            }
            const logoImg = req.files.logo;
            if (logoImg) {
                logo_filename = new Date().getTime() + "_" + logoImg.name;
                logoImg.mv(`${uploadPath}/${logo_filename}`);
            }
        }
        if (req.files.footer !== null && req.files.footer !== undefined) {
            if (fs.existsSync(`${uploadPath}/${certData.footer_filename}`)) {
                fs.unlinkSync(`${uploadPath}/${certData.footer_filename}`)
            }
            const footerImg = req.files.footer
            if (footerImg) {
                footer_filename = new Date().getTime() + "_" + footerImg.name;
                footerImg.mv(`${uploadPath}/${footer_filename}`);
            }
        }

        if (certData) {
            if (certData.logoUid !== req.body.logoUid && certData.footerUid !== req.body.footerUid) {
                certData.name = req.body.name;
                certData.company = req.body.company;
                certData.place = req.body.place;
                certData.logo_filename = logo_filename;
                certData.footer_filename = footer_filename;
                certData.logoUid = req.body.logoUid;
                certData.footerUid = req.body.footerUid;
                certData.certificatetitle = req.body.certificatetitle;
                certData.date_format = req.body.date_format;
            } else if (certData.logoUid === req.body.logoUid && certData.footerUid !== req.body.footerUid) {
                certData.name = req.body.name;
                certData.company = req.body.company;
                certData.place = req.body.place;
                certData.footer_filename = footer_filename;
                certData.footerUid = req.body.footerUid;
                certData.certificatetitle = req.body.certificatetitle;
                certData.date_format = req.body.date_format;
            } else if (certData.logoUid !== req.body.logoUid && certData.footerUid === req.body.footerUid) {
                certData.name = req.body.name;
                certData.company = req.body.company;
                certData.place = req.body.place;
                certData.logo_filename = logo_filename;
                certData.logoUid = req.body.logoUid;
                certData.certificatetitle = req.body.certificatetitle;
                certData.date_format = req.body.date_format;
            } else if (certData.logoUid === req.body.logoUid && certData.footerUid === req.body.footerUid) {
                certData.name = req.body.name;
                certData.company = req.body.company;
                certData.place = req.body.place;
                certData.certificatetitle = req.body.certificatetitle;
                certData.date_format = req.body.date_format;
            }
            try {
                await certData.save()
                return res.json(certData)
            } catch (err) {
                return res.status(500).json(err)
            }
        }
    }

})

module.exports = router