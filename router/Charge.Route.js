const express = require('express')
const ChargeHistory = require('../models/ChargeHistory')
const router = express.Router()

router.get('/:id', async (req, res) => {
    const data = await ChargeHistory
        .find({ labId: req.params.id })
        .populate('user')

    return res.json(data)
})

module.exports = router