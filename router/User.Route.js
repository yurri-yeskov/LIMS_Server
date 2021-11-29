const express = require('express')
const passport = require('passport')
const router = express.Router()

router.get('/currentUser', passport.authenticate('jwt', { session: false }), async(req, res) => {
    return res.json({
        id: req.user.id,
        name: req.user.userName,
        email: req.user.email,
        userType: req.user.userType,
        labInput: req.user.labInput,
        labAnalysis: req.user.labAnalysis,
        stockUser: req.user.stockUser,
        stockAdmin: req.user.stockAdmin,
        hsImport: req.user.hsImport,
        hsExport: req.user.hsExport,
        hsAdmin: req.user.hsAdmin,
        geologyImport: req.user.geologyImport,
        geologyExport: req.user.geologyExport,
        geologyAdmin: req.user.geologyAdmin,
        remark: req.user.remark,
    });
})

module.exports = router;