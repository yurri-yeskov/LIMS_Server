const express = require('express')
const Client = require('../models/clients')
const router = express.Router()

router.get('/:id', async (req, res) => {
    const client = await Client.findById(req.params.id)
    return res.json(client)
})

module.exports = router