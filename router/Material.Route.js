const express = require('express')
const Material = require('../models/materials')
const AnalysisTypes = require('../models/analysisTypes')
const Objective = require('../models/objectives');
const Unit = require('../models/units');
const Client = require('../models/clients');
const CertificateType = require('../models/certificateTypes')
const CSV = require('csv-string');
const router = express.Router()

router.get('/', async (req, res) => {
    try {
        const objectives = await Objective.find().populate('units');
        const analysisTypes = await AnalysisTypes.find();
        const units = await Unit.find();
        const clients = await Client.find().select("_id, name");

        const materials = await Material.find().populate(['objectiveValues', 'clients', 'aTypesValues']);
        const obj_units = await Objective.aggregate([
            {
                $lookup: {
                    from: 'units',
                    localField: 'units',
                    foreignField: '_id',
                    as: 'unitsData'
                }
            },
            { $unwind: '$unitsData' },
            {
                $project: {
                    _id: 1,
                    objective: 1,
                    unit: '$unitsData.unit',
                    unit_id: '$unitsData._id',
                }
            },
            { $unwind: '$_id' },
            { $unwind: '$objective' },
            { $unwind: '$unit' },
            { $unwind: '$unit_id' },
            {
                "$addFields": {
                    "obj_id": { "$toString": "$_id" },
                    "u_id": { "$toString": "$unit_id" }
                }
            },
            { $unwind: '$obj_id' },
            { $unwind: '$u_id' },
            {
                $project: {
                    label: { $concat: ['$objective', ' ', '$unit'] },
                    value: { $concat: ['$obj_id', '-', '$u_id'] },
                }
            }
        ])
        res.send({ materials, objectives, analysisTypes, units, clients, obj_units });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
})

router.get('/clients/:id', async (req, res) => {
    const material = await Material.findById(req.params.id).populate('clients')
    const certTypes = await CertificateType.find({ material: req.params.id })
    return res.json({ material: material, certTypes: certTypes })
})

module.exports = router;