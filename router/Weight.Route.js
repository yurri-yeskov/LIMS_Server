const express = require('express')
const passport = require('passport')
const WeightHistory = require('../models/WeightHistory')
const router = express.Router()

router.get('/:id', async (req, res) => {
    const data = await WeightHistory
        .find({ labId: req.params.id })
        .populate('user')
    return res.json(data)
})

router.post('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const data = new WeightHistory({
        labId: req.body.id,
        user: req.user._id,
        comment: req.body.comment
    })
    await data.save()
})

module.exports = router