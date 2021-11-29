const express = require('express')
const passport = require('passport')
const SampleType = require('../models/sampleTypes')
const Material = require('../models/materials')
const PackingType = require('../models/packingTypes')
const AnalysisType = require('../models/analysisTypes')
const CertificateType = require('../models/certificateTypes')
const InputLab = require('../models/inputLab')
const Delivery = require('../models/Delivery')
const WeightHistory = require('../models/WeightHistory')
const ChargeHistory = require('../models/ChargeHistory')
const validateInputLab = require('../validation/InputLab')
const router = express.Router()

router.get('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const inputLabs = await InputLab.find()
        .populate(['sample_type', 'material', 'client', 'packing_type', 'a_types', 'c_types', 'delivery'])
    const sampleTypes = await SampleType.find()
    const materials = await Material.find().populate('clients')
    const packingTypes = await PackingType.find()
    const analysisTypes = await AnalysisType.find()
    const certificateTypes = await CertificateType.find()
    return res.json({
        inputLabs: inputLabs,
        sampleTypes: sampleTypes,
        materials: materials,
        packingTypes: packingTypes,
        analysisTypes: analysisTypes,
        certificateTypes: certificateTypes
    })
})

router.post('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const { errors, isValid } = validateInputLab(req.body.labs)
        if (!isValid) {
            return res.status(400).json(errors)
        }

        const newDelivery = new Delivery({
            name1: req.body.delivery.address_name1,
            name2: req.body.delivery.address_name2,
            name3: req.body.delivery.address_name3,
            title: req.body.delivery.address_title,
            country: req.body.delivery.address_country,
            street: req.body.delivery.address_street,
            zipCode: req.body.delivery.address_zip,
            productCode: req.body.delivery.customer_product_code,
            email: req.body.delivery.email_address,
            fetchDate: req.body.delivery.fetch_date,
            orderId: req.body.delivery.order_id,
            posId: req.body.delivery.pos_id
        })
        await newDelivery.save()
        const newLab = new InputLab({
            sample_type: req.body.labs.sample_type,
            material: req.body.labs.material,
            client: req.body.labs.client,
            packing_type: req.body.labs.packing_type,
            due_date: req.body.labs.due_date,
            sample_date: req.body.labs.sample_date,
            sending_date: req.body.labs.sendign_date,
            a_types: req.body.labs.aType.map(aT => { return aT.value }),
            c_types: req.body.labs.cType.map(cT => { return cT.value }),
            distributor: req.body.labs.distributor,
            geo_location: req.body.labs.geo_location,
            remark: req.body.labs.remark,
            charge: req.body.labs.charge,
            w_target: req.body.labs.w_target,
            delivery: newDelivery._id
        })
        await newLab.save()

        if (req.body.labs.w_target !== "" && req.body.labs.w_target !== 0) {
            const weightHistory = new WeightHistory({
                labId: newLab._id,
                user: req.user._id,
                updateDate: Date.now(),
                comment: ''
            })
            await weightHistory.save()
        }

        const inputLabs = await InputLab.find()
            .populate(['sample_type', 'material', 'client', 'packing_type', 'a_types', 'c_types', 'delivery'])

        return res.json(inputLabs)
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "Server does not working correctly" })
    }
})

module.exports = router;