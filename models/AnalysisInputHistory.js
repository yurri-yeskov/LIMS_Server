const mongoose = require('mongoose')
const Schema = mongoose.Schema

const AnalySchema = new Schema({
    labId: {
        type: mongoose.Types.ObjectId,
        ref: 'inputlabs'
    },
    analysisId: {
        type: mongoose.Types.ObjectId,
        ref: 'analysisTypes'
    },
    obj: {
        type: String,
        default: ''
    },
    value: {
        type: Number,
        default: 0
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'users'
    },
    date: {
        type: Date,
        default: Date.now()
    },
    accept: {
        type: Number,
        default: 0
    },
    isValid: {
        type: Number,
        default: 0
    },
    comment: {
        type: String,
        default: ''
    },
    reason: {
        type: String,
        default: ''
    }
})

module.exports = AnalysisInputHistory = mongoose.model("analysisinputhistories", AnalySchema)