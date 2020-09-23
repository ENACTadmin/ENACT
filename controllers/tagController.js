'use strict';
const Tag = require('../models/Tag');
const User = require('../models/User');

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
        next()
    } catch (e) {
        console.log("error: " + e)
        next(e)
    }
}