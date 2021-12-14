const mongoose = require('mongoose')
const Schema = mongoose.Schema

const chargeSchema = new Schema({
    labId: {
        type: mongoose.Types.ObjectId,
        ref: 'inputlabs'
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'users'
    },
    updateDate: {
        type: Date,
        default: Date.now()
    },
    chargeDate: {
        type: Date,
        default: Date.now()
    },
    comment: {
        type: String,
        default: ''
    }
})

module.exports = ChargeHistory = mongoose.model('chargeHistories', chargeSchema)