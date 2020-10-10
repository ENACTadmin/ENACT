const Verification = require('../models/Verification');
const Faculty = require('../models/Faculty');

let adminList = ["bbdhy96@gmail.com", "nicolezhang@brandeis.edu", "stimell@brandeis.edu", "djw@brandeis.edu", "epevide@brandeis.edu"]

exports.checkUserName = async (req, res, next) => {
    let temp = await Faculty.findOne({email: {$in: [req.user.googleemail, req.user.workEmail]}})
    console.log("faculty test: ", temp)
    if (req.user.googleemail in adminList || req.user.workEmail in adminList || temp) {
        res.redirect("/profile/update")
        return
    }
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