'use strict';
// const Course = require('../models/Course');
// const User = require('../models/User');
const Resource = require('../models/Resource')

exports.uploadResource = async (req, res, next) => {
    console.log("in upload resource")
    const courseId = req.params.courseId
    console.log("courseId: " + courseId)
    try {
        let tagsString = req.body.tags
        let tags = tagsString.split(",")
        let newResource
        if (courseId === undefined) {
            newResource = new Resource({
                ownerId: req.user._id,
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
        } else {
            newResource = new Resource({
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
        }
        // save the new resource
        await newResource.save()
        if (courseId === undefined)
            res.redirect('/facultyExclusive')
        else
            res.redirect('/showOneCourse/' + courseId)
    } catch (e) {
        next(e)
    }
}

exports.loadResources = async (req, res, next) => {
    const courseId = req.params.courseId
    try {
        let resources = await Resource.find({courseId: courseId})
        res.render('./pages/showOneCourse', {
            resourceInfo: resources
        })
    } catch (e) {
        next(e)
    }
}

exports.primarySearch = async (req, res, next) => {
    let resourceInfo = null
    let check = true
    let i = 0
    let k = 0
    let z = 0
    try {
        if (res.locals.status === 'admin' || res.locals.status === 'faculty') {

            resourceInfo = await Resource.find({
                $or: [
                    {description: {'$regex': '.*' + req.body.search + '.*', '$options': 'i'}},
                    {name: {'$regex': '.*' + req.body.search + '.*', '$options': 'i'}}
                ]
            })
            // resourceInfo = await Resource.find({name: {'$regex': '.*' + req.body.search + '.*', '$options': 'i'}})
            // let someMoreResource = await Resource.find({
            //     description: {'$regex': '.*' + req.body.search + '.*', '$options': 'i'}
            // })
            // while (i < someMoreResource.length) {
            //     for (let g = 0; g < resourceInfo.length; g++) {
            //         if (resourceInfo[g]._id.equals(someMoreResource[i]._id)) {
            //             check = false
            //         }
            //     }
            //     if (check) {
            //         await resourceInfo.push(someMoreResource[i])
            //     }
            //     i++
            // }
        } else {
            resourceInfo = await Resource.find({
                $or: [
                    {
                        description: {'$regex': '.*' + req.body.search + '.*', '$options': 'i'},
                        status: {$in: ["privateToENACT", "public"]}
                    },
                    {
                        name: {'$regex': '.*' + req.body.search + '.*', '$options': 'i'},
                        status: {$in: ["privateToENACT", "public"]}
                    }
                ],
            })
            // let someMoreResource = await Resource.find({
            //     name: {'$regex': '.*' + req.body.search + '.*', '$options': 'i'},
            //     status: "public"
            // })
            // for (let i = 0; i < someMoreResource.length; i++) {
            //     await resourceInfo.push(someMoreResource[i])
            // }
            // let extraResource = await Resource.find({
            //     description: {'$regex': '.*' + req.body.search + '.*', '$options': 'i'},
            //     status: "privateToENACT"
            // })
            // while (k < extraResource.length) {
            //     for (let g = 0; g < resourceInfo.length; g++) {
            //         if (resourceInfo[g]._id.equals(extraResource[k]._id)) {
            //             check = false
            //         }
            //     }
            //     if (check == true) {
            //         await resourceInfo.push(extraResource[k])
            //     }
            //     k++
            // }
            // let extraMoreResource = await Resource.find({
            //     description: {'$regex': '.*' + req.body.search + '.*', '$options': 'i'},
            //     status: "public"
            // })
            // while (z < extraMoreResource.length) {
            //     for (let y = 0; y < resourceInfo.length; y++) {
            //         if (resourceInfo[y]._id.equals(extraMoreResource[z]._id)) {
            //             check = false
            //         }
            //     }
            //     if (check == true) {
            //         await resourceInfo.push(extraMoreResource[z])
            //     }
            //     z++
            // }
        }
        res.locals.resourceInfo = resourceInfo
        res.render('./pages/showPrimaryResources')

    } catch (e) {
        next(e)
    }
}

exports.searchByFilled = async (req, res, next) => {
    let resourceInfo = null
    try {
        // require status
        if (req.body.state == "empty" && req.body.institution == "" && req.body.yearOfCreation == "") {
            console.log("all empty")
            resourceInfo =
                await Resource.find({status: req.body.status})
        }

        // require status and yearOfCreation
        else if (req.body.state == "empty" && req.body.institution == "") {
            resourceInfo =
                await Resource.find({
                    status: req.body.status,
                    yearOfCreation: req.body.yearOfCreation
                })
        }
        // require status and institution
        else if (req.body.state == "empty" && req.body.yearOfCreation == "") {
            resourceInfo =
                await Resource.find({
                    status: req.body.status,
                    institution: req.body.institution
                })
        }
        //require status and state
        else if (req.body.institution == "" && req.body.yearOfCreation == "") {
            resourceInfo =
                await Resource.find({
                    status: req.body.status,
                    state: req.body.state
                })
        }

        else if (req.body.state == "empty") {
            resourceInfo =
                await Resource.find({
                    status: req.body.status,
                    yearOfCreation: req.body.yearOfCreation,
                    institution: req.body.institution
                })
        }

        else if (req.body.yearOfCreation == "") {
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

        res.render('./pages/showResources')

    } catch (e) {
        next(e)
    }
}

exports.loadAllFacultyResources = async (req, res, next) => {
    try {
        let facultyExclusive = await Resource.find({status: 'privateToProfessor'})
        res.render('./pages/facultyExclusive', {
            facultyExclusive: facultyExclusive
        })
    } catch (e) {
        next(e)
    }
}

exports.loadPublicResources = async (req, res, next) => {
    try {
        let publicRc = await Resource.find({status: 'public'}).sort({'createdAt': -1}).limit(2)
        res.locals.publicRc = publicRc
        res.render('./pages/index')
    } catch (e) {
        console.log("error: " + e)
        next(e)
    }
}