'use strict';
const Course = require('../models/Course');
const Resource = require('../models/Resource');
const User = require('../models/User');
const Message = require('../models/Message');


exports.loadUnderReviewResources = async (req, res, next) => {
    try {
        res.locals.resourceInfo = await Resource.find({
            checkStatus: 'underReview',
            facultyId: req.user._id
        }).sort({'createdAt': -1})
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
        let resourceInfo = await Resource.find({_id: resourceId})
        for (let i = 0; i < resourceInfo.length; i++) {
            resourceInfo[i].checkStatus = 'approve'
            resourceInfo[i].save()
        }
        res.redirect('back')
    } catch (e) {
        next(e)
    }
}

exports.toPublic = async (req, res, next) => {
    try {
        let resourceId = await req.body.checked
        console.log(req.body.checked)
        let resourceInfo = await Resource.find({_id: resourceId})

        for (let i = 0; i < resourceInfo.length; i++) {
            resourceInfo[i].checkStatus = 'approve'
            resourceInfo[i].status = 'partPublic'
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
        let resourceInfo = await Resource.find({_id: resourceId})
        for (let i = 0; i < resourceInfo.length; i++) {
            resourceInfo[i].checkStatus = 'denytemp'
            await resourceInfo[i].save()
        }
        res.locals.resourceInfo = resourceInfo
        res.render('./pages/deny')
    } catch (e) {
        next(e)
    }
}

exports.resume = async (req, res, next) => {
    try {
        const resourceId = req.params.resourceId
        let oldResource = await Resource.findOne({_id: resourceId})
        oldResource.checkStatus = 'underReview'
        await oldResource.save()
        let userId = req.user.id
        res.locals.resourceInfo = await Resource.find({
            facultyId: userId,
            checkStatus: 'denytemp'
        })
        res.render('./pages/deny')
    } catch (e) {
        next(e)
    }
}

exports.comment = async (req, res, next) => {
    try {
        const resourceId = req.params.resourceId
        let oldResource = await Resource.findOne({_id: resourceId})
        oldResource.review = req.body.review
        oldResource.checkStatus = 'deny'
        await oldResource.save()
        let userId = req.user.id
        res.locals.resourceInfo = await Resource.find({
            facultyId: userId,
            checkStatus: 'denytemp'
        })
        res.render('./pages/deny')
    } catch (e) {
        next(e)
    }
}

exports.sendDeny = async (req, res, next) => {
    try {
        let userId = req.user.id
        let resourceInfo = await Resource.find({
            facultyId: userId,
            checkStatus: 'denytemp'
        })
        for (let i = 0; i < resourceInfo.length; i++) {
            resourceInfo[i].checkStatus = 'deny'
            resourceInfo[i].save()
        }
        res.locals.resourceInfo = await Resource.find({
            checkStatus: 'underReview',
            facultyId: req.user._id
        }).sort({'createdAt': -1})
        res.render('./pages/reviewResource')
    } catch (e) {
        next(e)
    }
}

exports.loadDeniedResources = async (req, res, next) => {
    try {
        res.locals.resourceInfo = await Resource.find({
            checkStatus: 'deny',
            ownerId: req.user._id
        }).sort({'createdAt': -1})
        res.render('./pages/showDenied')
    } catch (e) {
        console.log("error: " + e)
        next(e)
    }
}

exports.loadApprovedResources = async (req, res, next) => {
    try {
        res.locals.resourceInfo = await Resource.find({
            checkStatus: 'approve',
            ownerId: req.user._id
        }).sort({'createdAt': -1})
        res.render('./pages/approvedResources')
    } catch (e) {
        console.log("error: " + e)
        next(e)
    }
}

exports.loadPartPublicResources = async (req, res, next) => {
    try {
        res.locals.resourceInfo = await Resource.find({
            status: 'partPublic'
        }).sort({'createdAt': -1})
        res.render('./pages/approvePublicResources')
    } catch (e) {
        console.log("error: " + e)
        next(e)
    }
}

exports.partPublicToPublic = async (req, res, next) => {
    try {
        let resourceId = await req.body.checked
        let resourceInfo = await Resource.find({_id: resourceId})
        for (let i = 0; i < resourceInfo.length; i++) {
            resourceInfo[i].status = 'public'
            resourceInfo[i].save()
        }
        res.redirect('back')
    } catch (e) {
        next(e)
    }
}

exports.partPublicToENACT = async (req, res, next) => {
    try {
        let resourceId = await req.body.checked
        let resourceInfo = await Resource.find({_id: resourceId})

        for (let i = 0; i < resourceInfo.length; i++) {
            resourceInfo[i].status = 'privateToENACT'
            resourceInfo[i].save()
        }
        res.redirect('back')
    } catch (e) {
        next(e)
    }
}

exports.loadMyPublicResources = async (req, res, next) => {
    try {
        res.locals.resourceInfo = await Resource.find({
            status: 'public',
            ownerId: req.user._id
        }).sort({yearOfCreation: -1})
        res.render('./pages/showPublic')
    } catch (e) {
        console.log("error: " + e)
        next(e)
    }
}