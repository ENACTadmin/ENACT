const Verification = require('../models/Verification');

exports.checkUserName = async (req, res, next) => {
    if (req.user && !await verification(req.user.workEmail) && !await verification(req.user.googleemail)) {
        console.log('not verified')
        res.redirect('/verification')
        return
    }
    if (req.user && !req.user.userName) {
        console.log("first time user!");
        res.redirect('/profile/view/' + req.user._id)
        return
    }
    next()
}

async function verification(email) {
    if (!email) return false
    let verification = await Verification.findOne({email: email})
    if (verification)
        return true
    return false
}