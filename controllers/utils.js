const Verification = require('../models/Verification');

async function verification(email) {
    if (!email) return false;
    let verification = await Verification.findOne({ email: email });
    return !!verification; // Convert to boolean
}

// Middleware to check if the user has provided their username
async function checkUserName(req, res, next) {
    if (
        req.user &&
        req.user.status === 'student' &&
        !(await verification(req.user.workEmail)) &&
        !(await verification(req.user.googleemail))
    ) {
        console.log('not verified');
        res.redirect('/verification');
        return;
    }
    if (req.user && !req.user.userName) {
        console.log("first time user!");
        res.redirect('/profile/update');
        return;
    }
    next();
}

// Middleware to check if the user has full access
function checkUserAccess(req, res, next) {
    try {
        if (req.user) {
            res.locals.hasFullAccess = req.user.hasFullAccess || false;
        } else {
            res.locals.hasFullAccess = false;
        }
        next();
    } catch (error) {
        console.error('Error in checkUserAccess middleware:', error);
        next(error);
    }
}

module.exports = {
    checkUserName,
    checkUserAccess,
};