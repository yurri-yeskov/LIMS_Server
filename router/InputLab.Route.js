const express = require('express')
const mongoose = require('mongoose')
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
const Reason = require('../models/reasonModel')
const Objective = require('../models/objectives')
const Unit = require('../models/units')
const CertificateTemplate = require('../models/certificateModel')
const AnalysisInputHistory = require('../models/AnalysisInputHistory')
const validateInputLab = require('../validation/InputLab')
const router = express.Router()

router.get('/', async (req, res) => {
    const inputLabs = await InputLab.find()
        .populate(['sample_type', 'material', 'client', 'packing_type', 'a_types', 'c_types', 'delivery'])
    const sampleTypes = await SampleType.find()
    const materials = await Material.find().populate('clients')
    const packingTypes = await PackingType.find()
    const analysisTypes = await AnalysisType.find()
    const certificateTypes = await CertificateType.find()
    const defaultClient = await Client.findOne({ name: 'Default' })

    return res.json({
        inputLabs: inputLabs,
        sampleTypes: sampleTypes,
        materials: materials,
        packingTypes: packingTypes,
        analysisTypes: analysisTypes,
        certificateTypes: certificateTypes,
        defaultClient: defaultClient
    })
})

router.post('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const { errors, isValid } = validateInputLab(req.body.labs)
        if (!isValid) {
            return res.status(400).json(errors)
        }
        if (req.body.selectedId !== '') {
            const delivery = await Delivery.findById(req.body.selectedDelivery)
            if (Object.keys(delivery).length > 0) {
                delivery.name1 = req.body.delivery.address_name1
                delivery.name2 = req.body.delivery.address_name2
                delivery.name3 = req.body.delivery.address_name3
                delivery.title = req.body.delivery.address_title
                delivery.country = req.body.delivery.address_country
                delivery.street = req.body.delivery.address_street
                delivery.zipCode = req.body.delivery.address_zip
                delivery.productCode = req.body.delivery.customer_product_code
                delivery.email = req.body.delivery.email_address.toString()
                delivery.fetchDate = req.body.delivery.fetch_date
                delivery.orderId = req.body.delivery.order_id
                delivery.posId = req.body.delivery.pos_id
                delivery.w_target = req.body.delivery.w_target
                await delivery.save()
            }
            const inputData = await InputLab.findById(req.body.selectedId)
            if (Object.keys(inputData).length > 0) {

                if (String(inputData.sample_type) != String(req.body.labs.sample_type) ||
                    String(inputData.material) != String(req.body.labs.material) ||
                    String(inputData.client) != String(req.body.labs.client)
                ) {
                    await ChargeHistory.deleteMany({
                        labId: req.body.selectedId
                    })
                    await WeightHistory.deleteMany({
                        labId: req.body.selectedId
                    })
                    await AnalysisInputHistory.deleteMany({
                        labId: req.body.selectedId
                    })

                    inputData.weight = 0
                    inputData.weight_comment = ''
                    inputData.material_left = 0
                    inputData.charge = []
                    inputData.aT_validate = []
                    inputData.stock_specValues = []
                }
                inputData.sample_type = req.body.labs.sample_type;
                inputData.material = req.body.labs.material;
                inputData.client = req.body.labs.client;
                inputData.packing_type = req.body.labs.packing_type;
                inputData.due_date = req.body.labs.due_date;
                inputData.sample_date = req.body.labs.sample_date;
                inputData.sending_date = req.body.labs.sendign_date;
                inputData.a_types = req.body.labs.aType.map(aT => { return aT.value });
                inputData.c_types = req.body.labs.cType.map(cT => { return cT.value });
                inputData.distributor = req.body.labs.distributor;
                inputData.geo_location = req.body.labs.geo_location;
                inputData.remark = req.body.labs.remark;
                inputData.delivery = req.body.selectedDelivery;
                await inputData.save();
            }
        } else {
            const newDelivery = new Delivery({
                name1: req.body.delivery.address_name1,
                name2: req.body.delivery.address_name2,
                name3: req.body.delivery.address_name3,
                title: req.body.delivery.address_title,
                country: req.body.delivery.address_country,
                street: req.body.delivery.address_street,
                zipCode: req.body.delivery.address_zip,
                productCode: req.body.delivery.customer_product_code,
                email: req.body.delivery.email_address.toString(),
                fetchDate: req.body.delivery.fetch_date,
                orderId: req.body.delivery.order_id,
                posId: req.body.delivery.pos_id,
                w_target: req.body.delivery.w_target
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
                delivery: newDelivery._id
            })
            await newLab.save()
        }

        const inputLabs = await InputLab.find()
            .populate(['sample_type', 'material', 'client', 'packing_type', 'a_types', 'c_types', 'delivery'])

        return res.json(inputLabs)
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "Server does not working correctly" })
    }
})

router.post('/saveWeight', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const inputLab = await InputLab.findById(req.body.id)
    inputLab.weight = req.body.weight
    inputLab.weight_comment = req.body.comment
    inputLab.material_left = req.body.weight
    await inputLab.save()

    const data = new WeightHistory({
        labId: req.body.id,
        user: req.user._id,
        weight: req.body.weight,
        updateDate: new Date(),
        comment: req.body.comment
    })
    await data.save()

    const retObj = await InputLab.findById(req.body.id)
        .populate(['sample_type', 'material', 'client', 'packing_type', 'a_types', 'c_types', 'delivery'])

    return res.json(retObj)
})

router.post('/saveCharge', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const inputLab = await InputLab.findById(req.body.id)
    if (req.body.is_stock) {
        inputLab.charge = [{
            date: req.body.charge_date,
            comment: req.body.comment
        }]
    } else {
        inputLab.charge.push({
            date: req.body.charge_date,
            comment: req.body.comment
        })
    }
    await inputLab.save()

    const data = new ChargeHistory({
        labId: req.body.id,
        user: req.user._id,
        chargeDate: req.body.charge_date,
        updateDate: new Date(),
        comment: req.body.comment
    })
    await data.save()

    const retObj = await InputLab.findById(req.body.id)
        .populate(['sample_type', 'material', 'client', 'packing_type', 'a_types', 'c_types', 'delivery'])

    return res.json(retObj)
})

router.delete('/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        await ChargeHistory.deleteMany({
            labId: req.params.id
        })
        await WeightHistory.deleteMany({
            labId: req.params.id
        })
        await AnalysisInputHistory.deleteMany({
            labId: req.params.id
        })
        const data = await InputLab.findById(req.params.id)
        for (let i = 0; i < data.stock_weights.length; i++) {
            const stockData = await InputLab.findById(data.stock_weights[i].stock)
            stockData.material_left += Number(data.stock_weights[i].weight)
            await stockData.save()
        }
        await Delivery.deleteOne({
            _id: data.delivery
        })
        await data.remove()

        const inputLabs = await InputLab.find()
            .populate(['sample_type', 'material', 'client', 'packing_type', 'a_types', 'c_types', 'delivery'])
        return res.json(inputLabs)
    } catch (err) {
        return res.status(500).json({ message: "Server error" })
    }
})

router.post('/saveStockSample', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const { data, selectedId } = req.body;
    try {
        const selectedLab = await InputLab.findById(selectedId)
        const sampleType = await SampleType.findById(selectedLab.sample_type)

        let w_sum = 0;
        let charge_array = []
        let stock_weights = []
        for (let i = 0; i < data.length; i++) {
            const inputLab = await InputLab.findById(data[i].stock)

            w_sum += Number(data[i].weight)
            if (inputLab.charge.length !== 0 && charge_array.filter(d => new Date(d.date).getTime() === new Date(inputLab.charge[0].date).getTime()).length === 0) {
                charge_array.push({ date: inputLab.charge[0].date, comment: inputLab.charge[0].comment })
            }
            if (sampleType.stockSample) {
                // inputLab.weight = w_sum
                // inputLab.material_left = w_sum
                // inputLab.charge = [{
                //     comment: '',
                //     date: new Date()
                // }]

                // const data = new WeightHistory({
                //     labId: selectedId,
                //     user: req.user._id,
                //     weight: w_sum,
                //     updateDate: new Date(),
                //     comment: ''
                // })
                // await data.save()

                // const data1 = new ChargeHistory({
                //     labId: selectedId,
                //     user: req.user._id,
                //     chargeDate: new Date(),
                //     updateDate: new Date(),
                //     comment: ''
                // })
                // await data1.save()
            } else {
                const weight = selectedLab.stock_weights.filter(s => String(s.stock) === String(data[i].stock)).length > 0
                    ? selectedLab.stock_weights.filter(s => String(s.stock) === String(data[i].stock))[0].weight : 0

                inputLab.material_left = Number(inputLab.material_left) + Number(weight) - Number(data[i].weight)

                stock_weights.push({
                    stock: data[i].stock,
                    weight: data[i].weight
                })
            }
            await inputLab.save()
        }


        let specValues = []
        if (!sampleType.stockSample) {
            const stock_ids = data.map(d => d.stock)
            const stocks = await InputLab.find({
                _id: { $in: stock_ids }
            })
            for (let i = 0; i < stocks.length; i++) {
                const materials = await Material.aggregate([
                    {
                        $match: {
                            _id: stocks[i].material,
                        }
                    },
                    {
                        $project: {
                            _id: 1,
                            aTypesValues: 1
                        }
                    },
                    {
                        $unwind: '$aTypesValues'
                    },
                    {
                        $project: {
                            _id: 1,
                            client: '$aTypesValues.client',
                            min: '$aTypesValues.min',
                            max: '$aTypesValues.max',
                            aType: '$aTypesValues.value',
                            obj: '$aTypesValues.obj'
                        }
                    },
                    {
                        $match: {
                            client: String(stocks[i].client)
                        }
                    },

                ])
                let inputHist = []
                for (let j = 0; j < materials.length; j++) {
                    const result = await AnalysisInputHistory.find({
                        obj: materials[j].obj,
                        labId: stocks[i]._id,
                        analysisId: materials[j].aType,
                    }).sort({ date: -1 }).limit(1)
                    if (result.length > 0) {
                        inputHist.push(result[0])
                    }
                }

                materials.map(material => {
                    const min = material.min
                    const max = material.max
                    const value = inputHist.filter(hist => hist.labId.equals(stocks[i]._id) && hist.obj === material.obj && hist.analysisId.equals(material.aType)).length > 0
                        ? inputHist.filter(hist => hist.labId.equals(stocks[i]._id) && hist.obj === material.obj && hist.analysisId.equals(material.aType))[0].value
                        : 0
                    const obj = inputHist.filter(hist => hist.labId.equals(stocks[i]._id) && hist.obj === material.obj && hist.analysisId.equals(material.aType)).length > 0
                        ? inputHist.filter(hist => hist.labId.equals(stocks[i]._id) && hist.obj === material.obj && hist.analysisId.equals(material.aType))[0].obj : ''
                    const histId = inputHist.filter(hist => hist.labId.equals(stocks[i]._id) && hist.obj === material.obj && hist.analysisId.equals(material.aType)).length > 0
                        ? inputHist.filter(hist => hist.labId.equals(stocks[i]._id) && hist.obj === material.obj && hist.analysisId.equals(material.aType))[0]._id : ''
                    if (obj !== '') {
                        specValues.push({
                            histId: histId,
                            value: value,
                            obj: obj,
                            stock: stocks[i]._id,
                            client: material.client,
                            aType: material.aType,
                            isValid: inputHist.filter(hist => hist.labId.equals(stocks[i]._id) && hist.obj === material.obj && hist.analysisId.equals(material.aType)).length > 0
                                ? (value >= min && value <= max ? 1 : 2) : 0
                        })
                    }
                })
            }
            // console.log(">>>>>>>>", specValues)
            selectedLab.weight = w_sum
            selectedLab.material_left = w_sum
            selectedLab.charge = charge_array
            selectedLab.stock_specValues = specValues
            if (selectedLab.stock_weights.length === 0) {
                selectedLab.stock_weights = stock_weights
            } else {
                selectedLab.stock_weights.map(stock => stock_weights.filter(sw => String(sw.stock) === String(stock.stock)).length > 0
                    ? stock.weight = stock_weights.filter(sw => String(sw.stock) === String(stock.stock))[0].weight : stock)
            }
            await selectedLab.save()
        }

        const inputLabs = await InputLab.find()
            .populate(['sample_type', 'material', 'client', 'packing_type', 'a_types', 'c_types', 'delivery'])

        return res.json(inputLabs)
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "Server error" })
    }
})

router.post("/analysisTypes", passport.authenticate("jwt", { session: false }), async (req, res) => {
    const { labStockId, labRowId, analysisId } = req.body
    const reasons = await Reason.find()
    const objectives = await Objective.find()
    const units = await Unit.find()
    const inputLab = await InputLab.findById(labStockId)
    const material = await Material.findById(inputLab.material)
    const filteredObjs = material.objectiveValues.filter(data => String(data.client) === String(inputLab.client) && String(data.analysis) === String(analysisId))
    let histories = []
    if (labStockId === labRowId) {
        for (let i = 0; i < filteredObjs.length; i++) {
            const latestHistory = await AnalysisInputHistory.find({
                labId: labStockId,
                analysisId: analysisId,
                obj: filteredObjs[i].id + "-" + filteredObjs[i].unit
            }).populate(['user']).sort({ date: -1 })
            if (latestHistory.length > 0) {
                histories.push(latestHistory)
            }
        }
    } else {
        const rowData = await InputLab.findById(labRowId)
        const specValues = rowData.stock_specValues.filter(sv => String(sv.aType) === String(analysisId))
        for (let i = 0; i < filteredObjs.length; i++) {
            let history;
            if (specValues.filter(sv => String(sv.aType) === String(filteredObjs[i].analysis)).length > 0) {
                const histId = specValues.filter(sv => String(sv.aType) === String(filteredObjs[i].analysis))[0].histId
                history = await AnalysisInputHistory.findById(histId)
            }
            if (Object.keys(history).length > 0) {
                const latestHistory = await AnalysisInputHistory.find({
                    labId: labStockId,
                    analysisId: analysisId,
                    obj: filteredObjs[i].id + "-" + filteredObjs[i].unit,
                    date: { $lte: history.date }
                }).populate(['user']).sort({ date: -1 })
                if (latestHistory.length > 0) {
                    histories.push(latestHistory)
                }
            } else {
                const latestHistory = await AnalysisInputHistory.find({
                    labId: labStockId,
                    analysisId: analysisId,
                    obj: filteredObjs[i].id + "-" + filteredObjs[i].unit
                }).populate(['user']).sort({ date: -1 })
                if (latestHistory.length > 0) {
                    histories.push(latestHistory)
                }
            }
        }
    }
    return res.json({
        reasons: reasons,
        objectives: objectives,
        units: units,
        histories: histories
    })
})

router.post("/saveAnalysisTypes", passport.authenticate("jwt", { session: false }), async (req, res) => {
    try {
        const { labId, data, analysisId, validate } = req.body
        let history;
        for (let i = 0; i < data.length; i++) {
            history = new AnalysisInputHistory({
                labId: labId,
                analysisId: analysisId,
                obj: data[i].obj,
                value: data[i].input,
                user: req.user._id,
                date: new Date(),
                accept: data[i].accept,
                isValid: data[i].isValid,
                comment: data[i].comment,
                reason: data[i].reason
            })
            await history.save()
        }
        const lab = await InputLab.findById(labId)
        if (lab.aT_validate.filter(data => mongoose.Types.ObjectId(data.aType).equals(mongoose.Types.ObjectId(analysisId))).length > 0) {
            lab.aT_validate.map(data => mongoose.Types.ObjectId(data.aType).equals(mongoose.Types.ObjectId(analysisId)) ? data.isValid = validate : data)
        } else {
            lab.aT_validate.push({
                aType: analysisId,
                isValid: validate
            })
        }
        await lab.save()

        const inputLabs = await InputLab.find()
            .populate(['sample_type', 'material', 'client', 'packing_type', 'a_types', 'c_types', 'delivery'])
        return res.json(inputLabs)
    } catch (err) {
        // console.log(err)
        return res.status(500).json({ success: false })
    }
})

router.get("/certTemplates", passport.authenticate('jwt', { session: false }), async (req, res) => {
    const certTemplates = await CertificateTemplate.find()
    const units = await Unit.find()
    const objectives = await Objective.find()
    return res.json({
        certTemplates: certTemplates,
        units: units,
        objectives: objectives
    })
})

router.post('/analysisInputValue', async (req, res) => {
    const { labId, analysisIds } = req.body
    let retValues = []
    for (let i = 0; i < analysisIds.length; i++) {
        const result = await AnalysisInputHistory.find({
            labId: labId,
            analysisId: mongoose.Types.ObjectId(analysisIds[i])
        }).populate('user').sort({ date: -1 }).limit(1)
        if (result.length > 0) {
            retValues.push(result[0])
        }
    }
    return res.json(retValues)
})

module.exports = router;