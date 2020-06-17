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
        if (res.locals.status === 'admin' || res.locals.status === 'faculty') {
            resourceInfo = await Resource.find({
                $or: [
                    {description: {'$regex': '.*' + req.body.search + '.*', '$options': 'i'}},
                    {name: {'$regex': '.*' + req.body.search + '.*', '$options': 'i'}}
                ]
            })
        }
        // student search
        else {
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

        res.locals.resourceInfo = resourceInfo

        res.render('./pages/showResources')

    } catch
        (e) {
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