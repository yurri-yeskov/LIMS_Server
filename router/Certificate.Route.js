const express = require('express')
const fs = require('fs')
const path = require('path')
const CertificateModel = require('../models/certificateModel')
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
        const certData = CertificateModel.findById(req.body.rowid)

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
            fs.unlinkSync(`${uploadPath}/${certData.logo_filename}`)
            const logoImg = req.files.logo;
            if (logoImg) {
                logo_filename = new Date().getTime() + "_" + logoImg.name;
                logoImg.mv(`${uploadPath}/${logo_filename}`);
            }
        }
        if (req.files.footer !== null && req.files.footer !== undefined) {
            fs.unlinkSync(`${uploadPath}/${certData.footer_filename}`)
            const footerImg = req.files.footer
            if (footerImg) {
                footer_filename = new Date().getTime() + "_" + footerImg.name;
                footerImg.mv(`${uploadPath}/${footer_filename}`);
            }
        }

        CertificateModel.findById(req.body.rowid)
            .then((e) => {
                if (e) {
                    if (e.logoUid !== req.body.logoUid && e.footerUid !== req.body.footerUid) {
                        e.name = req.body.name;
                        e.company = req.body.company;
                        e.place = req.body.place;
                        e.logo_filename = logo_filename;
                        e.footer_filename = footer_filename;
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
                        e.footer = footer_filename;
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
                        e.logo = logo_filename;
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

})

module.exports = router