const mongoose = require('mongoose')

const schema = mongoose.Schema

const settingSchema = new schema({
    date_format: {
        type: String,
        default: 'MM/DD/YYYY'
    }
})

module.exports = Setting = mongoose.model('settings', settingSchema)