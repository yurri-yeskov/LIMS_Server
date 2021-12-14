const mongoose = require('mongoose')
const Schema = mongoose.Schema

const weightSchema = new Schema({
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
    weight: {
        type: Number,
        default: 0
    },
    comment: {
        type: String,
        default: ''
    }
})

module.exports = WeightHistory = mongoose.model('weightHistories', weightSchema)