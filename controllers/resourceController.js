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
        res.render('showOneCourse', {
            resourceInfo: resources
        })
    } catch (e) {
        next(e)
    }
}

exports.searchByFilled = async (req, res, next) => {
    let resourceInfo = null
    try {
        // 1) all fields empty
        if (req.body.state == "empty" && req.body.institution == "" && req.body.yearOfCreation == "") {
            console.log("all empty")
            resourceInfo =
                await Resource.find({status: req.body.status})

            // add public resources..
            let someMoreResource = await Resource.find({status: "public"})
            for (let i = 0; i < someMoreResource.length; i++) {
                await resourceInfo.push(someMoreResource[i])
            }
        }

        // 2) one field empty
        else if (req.body.state == "empty" && req.body.institution == "") {
            resourceInfo =
                await Resource.find({
                    status: req.body.status,
                    yearOfCreation: req.body.yearOfCreation
                })
        } else if (req.body.state == "empty" && req.body.yearOfCreation == "") {
            resourceInfo =
                await Resource.find({
                    status: req.body.status,
                    institution: req.body.institution
                })
        } else if (req.body.institution == "" && req.body.yearOfCreation == "") {
            resourceInfo =
                await Resource.find({
                    status: req.body.status,
                    state: req.body.state
                })
        }

        // 3) two fields empty
        else if (req.body.state == "empty") {
            resourceInfo =
                await Resource.find({
                    status: req.body.status,
                    yearOfCreation: req.body.yearOfCreation,
                    institution: req.body.institution
                })
        } else if (req.body.yearOfCreation == "") {
            resourceInfo =
                await Resource.find({
                    status: req.body.status,
                    institution: req.body.institution,
                    state: req.body.state
                })
        } else if (req.body.institution == "") {
            resourceInfo =
                await Resource.find({
                    status: req.body.status,
                    state: req.body.state,
                    yearOfCreation: req.body.yearOfCreation
                })
        }

        // all fields nonempty
        else {
            resourceInfo =
                await Resource.find({
                    status: req.body.status,
                    state: req.body.state,
                    yearOfCreation: req.body.yearOfCreation,
                    institution: req.body.institution
                })
        }

        console.log("res: " + resourceInfo)

        res.locals.resourceInfo = resourceInfo

        await res.render('showResources')

    } catch (e) {
        next(e)
    }
}

exports.loadAllFacultyResources = async (req, res, next) => {
    try {
        let facultyExclusive = await Resource.find({status: 'privateToProfessor'})
        res.render('facultyExclusive', {
            facultyExclusive: facultyExclusive
        })
    } catch (e) {
        next(e)
    }
}

exports.uploadToFacultyExclusive = async (req, res, next) => {
    try {
        let tagsString = req.body.tags
        let tags = tagsString.split(",")
        console.log(tags)
        let newResource = new Resource({
            ownerId: req.user._id,
            courseId: null,
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
        res.redirect('/facultyExclusive')
    } catch (e) {
        next(e)
    }
}

exports.loadPublicResources = async (req, res, next) => {
    try {
        let publicRc = await Resource.find({status: 'public'}).sort({'createdAt': -1}).limit(2)

        res.locals.publicRc = publicRc
        await res.render('index')
    } catch (e) {
        console.log("error: " + e)
        next(e)
    }
}
