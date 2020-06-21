'use strict';
const Course = require('../models/Course');
const Resource = require('../models/Resource');

exports.uploadResource = async (req, res, next) => {
    const courseId = req.params.courseId
    console.log("in upload Resource")
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
                uri: req.body.uri, // universal resource identifier specIdific to the resource
                state: req.body.state,
                resourceType: req.body.resourceType, // video/text document ...
                institution: req.body.institution,
                yearOfCreation: req.body.yearOfCreation // content's actual creation time
            })
        } else {
            const checkStatus = 'UnderReview'
            if (res.locals.status == "student") {
                let facultyInfo = await Course.findOne({_id: courseId})
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
                    resourceType: req.body.resourceType, // video/text document ...
                    institution: req.body.institution,
                    yearOfCreation: req.body.yearOfCreation,// content's actual creation time
                    facultyId: facultyInfo.ownerId, //belong to which faculty to approve
                    checkStatus: checkStatus
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
                    resourceType: req.body.resourceType, // video/text document ...
                    institution: req.body.institution,
                    yearOfCreation: req.body.yearOfCreation,// content's actual creation time
                })
            }

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

exports.updateResource = async (req, res, next) => {
    const resourceId = await req.params.resourceId
    try {
        let tagsString = await req.body.tags
        let tags = tagsString.split(",")
        let oldResource = await Resource.findOne({_id: resourceId})
        oldResource.name = await req.body.resourceName
        oldResource.status = await req.body.status
        oldResource.description = await req.body.resourceDescription
        oldResource.uri = await req.body.uri
        oldResource.state = await req.body.state
        oldResource.resourceType = await req.body.resourceType
        oldResource.institution = await req.body.institution
        oldResource.yearOfCreation = await req.body.yearOfCreation
        oldResource.tags = await tags
        await oldResource.save()
        // save the new resource
        res.redirect('back')
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
    try {
        if (res.locals.status === 'admin' || res.locals.status === 'faculty') {
            resourceInfo = await Resource.find({
                $or: [
                    {description: {'$regex': '.*' + req.body.search + '.*', '$options': 'i'}},
                    {name: {'$regex': '.*' + req.body.search + '.*', '$options': 'i'}}
                ]
            })
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
        }
        res.locals.resourceInfo = resourceInfo
        res.render('./pages/showResources')

    } catch (e) {
        next(e)
    }
}

exports.searchByFilled = async (req, res, next) => {
    let resourceInfo = null

    try {
        // -----------------------------------------------------------------
        // --------------------admin or faculty search----------------------
        // -----------------------------------------------------------------
        if (res.locals.status === 'admin' || res.locals.status === 'faculty') {

            // situation 1: only status is filled

            if (req.body.state == "empty" && req.body.institution == "" && req.body.yearOfCreation == "") {
                // search for all resources
                if (req.body.status === "all") {
                    resourceInfo = await Resource.find({
                        $or: [
                            {description: {'$regex': '.*' + req.body.search + '.*', '$options': 'i'}},
                            {name: {'$regex': '.*' + req.body.search + '.*', '$options': 'i'}}
                        ]
                    })
                }
                // search resources under a certain status
                else {
                    resourceInfo = await Resource.find({
                        status: req.body.status,
                        $or: [
                            {description: {'$regex': '.*' + req.body.search + '.*', '$options': 'i'}},
                            {name: {'$regex': '.*' + req.body.search + '.*', '$options': 'i'}}
                        ]
                    })
                }
            }

                // situation 2: 2 fields are filled other than status

            // require status and yearOfCreation
            else if (req.body.state == "empty" && req.body.institution == "") {
                // search for all resources
                if (req.body.status === "all") {
                    resourceInfo = await Resource.find({
                        yearOfCreation: req.body.yearOfCreation,
                        $or: [
                            {description: {'$regex': '.*' + req.body.search + '.*', '$options': 'i'}},
                            {name: {'$regex': '.*' + req.body.search + '.*', '$options': 'i'}}
                        ]
                    })
                }
                // search resources under a certain status
                else {
                    resourceInfo = await Resource.find({
                        status: req.body.status,
                        yearOfCreation: req.body.yearOfCreation,
                        $or: [
                            {description: {'$regex': '.*' + req.body.search + '.*', '$options': 'i'}},
                            {name: {'$regex': '.*' + req.body.search + '.*', '$options': 'i'}}
                        ]
                    })
                }
            }
            // require status and institution
            else if (req.body.state == "empty" && req.body.yearOfCreation == "") {
                // search for all resources
                if (req.body.status === "all") {
                    resourceInfo = await Resource.find({
                        institution: req.body.institution,
                        $or: [
                            {description: {'$regex': '.*' + req.body.search + '.*', '$options': 'i'}},
                            {name: {'$regex': '.*' + req.body.search + '.*', '$options': 'i'}}
                        ]
                    })
                }
                // search resources under a certain status
                else {
                    resourceInfo = await Resource.find({
                        status: req.body.status,
                        institution: req.body.institution,
                        $or: [
                            {description: {'$regex': '.*' + req.body.search + '.*', '$options': 'i'}},
                            {name: {'$regex': '.*' + req.body.search + '.*', '$options': 'i'}}
                        ]
                    })
                }
            }
            //require status and state
            else if (req.body.institution == "" && req.body.yearOfCreation == "") {
                // search for all resources
                if (req.body.status === "all") {
                    resourceInfo = await Resource.find({
                        state: req.body.state,
                        $or: [
                            {description: {'$regex': '.*' + req.body.search + '.*', '$options': 'i'}},
                            {name: {'$regex': '.*' + req.body.search + '.*', '$options': 'i'}}
                        ]
                    })
                }
                // search resources under a certain status
                else {
                    resourceInfo = await Resource.find({
                        state: req.body.state,
                        status: req.body.status,
                        $or: [
                            {description: {'$regex': '.*' + req.body.search + '.*', '$options': 'i'}},
                            {name: {'$regex': '.*' + req.body.search + '.*', '$options': 'i'}}
                        ]
                    })
                }
            }

            // situation 3: status is filled, other two of three fields are filled

            else if (req.body.state == "empty") {
                // search for all resources
                if (req.body.status === "all") {
                    resourceInfo = await Resource.find({
                        yearOfCreation: req.body.yearOfCreation,
                        institution: req.body.institution,
                        $or: [
                            {description: {'$regex': '.*' + req.body.search + '.*', '$options': 'i'}},
                            {name: {'$regex': '.*' + req.body.search + '.*', '$options': 'i'}}
                        ]
                    })
                }
                // search resources under a certain status
                else {
                    resourceInfo = await Resource.find({
                        status: req.body.status,
                        yearOfCreation: req.body.yearOfCreation,
                        institution: req.body.institution,
                        $or: [
                            {description: {'$regex': '.*' + req.body.search + '.*', '$options': 'i'}},
                            {name: {'$regex': '.*' + req.body.search + '.*', '$options': 'i'}}
                        ]
                    })
                }
            } else if (req.body.yearOfCreation == "") {
                // search for all resources
                if (req.body.status === "all") {
                    resourceInfo = await Resource.find({
                        institution: req.body.institution,
                        state: req.body.state,
                        $or: [
                            {description: {'$regex': '.*' + req.body.search + '.*', '$options': 'i'}},
                            {name: {'$regex': '.*' + req.body.search + '.*', '$options': 'i'}}
                        ]
                    })
                }
                // search resources under a certain status
                else {
                    resourceInfo = await Resource.find({
                        status: req.body.status,
                        institution: req.body.institution,
                        state: req.body.state,
                        $or: [
                            {description: {'$regex': '.*' + req.body.search + '.*', '$options': 'i'}},
                            {name: {'$regex': '.*' + req.body.search + '.*', '$options': 'i'}}
                        ]
                    })
                }
            } else if (req.body.institution == "") {
                // search for all resources
                if (req.body.status === "all") {
                    resourceInfo = await Resource.find({
                        state: req.body.state,
                        yearOfCreation: req.body.yearOfCreation,
                        $or: [
                            {description: {'$regex': '.*' + req.body.search + '.*', '$options': 'i'}},
                            {name: {'$regex': '.*' + req.body.search + '.*', '$options': 'i'}}
                        ]
                    })
                }
                // search resources under a certain status
                else {
                    resourceInfo = await Resource.find({
                        status: req.body.status,
                        state: req.body.state,
                        yearOfCreation: req.body.yearOfCreation,
                        $or: [
                            {description: {'$regex': '.*' + req.body.search + '.*', '$options': 'i'}},
                            {name: {'$regex': '.*' + req.body.search + '.*', '$options': 'i'}}
                        ]
                    })
                }
            }

            // situation 4: all fields nonempty

            else {
                // search for all resources
                if (req.body.status === "all") {
                    resourceInfo = await Resource.find({
                        state: req.body.state,
                        yearOfCreation: req.body.yearOfCreation,
                        institution: req.body.institution,
                        $or: [
                            {description: {'$regex': '.*' + req.body.search + '.*', '$options': 'i'}},
                            {name: {'$regex': '.*' + req.body.search + '.*', '$options': 'i'}}
                        ]
                    })
                }
                // search resources under a certain status
                else {
                    resourceInfo = await Resource.find({
                        status: req.body.status,
                        state: req.body.state,
                        yearOfCreation: req.body.yearOfCreation,
                        institution: req.body.institution,
                        $or: [
                            {description: {'$regex': '.*' + req.body.search + '.*', '$options': 'i'}},
                            {name: {'$regex': '.*' + req.body.search + '.*', '$options': 'i'}}
                        ]
                    })
                }
            }
        }

            // -----------------------------------------------------------------
            // -------------------------student search--------------------------
        // -----------------------------------------------------------------
        else {
            // situation 1: only status is filled

            if (req.body.state == "empty" && req.body.institution == "" && req.body.yearOfCreation == "") {
                // search for all resources
                if (req.body.status === "all") {
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
                        ]
                    })
                }
                // search resources under a certain status
                else {
                    resourceInfo = await Resource.find({
                        status: req.body.status,
                        $or: [
                            {
                                description: {'$regex': '.*' + req.body.search + '.*', '$options': 'i'},
                                status: {$in: ["privateToENACT", "public"]}
                            },
                            {
                                name: {'$regex': '.*' + req.body.search + '.*', '$options': 'i'},
                                status: {$in: ["privateToENACT", "public"]}
                            }
                        ]
                    })
                }
            }

                // situation 2: 2 fields are filled other than status

            // require status and yearOfCreation
            else if (req.body.state == "empty" && req.body.institution == "") {
                // search for all resources
                if (req.body.status === "all") {
                    resourceInfo = await Resource.find({
                        yearOfCreation: req.body.yearOfCreation,
                        $or: [
                            {
                                description: {'$regex': '.*' + req.body.search + '.*', '$options': 'i'},
                                status: {$in: ["privateToENACT", "public"]}
                            },
                            {
                                name: {'$regex': '.*' + req.body.search + '.*', '$options': 'i'},
                                status: {$in: ["privateToENACT", "public"]}
                            }
                        ]
                    })
                }
                // search resources under a certain status
                else {
                    resourceInfo = await Resource.find({
                        status: req.body.status,
                        yearOfCreation: req.body.yearOfCreation,
                        $or: [
                            {
                                description: {'$regex': '.*' + req.body.search + '.*', '$options': 'i'},
                                status: {$in: ["privateToENACT", "public"]}
                            },
                            {
                                name: {'$regex': '.*' + req.body.search + '.*', '$options': 'i'},
                                status: {$in: ["privateToENACT", "public"]}
                            }
                        ]
                    })
                }
            }
            // require status and institution
            else if (req.body.state == "empty" && req.body.yearOfCreation == "") {
                // search for all resources
                if (req.body.status === "all") {
                    resourceInfo = await Resource.find({
                        institution: req.body.institution,
                        $or: [
                            {
                                description: {'$regex': '.*' + req.body.search + '.*', '$options': 'i'},
                                status: {$in: ["privateToENACT", "public"]}
                            },
                            {
                                name: {'$regex': '.*' + req.body.search + '.*', '$options': 'i'},
                                status: {$in: ["privateToENACT", "public"]}
                            }
                        ]
                    })
                }
                // search resources under a certain status
                else {
                    resourceInfo = await Resource.find({
                        status: req.body.status,
                        institution: req.body.institution,
                        $or: [
                            {
                                description: {'$regex': '.*' + req.body.search + '.*', '$options': 'i'},
                                status: {$in: ["privateToENACT", "public"]}
                            },
                            {
                                name: {'$regex': '.*' + req.body.search + '.*', '$options': 'i'},
                                status: {$in: ["privateToENACT", "public"]}
                            }
                        ]
                    })
                }
            }
            //require status and state
            else if (req.body.institution == "" && req.body.yearOfCreation == "") {
                // search for all resources
                if (req.body.status === "all") {
                    resourceInfo = await Resource.find({
                        state: req.body.state,
                        $or: [
                            {
                                description: {'$regex': '.*' + req.body.search + '.*', '$options': 'i'},
                                status: {$in: ["privateToENACT", "public"]}
                            },
                            {
                                name: {'$regex': '.*' + req.body.search + '.*', '$options': 'i'},
                                status: {$in: ["privateToENACT", "public"]}
                            }
                        ]
                    })
                }
                // search resources under a certain status
                else {
                    resourceInfo = await Resource.find({
                        state: req.body.state,
                        status: req.body.status,
                        $or: [
                            {
                                description: {'$regex': '.*' + req.body.search + '.*', '$options': 'i'},
                                status: {$in: ["privateToENACT", "public"]}
                            },
                            {
                                name: {'$regex': '.*' + req.body.search + '.*', '$options': 'i'},
                                status: {$in: ["privateToENACT", "public"]}
                            }
                        ]
                    })
                }
            }

            // situation 3: status is filled, other two of three fields are filled

            else if (req.body.state == "empty") {
                // search for all resources
                if (req.body.status === "all") {
                    resourceInfo = await Resource.find({
                        yearOfCreation: req.body.yearOfCreation,
                        institution: req.body.institution,
                        $or: [
                            {
                                description: {'$regex': '.*' + req.body.search + '.*', '$options': 'i'},
                                status: {$in: ["privateToENACT", "public"]}
                            },
                            {
                                name: {'$regex': '.*' + req.body.search + '.*', '$options': 'i'},
                                status: {$in: ["privateToENACT", "public"]}
                            }
                        ]
                    })
                }
                // search resources under a certain status
                else {
                    resourceInfo = await Resource.find({
                        status: req.body.status,
                        yearOfCreation: req.body.yearOfCreation,
                        institution: req.body.institution,
                        $or: [
                            {
                                description: {'$regex': '.*' + req.body.search + '.*', '$options': 'i'},
                                status: {$in: ["privateToENACT", "public"]}
                            },
                            {
                                name: {'$regex': '.*' + req.body.search + '.*', '$options': 'i'},
                                status: {$in: ["privateToENACT", "public"]}
                            }
                        ]
                    })
                }
            } else if (req.body.yearOfCreation == "") {
                // search for all resources
                if (req.body.status === "all") {
                    resourceInfo = await Resource.find({
                        institution: req.body.institution,
                        state: req.body.state,
                        $or: [
                            {
                                description: {'$regex': '.*' + req.body.search + '.*', '$options': 'i'},
                                status: {$in: ["privateToENACT", "public"]}
                            },
                            {
                                name: {'$regex': '.*' + req.body.search + '.*', '$options': 'i'},
                                status: {$in: ["privateToENACT", "public"]}
                            }
                        ]
                    })
                }
                // search resources under a certain status
                else {
                    resourceInfo = await Resource.find({
                        status: req.body.status,
                        institution: req.body.institution,
                        state: req.body.state,
                        $or: [
                            {
                                description: {'$regex': '.*' + req.body.search + '.*', '$options': 'i'},
                                status: {$in: ["privateToENACT", "public"]}
                            },
                            {
                                name: {'$regex': '.*' + req.body.search + '.*', '$options': 'i'},
                                status: {$in: ["privateToENACT", "public"]}
                            }
                        ]
                    })
                }
            } else if (req.body.institution == "") {
                // search for all resources
                if (req.body.status === "all") {
                    resourceInfo = await Resource.find({
                        state: req.body.state,
                        yearOfCreation: req.body.yearOfCreation,
                        $or: [
                            {
                                description: {'$regex': '.*' + req.body.search + '.*', '$options': 'i'},
                                status: {$in: ["privateToENACT", "public"]}
                            },
                            {
                                name: {'$regex': '.*' + req.body.search + '.*', '$options': 'i'},
                                status: {$in: ["privateToENACT", "public"]}
                            }
                        ]
                    })
                }
                // search resources under a certain status
                else {
                    resourceInfo = await Resource.find({
                        status: req.body.status,
                        state: req.body.state,
                        yearOfCreation: req.body.yearOfCreation,
                        $or: [
                            {
                                description: {'$regex': '.*' + req.body.search + '.*', '$options': 'i'},
                                status: {$in: ["privateToENACT", "public"]}
                            },
                            {
                                name: {'$regex': '.*' + req.body.search + '.*', '$options': 'i'},
                                status: {$in: ["privateToENACT", "public"]}
                            }
                        ]
                    })
                }
            }

            // situation 4: all fields nonempty

            else {
                // search for all resources
                if (req.body.status === "all") {
                    resourceInfo = await Resource.find({
                        state: req.body.state,
                        yearOfCreation: req.body.yearOfCreation,
                        institution: req.body.institution,
                        $or: [
                            {
                                description: {'$regex': '.*' + req.body.search + '.*', '$options': 'i'},
                                status: {$in: ["privateToENACT", "public"]}
                            },
                            {
                                name: {'$regex': '.*' + req.body.search + '.*', '$options': 'i'},
                                status: {$in: ["privateToENACT", "public"]}
                            }
                        ]
                    })
                }
                // search resources under a certain status
                else {
                    resourceInfo = await Resource.find({
                        status: req.body.status,
                        state: req.body.state,
                        yearOfCreation: req.body.yearOfCreation,
                        institution: req.body.institution,
                        $or: [
                            {
                                description: {'$regex': '.*' + req.body.search + '.*', '$options': 'i'},
                                status: {$in: ["privateToENACT", "public"]}
                            },
                            {
                                name: {'$regex': '.*' + req.body.search + '.*', '$options': 'i'},
                                status: {$in: ["privateToENACT", "public"]}
                            }
                        ]
                    })
                }
            }
        }

        // -----------------------------------------------------------------
        // ---------------------------tag filter----------------------------
        // -----------------------------------------------------------------

        let filteredResource = []
        if (req.body.tags.length > 0) {
            console.log("tag used")
            for (let m = 0; m < resourceInfo.length; m++) {
                let tagged = await req.body.tags.split(',')
                let result = tagged.every(val => resourceInfo[m].tags.includes(val));
                if (result) {
                    filteredResource.push(resourceInfo[m])
                }
            }
        } else {
            console.log("tag not used")
            filteredResource = resourceInfo
        }

        res.locals.resourceInfo = filteredResource

        res.render('./pages/showResources')

    } catch
        (e) {
        next(e)
    }
}

exports.loadAllFacultyResources = async (req, res, next) => {
    try {
        let resourceInfo = await Resource.find({status: 'privateToProfessor'})
        res.render('./pages/facultyExclusive', {
            resourceInfo: resourceInfo
        })
    } catch (e) {
        next(e)
    }
}

let fileData = require('../public/js/slideShow')
exports.loadPublicResources = async (req, res, next) => {
    try {
        let publicRc = await Resource.find({status: 'public'}).sort({'createdAt': -1}).limit(2)
        res.locals.publicRc = publicRc
        let imagePaths = fileData.getPath('slideShow')
        let facultyPaths = fileData.getPath('faculty')
        res.locals.imagePaths = imagePaths
        res.locals.facultyPaths = facultyPaths
        res.render('./pages/index')
    } catch (e) {
        console.log("error: " + e)
        next(e)
    }
}

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

exports.loadOneResource = async (req, res, next) => {
    try {
        let resourceId = await req.params.resourceId
        let resourceInfo = await Resource.findOne({_id: resourceId})
        res.locals.resourceInfo = resourceInfo
        res.render('./pages/updateResource')
    } catch (e) {
        next(e)
    }
}

exports.removeResource = async (req, res, next) => {
    try {
        let resourceId = await req.params.resourceId
        await Resource.deleteOne({_id: resourceId})
        console.log('url: ', req.url)
        res.redirect('back')
    } catch (e) {
        next(e)
    }
}