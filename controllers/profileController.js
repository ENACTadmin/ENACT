'use strict';
const Course = require('../models/Course');
const User = require('../models/User');
const CourseMember = require('../models/CourseMember');
const Faculty = require('../models/Faculty');


exports.findOneUser = async (req, res, next) => {
    let userId = req.params.id
    try {
        let userInfo = await User.findOne({_id: userId})
        res.render('showProfile', {
            userInfo: userInfo
        })
    } catch (e) {
        next(e)
    }
}


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
        res.redirect('/myProfile')
    } catch (e) {
        next(e)
    }
}


exports.assignFaculty = async (req, res, next) => {
    if (res.locals.status === 'admin') {
        try {
            let email = await req.body.email
            let status = 'faculty'
            let newFaculty = new Faculty(
                {
                    email: email,
                    status: status,
                    approvedBy: res.locals.user._id,
                }
            )
            // await until the newCourse is saved properly
            await newFaculty.save()
            res.redirect('back')
        } catch (e) {
            next(e)
        }
    } else {
        res.send("you are not admin!")
    }
}


exports.loadFaculty = async (req, res, next) => {
    console.log("status: " + res.locals.status)
    if (res.locals.status === 'admin') {
        try {
            let approvedList = await Faculty.find()
            let approvedByList = []
            for (let element of approvedList) {
                let user = await User.findOne(element.approvedBy)
                approvedByList.push(user.userName)
            }
            console.log("list: " + approvedList.toString())
            res.render('assignFaculty', {
                approvedList: approvedList,
                approvedByList: approvedByList
            })
        } catch (e) {
            next(e)
        }
    } else {
        res.send("you are not admin in loading!")
    }
}

exports.showAllProfiles = async (req, res, next) => {
    let profiles = await User.find()
    try {
        res.render('showAllProfiles', {
            profiles: profiles
        })
    } catch (e) {
        next(e)
    }
}

exports.updateProfileImageURL = async (req, res, next) => {
    // let userToUpdate = await User.findOne({_id: req.user._id})
    let userToUpdate = res.locals.user
    try {
        userToUpdate.profilePicURL = req.body.imageURL;
        await userToUpdate.save()
    } catch (e) {
        next(e)
    }
}