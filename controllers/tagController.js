'use strict';
const Tag = require('../models/Tag');
const User = require('../models/User');

exports.addTags = async (req, res, next) => {
    try {
        let newTag = new Tag(
            {
                ownerId: req.user._id,
                ownerStatus: req.user.status,
                info: req.body.addingTag,
                status: 'underReview'
            }
        )
        // await until the newCourse is saved properly
        await newTag.save()
        res.redirect('back')
    } catch (e) {
        next(e)
    }
}