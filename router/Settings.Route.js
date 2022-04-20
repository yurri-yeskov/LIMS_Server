const express = require('express')
const passport = require('passport')
const Setting = require('../models/Setting')
const router = express.Router()

router.get('/date_format', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const settings = await Setting.findOne()
        return res.json(settings)
    } catch (err) {
        return res.status(500).json({ message: 'Server error happens' })
    }
})

router.post('/date_format', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const settings = await Setting.findOne()
        settings.date_format = req.body.format
        await settings.save()
        return res.json({ success: true })
    } catch (err) {
        return res.status(500).json({ message: 'Server error happens' })
    }
})

module.exports = router;