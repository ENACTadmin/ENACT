'use strict';
// const Course = require('../models/Course');
// const User = require('../models/User');
const Resource = require('../models/Resource')

exports.uploadResource = async (req, res, next) => {
    console.log("in upload resource")
    const courseId = req.params.courseId
    try {
        console.log(typeof req.body.tags)
        let tagsString = req.body.tags
        let tags = tagsString.split(",")
        console.log(tags)

        let newResource = new Resource({
            ownerId: req.user._id,
            courseId: courseId,
            status: req.body.status, // public/private to class/private to professors
            createdAt: new Date(),
            name: req.body.resourceName,
            description: req.body.resourceDescription,
            tags: tags, // tags as array
            uri: req.body.uri, // universal resource identifier specific to the resource
            state: req.body.state,
            resourceType: req.body.type, // video/text document ...
            institution: req.body.institution,
            yearOfCreation: req.body.yearOfCreation // content's actual creation time
        })

        // save the new resource
        await newResource.save()
        res.redirect('/showOneCourse/' + courseId)
    } catch (e) {
        next(e)
    }
}

exports.loadResources = async (req, res, next) => {
    const courseId = req.params.courseId
    try {
        let resources = await Resource.find({courseId: courseId})
        res.locals.resourceInfo = resources
        res.render('showOneCourse')
    } catch (e) {
        next(e)
    }
}