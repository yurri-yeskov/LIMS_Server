const mongoose = require('mongoose')
const Schema = mongoose.Schema

const deliverySchema = new Schema({
    name1: {
        type: String,
        default: ''
    },
    name2: {
        type: String,
        default: ''
    },
    name3: {
        type: String,
        default: ''
    },
    title: {
        type: String,
        default: ''
    },
    country: {
        type: String,
        default: ''
    },
    street: {
        type: String,
        default: ''
    },
    zipcode: {
        type: String,
        default: ''
    },
    productCode: {
        type: String,
        default: ''
    },
    email: {
        type: String,
        default: ''
    },
    fetchDate: {
        type: Date,
        default: Date.now()
    },
    orderId: {
        type: String,
        default: ''
    },
    posId: {
        type: String,
        default: ''
    },
    w_target: {
        type: Number,
        default: 0
    }
})

module.exports = Delivery = mongoose.model('deliveries', deliverySchema)