'use strict';
const Course = require('../models/Course');
const User = require('../models/User');
const CourseMember = require('../models/CourseMember');

exports.updateProfile = async (req, res, next) => {
    let userToUpdate = await User.findOne({_id: req.user._id})
    console.log("userInfo: " + JSON.stringify(userToUpdate))
    try {
        userToUpdate.userName = req.body.userName;
        userToUpdate.workEmail = req.body.workEmail;
        userToUpdate.personalEmail = req.body.personalEmail;
        userToUpdate.phoneNumber = req.body.phoneNumber;
        userToUpdate.bio = req.body.bio;
        await userToUpdate.save()
        res.render('myProfile')
    } catch (e) {
        next(e)
    }
}