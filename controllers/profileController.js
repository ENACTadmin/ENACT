'use strict';
const User = require('../models/User');
const Faculty = require('../models/Faculty');


exports.findOneUser = async (req, res, next) => {
    let userId = req.params.id
    try {
        let userInfo = await User.findOne({_id: userId})
        res.render('./pages/showProfile', {
            userInfo: userInfo
        })
    } catch (e) {
        next(e)
    }
}

exports.updateProfile = async (req, res, next) => {
    let userToUpdate = await User.findOne({_id: req.user._id})
    try {
        let toIndex = false
        if (userToUpdate.userName === undefined)
            toIndex = true
        userToUpdate.userName = req.body.userName;
        userToUpdate.password = req.body.password;
        userToUpdate.workEmail = req.body.workEmail;
        userToUpdate.personalEmail = req.body.personalEmail;
        userToUpdate.state = req.body.state;
        userToUpdate.department = req.body.department;
        userToUpdate.pronoun = req.body.pronoun;
        userToUpdate.phoneNumber = req.body.phoneNumber;
        userToUpdate.affiliation = req.body.affiliation;
        userToUpdate.bio = req.body.bio;
        await userToUpdate.save()
        if (toIndex)
            res.redirect('/')
        res.redirect('/profile/view/' + req.user._id)
    } catch (e) {
        next(e)
    }
}


exports.updateProfileAdmin = async (req, res, next) => {
    let userToUpdate = await User.findOne({_id: req.params.userId})
    try {
        userToUpdate.userName = req.body.userName;
        // userToUpdate.password = req.body.password;
        userToUpdate.workEmail = req.body.workEmail;
        userToUpdate.personalEmail = req.body.personalEmail;
        userToUpdate.state = req.body.state;
        userToUpdate.department = req.body.department;
        userToUpdate.pronoun = req.body.pronoun;
        userToUpdate.phoneNumber = req.body.phoneNumber;
        userToUpdate.affiliation = req.body.affiliation;
        userToUpdate.bio = req.body.bio;
        await userToUpdate.save()
        console.log("update success!")
        res.redirect('/profile/view/' + req.params.userId)
    } catch (e) {
        next(e)
    }
}

exports.createFaculty = async (req, res, next) => {
    if (res.locals.status === 'admin') {
        try {
            let email = await req.body.email
            let name = await req.body.userName
            let status = 'faculty'
            let existUserCheck = await User.findOne({
                $or: [
                    {workEmail: email}, {googleemail: email}
                ]
            })
            console.log(existUserCheck)
            if (existUserCheck)
                res.send("This user exists in our system, please contact developer.")
            let newUser = new User({
                workEmail: email,
                userName: name,
                status: status
            })
            await newUser.save()
            let newFaculty = new Faculty(
                {
                    userId: newUser._id,
                    email: email,
                    status: status,
                    approvedBy: res.locals.user._id,
                }
            )
            console.log("new faculty")
            // await until the newCourse is saved properly
            await newFaculty.save()
            res.redirect('/profile/update/' + newUser._id)
        } catch (e) {
            next(e)
        }
    } else {
        res.send("you are not admin!")
    }
}


exports.loadFaculty = async (req, res, next) => {
    if (res.locals.status === 'admin') {
        try {
            let approvedList = await Faculty.find()
            let approvedByList = []
            for (let element of approvedList) {
                let user = await User.findOne({_id: element.approvedBy})
                if (user)
                    approvedByList.push(user.userName)
                else
                    approvedByList.push("unknown")
            }
            res.render('./pages/createFaculty', {
                approvedList: approvedList,
                approvedByList: approvedByList
            })
        } catch (e) {
            next(e)
        }
    } else {
        res.send("you are not admin in loading faculty!")
    }
}

exports.showAllProfiles = async (req, res, next) => {
    let profiles = await User.find()
    try {
        res.render('./pages/showAllProfiles', {
            profiles: profiles
        })
    } catch (e) {
        next(e)
    }
}

exports.updateProfileImageURL = async (req, res, next) => {
    let userToUpdate = res.locals.user
    try {
        userToUpdate.profilePicURL = req.body.imageURL;
        await userToUpdate.save()
        res.redirect('back')
    } catch (e) {
        next(e)
    }
}

exports.updateProfileImageURLAdmin = async (req, res, next) => {
    let userToUpdate = await User.findOne({_id: req.params.userId})
    try {
        userToUpdate.profilePicURL = req.body.imageURL;
        await userToUpdate.save()
        res.redirect('back')
    } catch (e) {
        next(e)
    }
}

let special = ["stimell@brandeis.edu", "djw@brandeis.edu"]
exports.showFacultyProfiles = async (req, res, next) => {
    let profileInfo = await User.find({
        $or: [
            {status: "faculty"},
            {
                workEmail: {
                    $in: special
                }
            },
            {
                googleemail: {
                    $in: special
                }
            },
        ]
    })
    try {
        res.render('./pages/facultyList', {
            profileInfo: profileInfo
        })
    } catch (e) {
        next(e)
    }
}