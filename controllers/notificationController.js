'use strict';
const Course = require('../models/Course');
const Resource = require('../models/Resource');
const User = require('../models/User');


exports.loadUnderReviewResources = async (req, res, next) => {
    try {
        let resourceInfo = await Resource.find({
            checkStatus: 'UnderReview',
            facultyId: req.user._id
        }).sort({'createdAt': -1})
        res.locals.resourceInfo = resourceInfo
        res.render('./pages/reviewResource')
    } catch (e) {
        console.log("error: " + e)
        next(e)
    }
}


exports.approve = async (req, res, next) => {
    try {
        let resourceId = await req.body.checked
        console.log(req.body.checked)
        let resourceInfo = await Resource.find({_id:resourceId})
            for (let i = 0; i < resourceInfo.length; i++) {
                resourceInfo[i].checkStatus = 'approve'
                resourceInfo[i].save()
            }
        // }else if($_POST['action'].equals('Submit Checked Resources to Admins to be posted to public')){
        //     for (let i = 0; i < resourceInfo.length; i++) {
        //         resourceInfo[i].checkStatus = 'public'
        //         resourceInfo[i].save()
        //     }
        // }else{
        //     for (let i = 0; i < resourceInfo.length; i++) {
        //         resourceInfo[i].checkStatus = 'deny'
        //         resourceInfo[i].save()
        //     }
        // }
        res.redirect('back')
    } catch (e) {
        next(e)
    }
}

exports.toPublic = async (req, res, next) => {
    try {
        let resourceId = await req.body.checked
        console.log(req.body.checked)
        let resourceInfo = await Resource.find({_id:resourceId})

        for (let i = 0; i < resourceInfo.length; i++) {
            resourceInfo[i].checkStatus = 'approve'
            resourceInfo[i].publicStatus ='yes'
            resourceInfo[i].save()
        }

        res.redirect('back')
    } catch (e) {
        next(e)
    }
}

exports.deny = async (req, res, next) => {
    try {
        let resourceId = await req.body.checked
        console.log(req.body.checked)
        let resourceInfo = await Resource.find({_id:resourceId})

        for (let i = 0; i < resourceInfo.length; i++) {
            resourceInfo[i].checkStatus = 'deny'
            resourceInfo[i].save()
        }
        res.locals.resourceInfo = resourceInfo
        res.render('./pages/deny')
    } catch (e) {
        next(e)
    }
}