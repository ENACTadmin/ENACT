'use strict';
const Course = require('../models/Course');
const Resource = require('../models/Resource');
const ResourceSet = require('../models/ResourceSet');
const Word2Id = require('../models/Word2Id');

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
                description: req.body.description,
                tags: tags, // tags as array
                uri: req.body.uri, // universal resource identifier specIdific to the resource
                state: req.body.state,
                contentType: req.body.contentType,
                mediaType: req.body.mediaType, // video/text document ...
                institution: req.body.institution,
                yearOfCreation: req.body.yearOfCreation, // content's actual creation time
                checkStatus: 'approve'
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
                    description: req.body.description,
                    tags: tags, // tags as array
                    uri: req.body.uri, // universal resource identifier specific to the resource
                    state: req.body.state,
                    contentType: req.body.contentType,
                    mediaType: req.body.mediaType, // video/text document ...
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
                    description: req.body.description,
                    tags: tags, // tags as array
                    uri: req.body.uri, // universal resource identifier specific to the resource
                    state: req.body.state,
                    contentType: req.body.contentType,
                    mediaType: req.body.mediaType,
                    institution: req.body.institution,
                    yearOfCreation: req.body.yearOfCreation,// content's actual creation time
                    checkStatus: 'approve',
                })
            }
        }
        // save the new resource
        await newResource.save()
        let fullContent = newResource.name + ',' + newResource.description + ',' + newResource.tags + ','
            + newResource.state + ',' + newResource.contentType + ',' + newResource.mediaType + ','
            + newResource.institution + ',' + newResource.yearOfCreation

        let regex = /[^\s\.,!?]+/g;
        let match = fullContent.match(regex);
        for (let i = 0; i < match.length; i++) {
            let word2Id = await Word2Id.findOne({word: match[i]})
            console.log('hello:', word2Id)
            // if not null
            console.log(match[i])
            if (match[i].toString() !== 'null') {
                if (word2Id === null) {
                    console.log('now setting new one')
                    let newWord2Id = new Word2Id({
                        word: match[i],
                        ids: [newResource._id]
                    })
                    newWord2Id.save()
                } else {
                    word2Id.ids = await [newResource._id].concat(word2Id.ids)
                    word2Id.save()
                }
            }
        }
        if (courseId === undefined)
            res.redirect('/facultyExclusive')
        else
            res.redirect('/showOneCourse/' + courseId)
    } catch (e) {
        next(e)
    }
}

exports.updateResource = async (req, res, next) => {
    const resourceId = req.params.resourceId
    try {
        let tagsString = req.body.selectedTags
        let tags = tagsString.split(",")
        console.log("tags received: ", tags)
        let oldResource = await Resource.findOne({_id: resourceId})
        oldResource.name = req.body.resourceName
        oldResource.status = req.body.status
        oldResource.description = req.body.resourceDescription
        oldResource.uri = req.body.uri
        oldResource.state = req.body.state
        oldResource.contentType = req.body.contentType
        oldResource.mediaType = req.body.mediaType
        oldResource.institution = req.body.institution
        oldResource.yearOfCreation = req.body.yearOfCreation
        oldResource.tags = tags
        await oldResource.save()
        // save the new resource
        await res.redirect('back')
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
        let regex = /[^\s\.,!?]+/g;
        let match = req.body.search.match(regex)
        if (match) {
            if (res.locals.status === 'admin' || res.locals.status === 'faculty') {
                for (let i = 0; i < match.length; i++) {
                    let word2Id = await Word2Id.findOne({word: match[i]})
                    if (word2Id !== null) {
                        let resourceIds = word2Id.ids
                        if (resourceInfo === null) {
                            resourceInfo = await Resource.find({_id: {$in: resourceIds}})
                        } else {
                            let newResourceInfo = await Resource.find({_id: {$in: resourceIds}})
                            resourceInfo = resourceInfo.concat(newResourceInfo)
                        }
                    }
                }
            } else {
                for (let i = 0; i < match.length; i++) {
                    let word2Id = await Word2Id.findOne({word: match[i]})
                    if (word2Id !== null) {
                        let resourceIds = word2Id.ids
                        if (resourceInfo === null) {
                            resourceInfo = await Resource.find({
                                checkStatus: checkStatus,
                                _id: {$in: resourceIds},
                                status: {$in: ["privateToENACT", "public"]}
                            })
                        } else {
                            let newResourceInfo = await Resource.find({
                                checkStatus: checkStatus,
                                _id: {$in: resourceIds},
                                status: {$in: ["privateToENACT", "public"]}
                            })
                            resourceInfo = resourceInfo.concat(newResourceInfo)
                        }
                    }
                }
            }
        }
        let starred = await ResourceSet.findOne({ownerId: req.user._id})

        let starredResourceIds = null
        if (starred) {
            starredResourceIds = await starred.resources
        }

        // remove duplicates in resource objects
        let uniqueResourceInfo = null
        if (resourceInfo) {
            let jsonObject = resourceInfo.map(JSON.stringify);
            uniqueResourceInfo = Array.from(new Set(jsonObject)).map(JSON.parse);
        }

        res.locals.resourceIds = starredResourceIds
        res.locals.resourceInfo = uniqueResourceInfo
        resourceInfoSet = uniqueResourceInfo
        res.render('./pages/showResources')
    } catch
        (e) {
        next(e)
    }
}

exports.primarySecondPublicSearch = async (req, res, next) => {
    let resourceInfo = null
    const checkStatus = 'approve'
    try {
        let regex = /[^\s\.,!?]+/g;
        let match = req.body.search.match(regex)
        if (match) {
            for (let i = 0; i < match.length; i++) {
                let word2Id = await Word2Id.findOne({word: match[i]})
                if (word2Id !== null) {
                    let resourceIds = word2Id.ids
                    if (resourceInfo === null) {
                        resourceInfo = await Resource.find({
                            checkStatus: checkStatus,
                            _id: {$in: resourceIds},
                            status: {$in: ["finalPublic", "public"]}
                        })
                    } else {
                        let newResourceInfo = await Resource.find({
                            checkStatus: checkStatus,
                            _id: {$in: resourceIds},
                            status: {$in: ["finalPublic", "public"]}
                        })
                        resourceInfo = resourceInfo.concat(newResourceInfo)
                    }
                }
            }
        }
        // remove duplicates in resource objects
        let uniqueResourceInfo = null
        if (resourceInfo) {
            let jsonObject = resourceInfo.map(JSON.stringify);
            uniqueResourceInfo = Array.from(new Set(jsonObject)).map(JSON.parse);
        }
        res.locals.resourceInfo = uniqueResourceInfo
        res.render('./pages/publicPrimarySearch-second')
    } catch (e) {
        next(e)
    }
}

exports.primaryPublicSearch = async (req, res, next) => {
    let resourceInfo = null
    let allResource = null
    const checkStatus = 'approve'
    try {
        resourceInfo = await Resource.find({
            checkStatus: checkStatus,
            $or: [
                {
                    description: {'$regex': '.*' + req.body.search + '.*', '$options': 'i'},
                    status: {$in: ["finalPublic", "public"]}
                },
                {
                    name: {'$regex': '.*' + req.body.search + '.*', '$options': 'i'},
                    status: {$in: ["finalPublic", "public"]}
                }
            ],
        })
        res.locals.resourceInfo = resourceInfo
        allResource = await Resource.find({
            checkStatus: 'approve'
        })
        res.locals.allresource = allResource
        res.render('./pages/publicPrimarySearch-second')
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

            if (req.body.state === "empty" && req.body.institution === "" && req.body.yearOfCreation === "") {
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
            else if (req.body.state === "empty" && req.body.institution === "") {
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
            else if (req.body.state === "empty" && req.body.yearOfCreation === "") {
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
            else if (req.body.institution === "" && req.body.yearOfCreation === "") {
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

            else if (req.body.state === "empty") {
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
            } else if (req.body.yearOfCreation === "") {
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
            } else if (req.body.institution === "") {
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

            if (req.body.state === "empty" && req.body.institution === "" && req.body.yearOfCreation === "") {
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
            else if (req.body.state === "empty" && req.body.institution === "") {
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
            else if (req.body.state === "empty" && req.body.yearOfCreation === "") {
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
            else if (req.body.institution === "" && req.body.yearOfCreation === "") {
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

            else if (req.body.state === "empty") {
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
            } else if (req.body.yearOfCreation === "") {
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
            } else if (req.body.institution === "") {
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
        res.locals.resourceInfo = await Resource.find({
            status: "finalPublic"
        }).sort({'createdAt': -1})
        let imagePaths = fileData.getPath('slideShow')
        let facultyPaths = fileData.getPath('faculty')
        let labelPaths = fileData.getPath('label')
        res.locals.imagePaths = imagePaths
        res.locals.labelPaths = labelPaths
        res.locals.facultyPaths = facultyPaths
        next()
    } catch (e) {
        console.log("error: " + e)
        next(e)
    }
}

exports.loadAllPublicResources = async (req, res, next) => {
    try {
        res.locals.resourceInfo = await Resource.find({
            status: {$in: ["finalPublic", "public"]}
        }).sort({'createdAt': -1})
        next()
    } catch (e) {
        console.log("error: " + e)
        next(e)
    }
}


exports.removePublicResource = async (req, res, next) => {
    const resourceId = await req.params.resourceId
    try {
        let OldResource = await Resource.findOne({_id: resourceId})
        OldResource.status = 'public'
        await OldResource.save()
        res.redirect('back')
    } catch (e) {
        next(e)
    }
}

exports.postPublicResource = async (req, res, next) => {
    const resourceId = await req.params.resourceId
    try {
        let OldResource = await Resource.findOne({_id: resourceId})
        OldResource.status = 'finalPublic'
        await OldResource.save()
        res.redirect('back')
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
        let resourceSet = await ResourceSet.findOne({ownerId: req.user._id, name: 'favorite'})
        console.log(resourceSet)
        if (!resourceSet) {
            console.log('resource set empty')
        } else {
            console.log('resource set not empty')
            let resourceInfoIds = await resourceSet.resources
            resourceInfo = await Resource.find({_id: {$in: resourceInfoIds}})
        }
        let allResourceSets = await ResourceSet.find({ownerId: req.user._id})
        res.locals.allResourceSets = allResourceSets
        res.locals.resourceInfo = resourceInfo
        res.render('./pages/showStarredResources')
    } catch (e) {
        next(e)
    }
}

exports.unstarResource = async (req, res, next) => {
    try {
        let resourceId = await req.params.resourceId
        let resourceSet = await ResourceSet.findOne({ownerId: req.user._id, name: 'favorite'})
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
        res.redirect('/profile/view/' + req.user._id)
    }
    next()
}

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
    } catch (e) {
        next(e)
    }
}

exports.unstarResourceAlt = async (req, res, next) => {
    try {
        let resourceId = req.params.resourceId
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
    } catch (e) {
        next(e)
    }
}

exports.studentUpdateResource = async (req, res, next) => {
    console.log('student')
    const resourceId = req.params.resourceId
    try {
        let tagsString = req.body.selectedTags
        let tags = tagsString.split(",")
        let oldResource = await Resource.findOne({_id: resourceId})
        oldResource.name = req.body.resourceName
        oldResource.status = req.body.status
        oldResource.description = req.body.resourceDescription
        oldResource.uri = req.body.uri
        oldResource.state = req.body.state
        oldResource.contentType = req.body.contentType
        oldResource.mediaType = req.body.mediaType
        oldResource.institution = req.body.institution
        oldResource.yearOfCreation = req.body.yearOfCreation
        oldResource.tags = tags
        oldResource.checkStatus = 'underReview'
        await oldResource.save()
        // save the new resource
        res.redirect('back')
    } catch (e) {
        next(e)
    }
}


exports.showMyResources = async (req, res, next) => {
    try {
        let resourceInfo = await Resource.find({ownerId: req.user._id})
        res.render('./pages/myResourcesFaculty', {
            resourceInfo: resourceInfo
        })
    } catch (e) {
        next(e)
    }
}

exports.showMyResourcesStudent = async (req, res, next) => {
    try {
        let resourceInfo = await Resource.find({
            ownerId: req.user._id,
        })
        res.render('./pages/myResourcesStudent', {
            resourceInfo: resourceInfo
        })
    } catch (e) {
        next(e)
    }
}

exports.uploadToPublicResr = async (req, res, next) => {
    try {
        let tagsString = req.body.tags
        let tags = tagsString.split(",")
        let newResource
        newResource = new Resource({
            ownerId: req.user._id,
            status: req.body.status, // public/private to class/private to professors
            createdAt: new Date(),
            name: req.body.resourceName,
            description: req.body.resourceDescription,
            tags: tags, // tags as array
            uri: req.body.uri, // universal resource identifier specIdific to the resource
            state: req.body.state,
            contentType: req.body.contentType,
            mediaType: req.body.mediaType, // video/text document ...
            institution: req.body.institution,
            yearOfCreation: req.body.yearOfCreation, // content's actual creation time
            checkStatus: 'approve'
        })
        await newResource.save()
        res.redirect('/managePublicResources')
    } catch (e) {
        next(e)
    }
}

exports.loadCollection = async (req, res, next) => {
    try {
        let resourceSetId = req.params.resourceSetId
        let resourceSet = await ResourceSet.findOne({_id: resourceSetId})
        let resourceInfoIds = resourceSet.resources
        let resourceInfo = await Resource.find({_id: {$in: resourceInfoIds}})
        res.locals.resourceSet = resourceSet
        res.locals.resourceInfo = resourceInfo
        if (req.user) {
            let allLikedResourceSet = await ResourceSet.findOne({ownerId: req.user._id, name: 'favorite'})
            let allLikedResourceIds = allLikedResourceSet.resources
            let allLikedResourceInfo = await Resource.find({_id: {$in: allLikedResourceIds}})
            res.locals.allLikedResourceInfo = allLikedResourceInfo
        }
        next()
    } catch (e) {
        next(e)
    }
}

exports.removeFromCollection = async (req, res, next) => {
    try {
        let collectionId = req.params.collectionId
        let resourceId = req.params.resourceId
        let resourceSet = await ResourceSet.findOne({_id: collectionId})
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

exports.addToCollection = async (req, res, next) => {
    try {
        let collectionId = req.params.collectionId
        let resourceId = req.params.resourceId
        let resourceSet = await ResourceSet.findOne({_id: collectionId})
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

exports.createCollection = async (req, res, next) => {
    try {
        let newResourceSet = new ResourceSet({
            ownerId: req.user._id,
            name: req.body.collectionName,
            createdAt: new Date()
        })
        await newResourceSet.save()
        res.redirect('/showCollection/' + newResourceSet._id)
    } catch (e) {
        next(e)
    }
}

exports.deleteCollection = async (req, res, next) => {
    try {
        let collectionId = req.params.collectionId
        await ResourceSet.deleteOne({_id: collectionId})
        res.redirect('/showStarredResources')
    } catch (e) {
        next(e)
    }
}

exports.showPublic = async (req, res, next) => {
    let allResource = null
    try {
        let resourceInfo = await Resource.find({
            status: {$in: ["finalPublic", "public"]},
            checkStatus: 'approve'
        })
        allResource = await Resource.find({
            checkStatus: 'approve'
        })
        res.render('./pages/publicPrimarySearch', {
            resourceInfo: resourceInfo,
            allResource: allResource
        })
    } catch (e) {
        next(e)
    }
}

exports.searchByFilledPublic = async (req, res, next) => {
    let resourceInfo = null

    try {
        if (req.body.institution === "" && req.body.state === "empty" && req.body.yearOfCreation === "") {
            // search for all resources
            resourceInfo = await Resource.find({
                checkStatus: 'approve',
                $or: [
                    {
                        description: {'$regex': '.*' + req.body.search + '.*', '$options': 'i'},
                        status: {$in: ["finalPublic", "public"]}
                    },
                    {
                        name: {'$regex': '.*' + req.body.search + '.*', '$options': 'i'},
                        status: {$in: ["finalPublic", "public"]}
                    }
                ]
            })
        }
            // situation 1: 1 field is filled

        // require yearOfCreation
        else if (req.body.institution === "" && req.body.state === "empty") {
            // search for all resources
            resourceInfo = await Resource.find({
                checkStatus: 'approve',
                yearOfCreation: req.body.yearOfCreation,
                $or: [
                    {
                        description: {'$regex': '.*' + req.body.search + '.*', '$options': 'i'},
                        status: {$in: ["finalPublic", "public"]}
                    },
                    {
                        name: {'$regex': '.*' + req.body.search + '.*', '$options': 'i'},
                        status: {$in: ["finalPublic", "public"]}
                    }
                ]
            })
        }
        // require institution
        else if (req.body.state === "empty" && req.body.yearOfCreation === "") {
            // search for all resources
            resourceInfo = await Resource.find({
                checkStatus: 'approve',
                institution: req.body.institution,
                $or: [
                    {
                        description: {'$regex': '.*' + req.body.search + '.*', '$options': 'i'},
                        status: {$in: ["finalPublic", "public"]}
                    },
                    {
                        name: {'$regex': '.*' + req.body.search + '.*', '$options': 'i'},
                        status: {$in: ["finalPublic", "public"]}
                    }
                ]
            })
        }
        // require state
        else if (req.body.institution === "" && req.body.yearOfCreation === "") {
            // search for all resources
            resourceInfo = await Resource.find({
                checkStatus: 'approve',
                state: req.body.state,
                $or: [
                    {
                        description: {'$regex': '.*' + req.body.search + '.*', '$options': 'i'},
                        status: {$in: ["finalPublic", "public"]}
                    },
                    {
                        name: {'$regex': '.*' + req.body.search + '.*', '$options': 'i'},
                        status: {$in: ["finalPublic", "public"]}
                    }
                ]
            })
        }

        //require state and institution
        else if (req.body.yearOfCreation === "") {
            // search for all resources
            resourceInfo = await Resource.find({
                checkStatus: 'approve',
                state: req.body.state,
                institution: req.body.institution,
                $or: [
                    {
                        description: {'$regex': '.*' + req.body.search + '.*', '$options': 'i'},
                        status: {$in: ["finalPublic", "public"]}
                    },
                    {
                        name: {'$regex': '.*' + req.body.search + '.*', '$options': 'i'},
                        status: {$in: ["finalPublic", "public"]}
                    }
                ]
            })
        }
        //require state and yearOfCreation
        else if (req.body.institution === "") {
            // search for all resources
            resourceInfo = await Resource.find({
                checkStatus: 'approve',
                state: req.body.state,
                yearOfCreation: req.body.yearOfCreation,
                $or: [
                    {
                        description: {'$regex': '.*' + req.body.search + '.*', '$options': 'i'},
                        status: {$in: ["finalPublic", "public"]}
                    },
                    {
                        name: {'$regex': '.*' + req.body.search + '.*', '$options': 'i'},
                        status: {$in: ["finalPublic", "public"]}
                    }
                ]
            })
        }
        //require  institution and yearOfCreation
        else if (req.body.state === "empty") {
            // search for all resources
            resourceInfo = await Resource.find({
                checkStatus: 'approve',
                institution: req.body.institution,
                yearOfCreation: req.body.yearOfCreation,
                $or: [
                    {
                        description: {'$regex': '.*' + req.body.search + '.*', '$options': 'i'},
                        status: {$in: ["finalPublic", "public"]}
                    },
                    {
                        name: {'$regex': '.*' + req.body.search + '.*', '$options': 'i'},
                        status: {$in: ["finalPublic", "public"]}
                    }
                ]
            })
        }


        // situation 4: all fields nonempty

        else {
            // search for all resources
            resourceInfo = await Resource.find({
                checkStatus: 'approve',
                status: req.body.status,
                state: req.body.state,
                yearOfCreation: req.body.yearOfCreation,
                institution: req.body.institution,
                $or: [
                    {
                        description: {'$regex': '.*' + req.body.search + '.*', '$options': 'i'},
                        status: {$in: ["finalPublic", "public"]}
                    },
                    {
                        name: {'$regex': '.*' + req.body.search + '.*', '$options': 'i'},
                        status: {$in: ["finalPublic", "public"]}
                    }
                ]
            })
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

        res.render('./pages/showPublicResources')

    } catch (e) {
        next(e)
    }
}