const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const inputLabSchema = new Schema({
    datetimestore: [{
        type: Date,
        default: Date.now()
    }],
    client: {
        type: mongoose.Types.ObjectId,
        ref: 'clients'
    },
    sample_type: {
        type: mongoose.Types.ObjectId,
        ref: 'sampleTypes'
    },
    material: {
        type: mongoose.Types.ObjectId,
        ref: 'materials'
    },
    material_category: {
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
    weight_comment: {
        type: String,
        default: ''
    },
    charge: [{
        date: {
            type: Date
        },
        comment: {
            type: String,
            default: ''
        }
    }],
    material_left: {
        type: Number,
        default: 0
    },
    delivery: {
        type: mongoose.Types.ObjectId,
        ref: 'deliveries'
    },
    aT_validate: [{
        aType: {
            type: mongoose.Types.ObjectId,
            ref: 'analysisTypes'
        },
        isValid: {
            type: Number,
            default: 0          // 0: not inputed or missed part, 1: validate good, 2: validate: bad
        }
    }],
    stock_specValues: [{
        histId: {
            type: mongoose.Types.ObjectId,
            ref: 'analysisinputhistories'
        },
        stock: {
            type: mongoose.Types.ObjectId,
            ref: 'inputlabs'
        },
        material: {
            type: mongoose.Types.ObjectId,
            ref: 'materials'
        },
        client: {
            type: mongoose.Types.ObjectId,
            ref: 'clients'
        },
        aType: {
            type: mongoose.Types.ObjectId,
            ref: 'analysisTypes'
        },
        isValid: {
            type: Number,
            default: 0
        },
        obj: {
            type: String,
            default: ''
        },
        value: {
            type: Number,
            default: 0
        }
    }],
    stock_weights: [{
        stock: {
            type: mongoose.Types.ObjectId,
            ref: 'inputlabs'
        },
        weight: {
            type: Number,
            default: 0
        }
    }]
})

module.exports = inputLab = mongoose.model('inputlabs', inputLabSchema)