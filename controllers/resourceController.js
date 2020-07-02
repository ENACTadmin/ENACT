'use strict';
const Course = require('../models/Course');
const Resource = require('../models/Resource');
const ResourceSet = require('../models/ResourceSet');
let resourceInfoSet


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
                yearOfCreation: req.body.yearOfCreation,
                checkStatus: 'approve'// content's actual creation time
            })
        } else {
            const checkStatus = 'underReview'
            // student uploaded resource
            if (res.locals.status === "student") {
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
                    checkStatus: checkStatus,
                })
            }
            // faculty/admin uploaded resource
            else {
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
                    checkStatus: 'approve',
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
        let tagsString = await req.body.selectedTags
        let tags = await tagsString.split(",")
        console.log("tags received: ", tags)
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
        await res.redirect('back')
    } catch (e) {
        next(e)
    }
}

exports.studentUpdateResource = async (req, res, next) => {
    console.log('student')
    const resourceId = await req.params.resourceId
    try {
        let tagsString = await req.body.selectedTags
        let tags = tagsString.split(",")
        console.log("tags received: ", tags)
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
        oldResource.checkStatus = 'underReview'
        await oldResource.save()
        // save the new resource
        res.redirect('back')
    } catch (e) {
        next(e)
    }
}

exports.loadResources = async (req, res, next) => {
    const courseId = req.params.courseId
    const checkStatus = 'approve'
    try {
        let resources = await Resource.find({
            courseId: courseId,
            checkStatus: checkStatus
        })
        let starred = await ResourceSet.findOne({ownerId: req.user._id})
        let resourceIds = null
        if (starred) {
            resourceIds = await starred.resources
        }
        res.locals.resourceIds = resourceIds
        res.render('./pages/showOneCourse', {
            resourceInfo: resources
        })
    } catch (e) {
        next(e)
    }
}

exports.primarySearch = async (req, res, next) => {
    let resourceInfo = null
    const checkStatus = 'approve'
    try {
        if (res.locals.status === 'admin' || res.locals.status === 'faculty') {
            resourceInfo = await Resource.find({
                checkStatus: checkStatus,
                $or: [
                    {description: {'$regex': '.*' + req.body.search + '.*', '$options': 'i'}},
                    {name: {'$regex': '.*' + req.body.search + '.*', '$options': 'i'}}
                ]
            })
        } else {
            resourceInfo = await Resource.find({
                checkStatus: checkStatus,
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
        let starred = await ResourceSet.findOne({ownerId: req.user._id})
        let resourceIds = null
        if (starred) {
            resourceIds = await starred.resources
        }
        res.locals.resourceIds = resourceIds
        res.locals.resourceInfo = resourceInfo
        resourceInfoSet = resourceInfo
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
                        checkStatus: 'approve',
                        $or: [
                            {description: {'$regex': '.*' + req.body.search + '.*', '$options': 'i'}},
                            {name: {'$regex': '.*' + req.body.search + '.*', '$options': 'i'}}
                        ]
                    })
                }
                // search resources under a certain status
                else {
                    resourceInfo = await Resource.find({
                        checkStatus: 'approve',
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
                        checkStatus: 'approve',
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
                        checkStatus: 'approve',
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
                        checkStatus: 'approve',
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
                        checkStatus: 'approve',
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
                        checkStatus: 'approve',
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
                        checkStatus: 'approve',
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
                        checkStatus: 'approve',
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
                        checkStatus: 'approve',
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
                        checkStatus: 'approve',
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
                        checkStatus: 'approve',
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
                        checkStatus: 'approve',
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
                        checkStatus: 'approve',
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
                        checkStatus: 'approve',
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
                        checkStatus: 'approve',
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
                        checkStatus: 'approve',
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
                        checkStatus: 'approve',
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
                        checkStatus: 'approve',
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
                        checkStatus: 'approve',
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
                        checkStatus: 'approve',
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
                        checkStatus: 'approve',
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
                        checkStatus: 'approve',
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
                        checkStatus: 'approve',
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
                        checkStatus: 'approve',
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
                        checkStatus: 'approve',
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
                        checkStatus: 'approve',
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
                        checkStatus: 'approve',
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
                        checkStatus: 'approve',
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
                        checkStatus: 'approve',
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
                        checkStatus: 'approve',
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
                        checkStatus: 'approve',
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

    } catch (e) {
        next(e)
    }
}

exports.loadAllFacultyResources = async (req, res, next) => {
    try {
        let resourceInfo = await Resource.find({status: 'privateToProfessor'})
        let starred = await ResourceSet.findOne({ownerId: req.user._id})
        let resourceIds = null
        console.log("starred ", starred)
        if (starred) {
            resourceIds = await starred.resources
        }
        console.log("resourceIds: ", resourceIds)
        res.locals.resourceIds = resourceIds
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

exports.starResource = async (req, res, next) => {
    try {
        let resourceId = await req.params.resourceId
        let resourceSet = await ResourceSet.findOne({ownerId: req.user._id})
        // if resourceSet collection is empty, then create a new instance
        if (!resourceSet) {
            let newResourceSet = new ResourceSet({
                ownerId: req.user._id,
                name: 'favorite',
                createdAt: new Date()
            })
            await newResourceSet.save()
            resourceSet = newResourceSet
        }
        // use the newly created instance or the one in the database
        let resourceIds = resourceSet.resources
        let newResourceIds
        if (!resourceIds) {
            newResourceIds = [resourceId]
        } else {
            newResourceIds = [resourceId].concat(resourceIds)
        }
        // save to db
        resourceSet.resources = newResourceIds
        await resourceSet.save()
        res.redirect('back')
    } catch (e) {
        next(e)
    }
}

exports.showStarredResources = async (req, res, next) => {
    try {
        let resourceInfo = null
        let resourceSet = await ResourceSet.findOne({ownerId: req.user._id})
        console.log(resourceSet)
        if (!resourceSet) {
            console.log('resource set empty')
        } else {
            console.log('resource set not empty')
            let resourceInfoIds = await resourceSet.resources
            resourceInfo = await Resource.find({_id: {$in: resourceInfoIds}})
        }
        res.locals.resourceInfo = resourceInfo
        res.render('./pages/showStarredResources')
    } catch (e) {
        next(e)
    }
}

exports.unstarResource = async (req, res, next) => {
    try {
        let resourceId = await req.params.resourceId
        let resourceSet = await ResourceSet.findOne({ownerId: req.user._id})
        let resourceIds = resourceSet.resources
        console.log("ids: ", resourceIds)
        let newResourceIds = []
        for (let i = 0; i < resourceIds.length; i++) {
            if (resourceIds[i].toString() !== resourceId) {
                newResourceIds.push(resourceIds[i])
            }
        }
        console.log("new id: ", newResourceIds)
        resourceSet.resources = newResourceIds
        await resourceSet.save()
        res.redirect('back')
    } catch (e) {
        next(e)
    }
}

exports.checkUserName = async (req, res, next) => {
    if (req.user && !req.user.userName) {
        console.log("first time user!");
        res.redirect('/myProfile')
    }
    next()
}

<<<<<<< HEAD
exports.starResourceAlt = async (req, res, next) => {
    try {
        let resourceId = await req.params.resourceId
        let resourceSet = await ResourceSet.findOne({ownerId: req.user._id})
        console.log("type: ", typeof resourceSet)
        // if resourceSet collection is empty, then create a new instance
        if (!resourceSet) {
            let newResourceSet = new ResourceSet({
                ownerId: req.user._id,
                name: 'favorite',
                createdAt: new Date()
            })
            await newResourceSet.save()
            resourceSet = newResourceSet
        }
        // use the newly created instance or the one in the database
        let resourceIds = resourceSet.resources
        let newResourceIds
        if (!resourceIds) {
            newResourceIds = [resourceId]
        } else {
            newResourceIds = [resourceId].concat(resourceIds)
        }
        // save to db
        resourceSet.resources = newResourceIds
        await resourceSet.save()
        res.locals.resourceIds = newResourceIds
        res.locals.resourceInfo = resourceInfoSet
        res.render('./pages/showResources')
=======
exports.showMyResources = async (req, res, next) => {
    try {
        let resourceInfo = await Resource.find({ownerId: req.user._id})
        res.render('./pages/myResourcesFaculty', {
            resourceInfo: resourceInfo
        })
>>>>>>> 513d17d316f4c35e94b7f96011359e5aaa1b3995
    } catch (e) {
        next(e)
    }
}

<<<<<<< HEAD
exports.unstarResourceAlt = async (req, res, next) => {
    try {
        let resourceId = await req.params.resourceId
        let resourceSet = await ResourceSet.findOne({ownerId: req.user._id})
        let resourceIds = resourceSet.resources
        console.log("ids: ", resourceIds)
        let newResourceIds = []
        for (let i = 0; i < resourceIds.length; i++) {
            if (resourceIds[i].toString() !== resourceId) {
                newResourceIds.push(resourceIds[i])
            }
        }
        resourceSet.resources = newResourceIds
        await resourceSet.save()
        res.locals.resourceIds = newResourceIds
        res.locals.resourceInfo = resourceInfoSet
        res.render('./pages/showResources')
=======
exports.showMyResourcesStudent = async (req, res, next) => {
    try {
        let resourceInfo = await Resource.find({
            ownerId: req.user._id,
        })
        res.render('./pages/myResourcesStudent', {
            resourceInfo: resourceInfo
        })
>>>>>>> 513d17d316f4c35e94b7f96011359e5aaa1b3995
    } catch (e) {
        next(e)
    }
}
