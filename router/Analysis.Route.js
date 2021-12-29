const express = require('express')
const passport = require('passport')
const AnalysisInputHistory = require('../models/AnalysisInputHistory')
const router = express.Router()

router.post('/histories', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const data = await AnalysisInputHistory.find({
        labId: req.body.labId,
        analysisId: req.body.analysisId,
        obj: req.body.obj
    }).populate('user').sort({ date: -1 })

    return res.json(data)
})

router.post('/input_history', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const data = await AnalysisInputHistory.find({
        labId: req.body.labId,
    }).populate('user').sort({ date: -1 })

    return res.json(data)
})

module.exports = router