const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const inputLabSchema = new Schema({
    datetimestore: [{
        type: Date,
        default: Date.now()
    }],
    sample_type: {
        type: mongoose.Types.ObjectId,
        ref: 'sampleTypes'
    },
    material: {
        type: mongoose.Types.ObjectId,
        ref: 'materials'
    },
    client: {
        type: mongoose.Types.ObjectId,
        ref: 'clients'
    },
    packing_type: [{
        type: mongoose.Types.ObjectId,
        ref: 'packingTypes'
    }],
    due_date: {
        type: Date,
        default: Date.now()
    },
    sample_date: {
        type: Date,
        default: Date.now()
    },
    sending_date: {
        type: Date,
        default: Date.now()
    },
    a_types: [{
        type: mongoose.Types.ObjectId,
        ref: 'analysisTypes'
    }],
    c_types: [{
        type: mongoose.Types.ObjectId,
        ref: 'certificateTypes'
    }],
    distributor: {
        type: String,
        default: ''
    },
    geo_location: {
        type: String,
        default: ''
    },
    remark: {
        type: String,
        default: ''
    },
    weight: {
        type: Number,
        default: 0
    },
    charge: {
        type: Number,
        default: 0
    },
    delivery: {
        type: mongoose.Types.ObjectId,
        ref: 'deliveries'
    }
})

module.exports = inputLab = mongoose.model('inputlabs', inputLabSchema)