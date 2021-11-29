const Validator = require('validator')
const isEmpty = require('./is-empty')

module.exports = function validateInputLab(data) {
    let errors = {}

    if (Validator.isEmpty(data.sample_type)) {
        errors.sample_type = "Sample type is required"
    }
    if (Validator.isEmpty(data.material)) {
        errors.material = "Material is required"
    }
    if (Validator.isEmpty(data.packing_type)) {
        errors.packing_type = "Packing type is required"
    }
    return {
        errors,
        isValid: isEmpty(errors)
    }
}