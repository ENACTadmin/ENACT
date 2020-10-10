'use strict';
const Tag = require('../models/Tag');

exports.addTags = async (req, res, next) => {
    try {
        let newTag = new Tag(
            {
                ownerId: req.user._id,
                ownerStatus: req.user.status,
                ownerName: req.user.userName,
                info: req.body.addingTag,
                status: 'underReview',
                reason: req.body.reason
            }
        )
        // await until the newCourse is saved properly
        await newTag.save()
        res.redirect('back')
    } catch (e) {
        next(e)
    }
}

exports.loadUnderReviewTags = async (req, res, next) => {
    try {
        res.locals.tagsInfo = await Tag.find({
            status: 'underReview'
        }).sort({'createdAt': -1})
        res.render('./pages/approveTags')
    } catch (e) {
        console.log("error: " + e)
        next(e)
    }
}

exports.agreeTags = async (req, res, next) => {
    try {
        let tagsId = await req.body.checked
        let tagsInfo = await Tag.find({_id: tagsId})
        for (let i = 0; i < tagsInfo.length; i++) {
            tagsInfo[i].status = 'approve'
            tagsInfo[i].save()
        }
        res.redirect('back')
    } catch (e) {
        next(e)
    }
}

exports.denyTags = async (req, res, next) => {
    try {
        let tagsId = await req.body.checked
        let tagsInfo = await Tag.find({_id: tagsId})
        for (let i = 0; i < tagsInfo.length; i++) {
            tagsInfo[i].status = 'deny'
            tagsInfo[i].save()
        }
        res.redirect('back')
    } catch (e) {
        next(e)
    }
}

exports.loadTags = async (req, res, next) => {
    try {
        res.locals.tagsInfo = await Tag.find({
            ownerId: req.user._id
        }).sort({'createdAt': -1})
        res.render('./pages/newAreas')
    } catch (e) {
        console.log("error: " + e)
        next(e)
    }
}