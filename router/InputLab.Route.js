const express = require('express')
const mongoose = require('mongoose')
const passport = require('passport')
const Client = require('../models/clients')
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
const Setting = require('../models/Setting')
const validateInputLab = require('../validation/InputLab')
const CSV = require('csv-string');
const moment = require('moment')
const router = express.Router()

router.get('/', async (req, res) => {
    const inputLabs = await InputLab.find()
        .populate(['sample_type', 'client', 'material', 'material_category', 'packing_type', 'a_types', 'c_types', 'delivery'])
    const sampleTypes = await SampleType.find()
    const materials = await Material.find().populate('clients')
    const packingTypes = await PackingType.find()
    const analysisTypes = await AnalysisType.find()
    const certificateTypes = await CertificateType.find()
    const defaultClient = await Client.findOne({ name: 'Default' })
    const settings = await Setting.findOne()
    const clients = await Client.find()

    return res.json({
        inputLabs: inputLabs,
        sampleTypes: sampleTypes,
        materials: materials,
        packingTypes: packingTypes,
        analysisTypes: analysisTypes,
        certificateTypes: certificateTypes,
        defaultClient: defaultClient,
        settings: settings,
        clients: clients
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
                delivery.title = req.body.delivery.address_title
                delivery.country = req.body.delivery.address_country
                delivery.place = req.body.delivery.address_place
                delivery.street = req.body.delivery.address_street
                delivery.zipCode = req.body.delivery.address_zip
                delivery.productCode = req.body.delivery.customer_product_code
                delivery.email = req.body.delivery.email_address.toString()
                delivery.fetchDate = req.body.delivery.fetch_date
                delivery.name1 = req.body.delivery.address_name1
                delivery.name2 = req.body.delivery.address_name2
                delivery.name3 = req.body.delivery.address_name3
                delivery.orderId = req.body.delivery.order_id
                delivery.customer_orderId = req.body.delivery.customer_order_id
                delivery.posId = req.body.delivery.pos_id
                delivery.w_target = req.body.delivery.w_target
                await delivery.save()
            }
            const inputData = await InputLab.findById(req.body.selectedId)
            if (Object.keys(inputData).length > 0) {

                if (String(inputData.sample_type) !== String(req.body.labs.sample_type) ||
                    String(inputData.material) !== String(req.body.labs.material) ||
                    String(inputData.material_category) !== String(req.body.labs.material_category)
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
                inputData.client = req.body.labs.client;
                inputData.material = req.body.labs.material;
                inputData.material_category = req.body.labs.material_category;
                inputData.a_types = req.body.labs.aType.map(aT => { return aT.value });
                inputData.c_types = req.body.labs.cType.map(cT => { return cT.value });
                inputData.packing_type = req.body.labs.packing_type;
                inputData.due_date = req.body.labs.due_date;
                inputData.sample_date = req.body.labs.sample_date;
                inputData.sending_date = req.body.labs.sendign_date;
                inputData.distributor = req.body.labs.distributor;
                inputData.geo_location = req.body.labs.geo_location;
                inputData.remark = req.body.labs.remark;
                inputData.delivery = req.body.selectedDelivery;
                await inputData.save();
            }
        } else {
            const newDelivery = new Delivery({
                title: req.body.delivery.address_title,
                country: req.body.delivery.address_country,
                place: req.body.delivery.address_place,
                street: req.body.delivery.address_street,
                zipCode: req.body.delivery.address_zip,
                productCode: req.body.delivery.customer_product_code,
                name1: req.body.delivery.address_name1,
                name2: req.body.delivery.address_name2,
                name3: req.body.delivery.address_name3,
                email: req.body.delivery.email_address.toString(),
                fetchDate: req.body.delivery.fetch_date,
                orderId: req.body.delivery.order_id,
                customer_orderId: req.body.delivery.customer_order_id,
                posId: req.body.delivery.pos_id,
                w_target: req.body.delivery.w_target
            })
            await newDelivery.save()
            const newLab = new InputLab({
                sample_type: req.body.labs.sample_type,
                client: req.body.labs.client,
                material: req.body.labs.material,
                material_category: req.body.labs.material_category,
                packing_type: req.body.labs.packing_type,
                a_types: req.body.labs.aType.map(aT => { return aT.value }),
                c_types: req.body.labs.cType.map(cT => { return cT.value }),
                due_date: req.body.labs.due_date,
                sample_date: req.body.labs.sample_date,
                sending_date: req.body.labs.sendign_date,
                distributor: req.body.labs.distributor,
                geo_location: req.body.labs.geo_location,
                remark: req.body.labs.remark,
                delivery: newDelivery._id
            })
            await newLab.save()
        }

        const inputLabs = await InputLab.find()
            .populate(['sample_type', 'client', 'material', 'material_category', 'packing_type', 'a_types', 'c_types', 'delivery'])

        return res.json(inputLabs)
    } catch (err) {
        return res.status(500).json({ message: "Server does not working correctly" })
    }
})

router.post('/saveWeight', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const row = await InputLab.findById(req.body.id)
    row.weight = req.body.weight
    row.weight_comment = req.body.comment
    row.material_left = req.body.weight
    await row.save()

    const data = new WeightHistory({
        labId: req.body.id,
        user: req.user._id,
        weight: req.body.weight,
        updateDate: new Date(),
        comment: req.body.comment
    })
    await data.save()

    const retObj = await InputLab.findById(req.body.id)
        .populate(['sample_type', 'material', 'client', 'material_category', 'packing_type', 'a_types', 'c_types', 'delivery'])

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
        .populate(['sample_type', 'material', 'client', 'material_category', 'packing_type', 'a_types', 'c_types', 'delivery'])

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
            if (stockData !== null && stockData !== undefined && Object.keys(stockData).length > 0) {
                stockData.material_left += Number(data.stock_weights[i].weight)
                await stockData.save()
            }
        }
        await Delivery.deleteOne({
            _id: data.delivery
        })
        await data.remove()

        const inputLabs = await InputLab.find()
            .populate(['sample_type', 'material', 'client', 'material_category', 'packing_type', 'a_types', 'c_types', 'delivery'])
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
        const row_stock_weights = selectedLab.stock_weights;

        for (let j = 0; j < row_stock_weights.length; j++) {
            const stock_lab = await InputLab.findById(row_stock_weights[j].stock);
            stock_lab.material_left = stock_lab.material_left + row_stock_weights[j].weight;
            await stock_lab.save();
        }

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
                inputLab.material_left = Number(inputLab.material_left) - Number(data[i].weight)

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
                            client: String(stocks[i].material_category)
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
            .populate(['sample_type', 'material', 'client', 'material_category', 'packing_type', 'a_types', 'c_types', 'delivery'])

        return res.json(inputLabs)
    } catch (err) {
        return res.status(500).json({ message: "Server error" })
    }
})

router.post("/analysisTypes", passport.authenticate("jwt", { session: false }), async (req, res) => {
    // const { labStockId, labRowId, analysisId } = req.body
    const reasons = await Reason.find()
    const objectives = await Objective.find()
    const units = await Unit.find()
    const inputLab = await InputLab.findById(req.body.labStockId)
    const material = await Material.findById(inputLab.material)
    const filteredObjs = material.objectiveValues.filter(data => String(data.client) === String(inputLab.material_category) && String(data.analysis) === String(req.body.analysisId))
    let histories = []
    if (req.body.labStockId === req.body.labRowId) {
        for (let i = 0; i < filteredObjs.length; i++) {
            const latestHistory = await AnalysisInputHistory.find({
                labId: req.body.labStockId,
                analysisId: req.body.analysisId,
                obj: filteredObjs[i].id + "-" + filteredObjs[i].unit
            }).populate(['user']).sort({ date: -1 })
            if (latestHistory.length > 0) {
                histories.push(latestHistory)
            }
        }
    } else {
        const rowData = await InputLab.findById(req.body.labRowId)
        const specValues = rowData.stock_specValues.filter(sv => String(sv.aType) === String(req.body.analysisId))
        for (let i = 0; i < filteredObjs.length; i++) {
            let history;
            if (specValues.filter(sv => String(sv.aType) === String(filteredObjs[i].analysis)).length > 0) {
                const histId = specValues.filter(sv => String(sv.aType) === String(filteredObjs[i].analysis))[0].histId
                history = await AnalysisInputHistory.findById(histId)
            }
            if (Object.keys(history).length > 0) {
                const latestHistory = await AnalysisInputHistory.find({
                    labId: req.body.labStockId,
                    analysisId: req.body.analysisId,
                    obj: filteredObjs[i].id + "-" + filteredObjs[i].unit,
                    date: { $lte: history.date }
                }).populate(['user']).sort({ date: -1 })
                if (latestHistory.length > 0) {
                    histories.push(latestHistory)
                }
            } else {
                const latestHistory = await AnalysisInputHistory.find({
                    labId: req.body.labStockId,
                    analysisId: req.body.analysisId,
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
        const { labId, data, analysisId, validate } = req.body;
        let input_history;
        for (let i = 0; i < data.length; i++) {
            input_history = new AnalysisInputHistory({
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
            await input_history.save()
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
            .populate(['sample_type', 'material', 'client', 'material_category', 'packing_type', 'a_types', 'c_types', 'delivery'])
        return res.json(inputLabs)
    } catch (err) {
        console.log(err)
        return res.status(500).json({ success: false })
    }
})

router.get("/certTemplates", passport.authenticate('jwt', { session: false }), async (req, res) => {
    const certificateTemplates = await CertificateTemplate.find()
    const objectives = await Objective.find()
    const units = await Unit.find()
    return res.json({
        certTemplates: certificateTemplates,
        units: units,
        objectives: objectives
    })
})

router.post('/analysisInputValue', async (req, res) => {
    const { labId, analysisIds } = req.body;
    let retValues = []
    for (let i = 0; i < analysisIds.length; i++) {
        const result = await AnalysisInputHistory.find({
            labId: labId,
            analysisId: mongoose.Types.ObjectId(analysisIds[i])
        }).populate('user').sort({ date: -1 });//.limit(1)
        retValues.push({
            analysisId: analysisIds[i],
            history: result
        })
    }
    return res.json(retValues)
})

router.post('/importCSV', async (req, res) => {
    try {
        const defaultClient = await Client.findOne({ name: 'Default' })
        const settings = await Setting.findOne()
        let parsedCSVs = CSV.parse(req.body.result)
        let delivery, pType, material, client, inputLab, fetchDate, dueDate;
        const sample = await SampleType.findOne({ sampleType: 'Versandprobe' })
        let invalidRows = [];
        // console.log(parsedCSVs)
        // return;
        if (sample) {

            // parsedCSVs = parsedCSVs.filter((data, index) => index !== 0 && index !== 1)
            let parsedCSV = {}
            for (let i = 1; i < parsedCSVs.length; i++) {
                parsedCSV = parsedCSVs[i]
                fetchDate = parsedCSV[3] !== "" ? parsedCSV[3] : parsedCSV[4]
                pType = await PackingType.findOne({
                    packingType_id: String(parsedCSV[5].slice(
                        parsedCSV[5].length - 4,
                        parsedCSV[5].length
                    ))
                })
                // console.log("CSV Material ID: ", String(parsedCSV[5].slice(0, 4)))
                material = await Material.findOne({
                    material_id: String(parsedCSV[5].slice(0, 4))
                })
                // console.log("CSV Client ID: ", String(parsedCSV[7]))
                client = await Client.findOne({ clientId: String(parsedCSV[7]) })
                // console.log("Client from Databse: ", client)
                if (pType !== undefined && pType !== null && material !== undefined && material !== null && client !== undefined && client !== null) {
                    let material_category = '';
                    if (material.clients.indexOf(client._id) > -1) {
                        material_category = client._id;
                    } else {
                        material_category = defaultClient._id;
                    }

                    const cids = await getCertificateTypes(client._id, material._id)
                    const aids = await getAnalysisTypes(material_category, material._id)

                    dueDate = moment(fetchDate, settings.date_format).subtract(1, 'd').format();
                    if (dueDate > new Date()) {
                        const labs = await InputLab.aggregate([
                            {
                                $match: {
                                    sample_type: mongoose.Types.ObjectId(sample._id),
                                    material: mongoose.Types.ObjectId(material._id),
                                    client: mongoose.Types.ObjectId(client._id),
                                }
                            },
                            {
                                $lookup: {
                                    from: 'deliveries',
                                    localField: 'delivery',
                                    foreignField: '_id',
                                    as: 'deliveries'
                                }
                            },
                            {
                                $unwind: '$deliveries'
                            }
                        ])
                        if (labs.filter(lab => moment(new Date(lab.due_date), settings.date_format).format() === moment(new Date(dueDate), settings.date_format).format()).length > 0) {
                            // console.log("1111111111111111111111")
                            labs.filter(lab => moment(new Date(lab.due_date), settings.date_format).format() === moment(new Date(dueDate), settings.date_format).format())
                                .map(async (item) => {
                                    item.datetimestore = []
                                    item.packing_type = [pType._id]
                                    item.sample_date = fetchDate
                                    item.sending_date = fetchDate
                                    item.a_types = aids
                                    item.c_types = cids
                                    item.distributor = ''
                                    item.geo_location = ''
                                    item.remark = ''
                                    item.weight = 0;
                                    item.weight_comment = ''
                                    item.material_left = ''
                                    item.charge = []
                                    item.aT_validate = []
                                    item.stock_specValues = []
                                    item.stock_weights = []
                                    item.material_category = material_category
                                    await item.save()

                                    const update_delivery = Delivery.findById(item.delivery)
                                    update_delivery.name1 = parsedCSV[11]
                                    update_delivery.name2 = parsedCSV[12]
                                    update_delivery.name3 = parsedCSV[13]
                                    update_delivery.title = ""
                                    update_delivery.country = parsedCSV[17]
                                    update_delivery.place = parsedCSV[16]
                                    update_delivery.street = parsedCSV[14]
                                    update_delivery.zipcode = parsedCSV[15]
                                    update_delivery.productCode = parsedCSV[6]
                                    update_delivery.email = parsedCSV[18]
                                    update_delivery.fetchDate = fetchDate
                                    update_delivery.orderId = parsedCSV[0]
                                    update_delivery.customer_orderId = parsedCSV[1]
                                    update_delivery.posId = parsedCSV[8]
                                    update_delivery.w_target = parsedCSV[10]
                                    await update_delivery.save()
                                })

                        } else {
                            delivery = new Delivery({
                                name1: parsedCSV[11],
                                name2: parsedCSV[12],
                                name3: parsedCSV[13],
                                title: "",
                                country: parsedCSV[17],
                                place: parsedCSV[16],
                                street: parsedCSV[14],
                                zipcode: parsedCSV[15],
                                productCode: parsedCSV[6],
                                email: parsedCSV[18],
                                fetchDate: fetchDate,
                                orderId: parsedCSV[0],
                                customer_orderId: parsedCSV[1],
                                posId: parsedCSV[8],
                                w_target: parsedCSV[10]
                            })
                            await delivery.save()
                            // console.log("2222222222222222222222")

                            inputLab = new InputLab({
                                datetimestore: [],
                                packing_type: [pType._id],
                                due_date: moment(fetchDate, settings.date_format).subtract(1, "d").format(),
                                sending_date: fetchDate,
                                a_types: aids,
                                c_types: cids,
                                sample_type: sample._id,
                                material: material._id,
                                client: client._id,
                                material_category: material_category,
                                delivery: delivery._id,
                                charge: [],
                                aT_validate: [],
                                stock_specValues: [],
                                stock_weights: []
                            })
                            await inputLab.save()
                        }
                    } else {
                        const labs = await InputLab.aggregate([
                            {
                                $match: {
                                    sample_type: mongoose.Types.ObjectId(sample._id),
                                    material: mongoose.Types.ObjectId(material._id),
                                    client: mongoose.Types.ObjectId(client._id),
                                }
                            },
                            {
                                $lookup: {
                                    from: 'deliveries',
                                    localField: 'delivery',
                                    foreignField: '_id',
                                    as: 'deliveries'
                                }
                            },
                            {
                                $unwind: '$deliveries'
                            }
                        ])
                        if (labs.filter(lab => moment(new Date(lab.due_date), settings.date_format).format() === moment(new Date(dueDate), settings.date_format).format()).length === 0) {
                            delivery = new Delivery({
                                name1: parsedCSV[11],
                                name2: parsedCSV[12],
                                name3: parsedCSV[13],
                                title: "",
                                country: parsedCSV[17],
                                place: parsedCSV[16],
                                street: parsedCSV[14],
                                zipcode: parsedCSV[15],
                                productCode: parsedCSV[6],
                                email: parsedCSV[18],
                                fetchDate: fetchDate,
                                orderId: parsedCSV[0],
                                customer_orderId: parsedCSV[1],
                                posId: parsedCSV[8],
                                w_target: parsedCSV[10]
                            })
                            await delivery.save()
                            // console.log("333333333333333333333")

                            // console.log("--------------", i)
                            // console.log(">>>>>>>>>>>>", settings.date_format)
                            // console.log("<<<<<<<<<<<<<<", moment(fetchDate).subtract(1, "d").format(settings.date_format))
                            inputLab = new InputLab({
                                datetimestore: [],
                                packing_type: [pType._id],
                                due_date: moment(fetchDate, settings.date_format).subtract(1, "d").format(),
                                sending_date: fetchDate,
                                a_types: aids,
                                c_types: cids,
                                sample_type: sample._id,
                                material: material._id,
                                client: client._id,
                                material_category: material_category,
                                delivery: delivery._id,
                                charge: [],
                                aT_validate: [],
                                stock_specValues: [],
                                stock_weights: []
                            })
                            await inputLab.save()
                        }
                    }
                } else {
                    invalidRows.push(i + 1)
                }
            }
            return res.json({
                success: true,
                invalidRows: invalidRows
            })
        } else {
            return res.status(404).json({ message: "You can't import CSV file because sample type(Versandprobe) does not exist. <br/>Please add sample type and try again" })
        }
    } catch (err) {
        // console.log(err)
        return res.status(400).json({ message: 'The basic data of packing_type or material or client are not inputed or date format does not match' })
    }
})

async function getAnalysisTypes(client_id, material_id) {
    // console.log("Client: ", client_id)
    // console.log("Material: ", material_id)
    // const defaultClient = await Client.findOne({ name: 'Default' })
    const material = await Material.findById(mongoose.Types.ObjectId(material_id))
    const aTypes = await material.aTypesValues.filter(aType => String(aType.client) === String(client_id))
    // console.log(aTypes.map(item => { return mongoose.Types.ObjectId(item.value) }))
    // const aTypes = await material.aTypesValues.filter(aType => String(aType.client) === String(client_id) || String(aType.client) === String(defaultClient._id))
    if (aTypes.length > 0) {
        const aid = aTypes.map(item => { return mongoose.Types.ObjectId(item.value) })
        return aid;
    } else {
        return []
    }
}

async function getCertificateTypes(client_id, material_id) {
    let cTypes = await CertificateType.find({
        material: mongoose.Types.ObjectId(material_id),
        client: mongoose.Types.ObjectId(client_id)
    })
    if (cTypes.length > 0) {
        const cid = await cTypes.map(cT => { return mongoose.Types.ObjectId(cT._id) })
        return cid;
    } else {
        const defaultClient = await Client.findOne({ name: 'Default' })
        cTypes = await CertificateType.find({
            material: mongoose.Types.ObjectId(material_id),
            client: defaultClient._id
        });
        if (cTypes.length > 0) {
            const cid = await cTypes.map(cT => { return mongoose.Types.ObjectId(cT._id) });
            return cid;
        }
        return [];
    }
}

router.post('/upload_laboratory_csv', passport.authenticate('jwt', { session: false }), async (req, res) => {

    if (req.body === undefined) {
        res.status(400).send({ message: "Laboratory data can not be empty!" });
        return;
    }
    const parsedCSV = CSV.parse(req.body.data);

    try {
        let sample_type, material, material_category, client, packing_type, a_types, c_types;
        for (let i = 1; i < parsedCSV.length; i++) {
            let aCSV = parsedCSV[i];
            sample_type = await SampleType.findOne({ sampleType: aCSV[2] });
            material = await Material.findOne({ material: aCSV[4] });
            material_category = await Client.findOne({ name: aCSV[5] });
            client = await Client.findOne({ name: aCSV[6] });
            packing_type = await PackingType.findOne({ packingType: aCSV[7] });
            a_types = await AnalysisType.find({ analysisType: { $in: aCSV[8].split('\n') } });
            c_types = await CertificateType.find({ certificateType: { $in: aCSV[9].split('\n') } });

            let query = { _id: aCSV[0] };
            let update = {
                due_date: aCSV[1],
                sample_type: sample_type ? sample_type._id : null,
                material: material ? material._id : null,
                material_category: material_category ? material_category._id : null,
                client: client ? client._id : null,
                packing_type: packing_type ? [packing_type._id] : [],
                a_types: a_types.length > 0 ? a_types.map(aT => aT._id) : [],
                c_types: c_types.length > 0 ? c_types.map(cT => cT._id) : [],
                sending_date: aCSV[10],
                sample_date: aCSV[11],
                distributor: aCSV[12],
                geo_location: aCSV[13],
                weight: aCSV[15],
                weight_comment: aCSV[16],
                material_left: aCSV[17],
                charge: aCSV[17],
                remark: aCSV[14],
                charge: aCSV[18] !== '' ? aCSV[18].split('\n').map(ch => {
                    return { date: ch.split(',')[0], comment: ch.split(',')[1] }
                }) : [],
                aT_validate: aCSV[20] !== '' ? aCSV[20].split('\n').map(aT => {
                    return { isValid: aT.split(',')[0], aType: aT.split(',')[1] }
                }) : [],
                stock_specValues: aCSV[21] !== '' ? aCSV[21].split('\n').map(spec => {
                    return {
                        hist: spec.split(',')[0],
                        value: spec.split(',')[1],
                        obj: spec.split(',')[2],
                        stock: spec.split(',')[3],
                        client: spec.split(',')[4],
                        aType: spec.split(',')[5],
                        isValid: spec.split(',')[6]
                    }
                }) : [],
                stock_weights: aCSV[22] !== '' ? aCSV[22].split('\n').map(w => {
                    return { weight: w.split(',')[0], stock: w.split(',')[1] }
                }) : [],
                delivery: aCSV[38]
            };
            if (parsedCSV[0].indexOf('Id') > -1) {
                update._id = aCSV[0];
            }
            let options = { upsert: true, new: true, setDefaultsOnInsert: true, useFindAndModify: false };
            await InputLab.findOneAndUpdate(query, update, options);

            let delivery_query = { _id: aCSV[38] };
            let delivery_update = {
                name1: aCSV[23],
                name2: aCSV[26],
                name3: aCSV[27],
                title: aCSV[24],
                country: aCSV[25],
                place: aCSV[28],
                street: aCSV[29],
                zipcode: aCSV[30],
                productCode: aCSV[31],
                email: aCSV[32],
                fetchDate: aCSV[33],
                orderId: aCSV[34],
                customer_orderId: aCSV[35],
                posId: aCSV[36],
                w_target: aCSV[37],
                _id: aCSV[38]
            };
            let delivery_options = { upsert: true, new: true, setDefaultsOnInsert: true, useFindAndModify: false };
            await Delivery.findOneAndUpdate(delivery_query, delivery_update, delivery_options);
        }
        const inputLabs = await InputLab.find()
            .populate(['sample_type', 'client', 'material', 'material_category', 'packing_type', 'a_types', 'c_types', 'delivery']);
        return res.json(inputLabs);
    }
    catch (err) {
        console.log(err)
        res.status(500).send({ message: err.message });
    }
})

module.exports = router;