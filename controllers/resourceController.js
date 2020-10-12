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
        await setWord2Id(newResource);
        if (courseId === undefined)
            res.redirect('/resources/view/faculty')
        else
            res.redirect('/course/view/' + courseId)
    } catch (e) {
        console.log("I am in trouble!!!")
        next(e)
    }
}

async function setWord2Id(newResource) {
    let fullContent = newResource.name + ',' + newResource.description + ',' + newResource.tags + ','
        + newResource.state + ',' + newResource.contentType + ',' + newResource.mediaType + ','
        + newResource.institution + ',' + newResource.yearOfCreation

    let regex = /[^\s\.,!?()]+/g;
    let match = fullContent.match(regex);
    console.log('match: ', match)
    for (let i = 0; i < match.length; i++) {
        let newRegex = new RegExp(["^", match[i], "$"].join(""), "i");
        let word2Id = await Word2Id.findOne({word: newRegex})
        // if not null
        if (match[i].toString() !== 'null') {
            if (word2Id === null) {
                let newWord2Id = new Word2Id({
                    word: match[i],
                    ids: [newResource._id]
                })
                await newWord2Id.save()
            } else {
                if (!word2Id.ids.includes(newResource._id)) {
                    word2Id.ids = await [newResource._id].concat(word2Id.ids)
                    await word2Id.save()
                }
            }
        }
    }
}

async function removeWord2Id(oldResource) {
    let fullContent = oldResource.name + ',' + oldResource.description + ',' + oldResource.tags + ','
        + oldResource.state + ',' + oldResource.contentType + ',' + oldResource.mediaType + ','
        + oldResource.institution + ',' + oldResource.yearOfCreation

    let regex = /[^\s\.,!?]+/g;
    let match = fullContent.match(regex);
    console.log('match here: ', match)
    for (let i = 0; i < match.length; i++) {
        let newRegex = new RegExp(["^", match[i], "$"].join(""), "i");
        let word2Id = await Word2Id.findOne({word: newRegex})
        // if not null
        if (match[i].toString() !== 'null') {
            if (word2Id === null) {
                console.log("Impossible!!!")
            } else {
                console.log('before: ', word2Id.ids)
                console.log('id to remove: ', oldResource._id)
                await word2Id.ids.remove(oldResource._id)
                console.log('after: ', word2Id.ids)
                await word2Id.save()
            }
        }
    }
}

exports.resetWord2Id = async (req, res, next) => {
    try {
        let resources = await Resource.find();
        for (let i = 0; i < resources.length; i++) {
            await setWord2Id(resources[i]);
        }
        console.log('Finished!')
        res.redirect('/')
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
        await removeWord2Id(oldResource)
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
        // update word2Id
        await setWord2Id(oldResource);
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
        let starred = await ResourceSet.findOne({ownerId: req.user._id, name: 'favorite'})
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


exports.loadAllFacultyResources = async (req, res, next) => {
    try {
        if (req.user.status !== 'admin' && req.user.status !== 'faculty')
            res.send("You are not allowed here!")
        else {
            let syllabus = await Resource.find({
                status: 'privateToProfessor',
                'contentType': 'Syllabus'
            }).sort({createdAt: -1}).limit(3)
            let assignments = await Resource.find({
                status: 'privateToProfessor',
                'contentType': 'Assignment Guidelines'
            }).sort({createdAt: -1}).limit(3)
            let rubrics = await Resource.find({
                status: 'privateToProfessor',
                'contentType': 'Rubrics'
            }).sort({createdAt: -1}).limit(3)
            let guides = await Resource.find({
                status: 'privateToProfessor',
                'contentType': 'Course Planning'
            }).sort({createdAt: -1}).limit(3)

            let starred = await ResourceSet.findOne({ownerId: req.user._id, name: 'favorite'})
            let resourceIds = null
            console.log("starred ", starred)
            if (starred) {
                resourceIds = await starred.resources
            }
            console.log("resourceIds: ", resourceIds)
            res.locals.resourceIds = resourceIds
            res.locals.syllabus = syllabus
            res.locals.assignments = assignments
            res.locals.rubrics = rubrics
            res.locals.guides = guides
            next()
        }
    } catch (e) {
        next(e)
    }
}

exports.loadSpecificContentType = async (req, res, next) => {
    try {
        let contentType = ''
        if (req.params.contentType === 'syllabus')
            contentType = 'Syllabus'
        else if (req.params.contentType === 'assignments')
            contentType = 'Assignment Guidelines'
        else if (req.params.contentType === 'rubrics')
            contentType = 'Rubrics'
        else if (req.params.contentType === 'plan')
            contentType = 'Course Planning'

        let resourceInfo = await Resource.find({status: 'privateToProfessor', contentType: contentType})
        console.log("here: ", resourceInfo)
        let starred = await ResourceSet.findOne({ownerId: req.user._id, name: 'favorite'})
        let resourceIds = null
        console.log("starred ", starred)
        if (starred) {
            resourceIds = await starred.resources
        }

        console.log("resourceIds: ", resourceIds)
        res.locals.resourceIds = resourceIds
        res.locals.resourceInfo = resourceInfo

        res.render('./pages/showResources', {
            secretType: contentType
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
        let resource = await Resource.findOne({_id: resourceId})
        await removeWord2Id(resource)
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
        let resourceSet = await ResourceSet.findOne({ownerId: req.user._id, name: 'favorite'})
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

exports.starResourceAlt = async (req, res, next) => {
    try {
        let resourceId = await req.params.resourceId
        let resourceSet = await ResourceSet.findOne({ownerId: req.user._id, name: 'favorite'})
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
        res.redirect('back')
    } catch (e) {
        next(e)
    }
}

exports.unstarResourceAlt = async (req, res, next) => {
    try {
        let resourceId = req.params.resourceId
        let resourceSet = await ResourceSet.findOne({ownerId: req.user._id, name: 'favorite'})
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
        res.redirect('back')
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
        if (req.user.status === 'student') {
            res.render('./pages/myResourcesStudent', {
                resourceInfo: resourceInfo
            })
        } else {
            res.render('./pages/myResourcesFaculty', {
                resourceInfo: resourceInfo
            })
        }
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
            res.locals.allLikedResourceInfo = await Resource.find({_id: {$in: allLikedResourceIds}})
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
        res.redirect('/collection/view/' + newResourceSet._id)
    } catch (e) {
        next(e)
    }
}

exports.deleteCollection = async (req, res, next) => {
    try {
        let collectionId = req.params.collectionId
        await ResourceSet.deleteOne({_id: collectionId})
        res.redirect('/resources/view/favorite')
    } catch (e) {
        next(e)
    }
}

exports.showPublic = async (req, res, next) => {
    try {
        let resourceInfo = await Resource.find({
            status: {$in: ["finalPublic", "public"]},
            checkStatus: 'approve'
        })
        res.render('./pages/publicPrimarySearch', {
            resourceInfo: resourceInfo,
        })
    } catch (e) {
        next(e)
    }
}


// -----------------------------------------------
//
// --------------- General Search ----------------
//
// -----------------------------------------------

exports.primarySearch = async (req, res, next) => {
    try {
        let resourceInfo = await invertedSearch(req, res);
        console.log("resources: ", resourceInfo)
        let starred = await ResourceSet.findOne({ownerId: req.user._id, name: 'favorite'})

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
        res.render('./pages/showResources', {
            secretType: 'Search Result'
        })
    } catch
        (e) {
        next(e)
    }
}

exports.primaryPublicSearch = async (req, res, next) => {
    let resourceInfo = null
    const checkStatus = 'approve'
    try {
        let regex = /[^\s\.,!?]+/g;
        let match = req.body.search.match(regex)
        if (match) {
            for (let i = 0; i < match.length; i++) {
                let newRegex = new RegExp(["^", match[i], "$"].join(""), "i");
                let word2Id = await Word2Id.findOne({word: newRegex})
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
        } else {
            resourceInfo = await Resource.find({
                checkStatus: checkStatus,
                status: {$in: ["finalPublic", "public"]}
            })
        }
        res.render('./pages/publicPrimarySearch', {
            resourceInfo: resourceInfo
        })
    } catch (e) {
        next(e)
    }
}

async function invertedSearch(req, res) {
    const checkStatus = 'approve'
    let resourceInfo = null
    let regex = /[^\s\.,!?]+/g;
    let match = req.body.search.match(regex)
    if (match) {
        // admin search
        if (res.locals.status === 'admin' || res.locals.status === 'faculty') {
            for (let i = 0; i < match.length; i++) {
                let newRegex = new RegExp(["^", match[i], "$"].join(""), "i");
                let word2Id = await Word2Id.findOne({word: newRegex})
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
        }
        // student search
        else {
            for (let i = 0; i < match.length; i++) {
                let newRegex = new RegExp(["^", match[i], "$"].join(""), "i");
                let word2Id = await Word2Id.findOne({word: newRegex})
                if (word2Id !== null) {
                    let resourceIds = word2Id.ids
                    if (resourceInfo === null) {
                        resourceInfo = await Resource.find({
                            checkStatus: checkStatus,
                            _id: {$in: resourceIds},
                            status: {$in: ["privateToENACT", "public", "finalPublic"]}
                        })
                    } else {
                        let newResourceInfo = await Resource.find({
                            checkStatus: checkStatus,
                            _id: {$in: resourceIds},
                            status: {$in: ["privateToENACT", "public", "finalPublic"]}
                        })
                        resourceInfo = resourceInfo.concat(newResourceInfo)
                    }
                }
            }
        }
    }
    // empty param search
    else {
        if (res.locals.status === 'admin' || res.locals.status === 'faculty') {
            resourceInfo = await Resource.find({
                checkStatus: checkStatus
            })
        } else {
            resourceInfo = await Resource.find({
                checkStatus: checkStatus,
                status: {$in: ["privateToENACT", "public", "finalPublic"]}
            })
        }
    }
    return resourceInfo
}


// -----------------------------------------------
//
// --------------- Advanced Search ---------------
//    
// -----------------------------------------------

exports.advancedSearch = async (req, res) => {

    let resourceInfo = await invertedSearch(req, res);

    let filtered = resourceInfo;

    let local_state = req.body.state !== 'empty' ? req.body.state : null

    console.log('state: ', local_state)

    if (filtered && local_state) {
        filtered = filtered.filter(({state}) => state.toUpperCase() === local_state.toUpperCase());
    }

    let local_institution = req.body.institution

    if (filtered && local_institution !== '') {
        filtered = filtered.filter(({institution}) => institution.toUpperCase() === local_institution.toUpperCase());
    }

    let local_yearOfCreation = req.body.yearOfCreation

    if (filtered && local_yearOfCreation !== '') {
        filtered = filtered.filter(({yearOfCreation}) => yearOfCreation === parseInt(local_yearOfCreation));
    }

    let local_contentType = req.body.contentType !== 'empty' ? req.body.contentType : null

    if (filtered && local_contentType) {
        filtered = filtered.filter(({contentType}) => contentType.toUpperCase() === local_contentType.toUpperCase());
    }

    let local_mediaType = req.body.mediaType !== 'empty' ? req.body.mediaType : null

    if (filtered && local_mediaType) {
        filtered = filtered.filter(({mediaType}) => mediaType.toUpperCase() === local_mediaType.toUpperCase());
    }

    let local_status = req.body.status

    if (filtered && local_status !== '' && local_status !== 'all') {
        filtered = filtered.filter(({status}) => status.toUpperCase() === local_status.toUpperCase());
    }

    let filteredResource = []
    if (filtered && req.body.tags.length > 0) {
        console.log("tag used")
        for (let m = 0; m < filtered.length; m++) {
            let tagged = await req.body.tags.split(',')
            let result = tagged.every(val => filtered[m].tags.includes(val));
            if (result) {
                filteredResource.push(filtered[m])
            }
        }
    } else {
        console.log("tag not used")
        filteredResource = filtered
    }

    let starred = await ResourceSet.findOne({ownerId: req.user._id, name: 'favorite'})

    let starredResourceIds = null
    if (starred) {
        starredResourceIds = await starred.resources
    }

    res.locals.resourceIds = starredResourceIds

    resourceInfoSet = filteredResource
    res.render('./pages/showResources', {
        resourceInfo: filteredResource,
        resourceIds: starredResourceIds,
        secretType: 'Search Result'
    })
}

exports.advancedSearchPublic = async (req, res, next) => {
    let resourceInfo = await invertedSearch(req, res);

    let filtered = resourceInfo;

    let local_state = req.body.state !== 'empty' ? req.body.state : null

    if (filtered && local_state) {
        filtered = filtered.filter(({state}) => state.toUpperCase() === local_state.toUpperCase());
    }

    let local_institution = req.body.institution

    if (filtered && local_institution !== '') {
        filtered = filtered.filter(({institution}) => institution.toUpperCase() === local_institution.toUpperCase());
    }

    let local_yearOfCreation = req.body.yearOfCreation

    if (filtered && local_yearOfCreation !== '') {
        filtered = filtered.filter(({yearOfCreation}) => yearOfCreation === parseInt(local_yearOfCreation).toUpperCase());
    }

    let local_contentType = req.body.contentType !== 'empty' ? req.body.contentType : null

    if (filtered && local_contentType) {
        filtered = filtered.filter(({contentType}) => contentType.toUpperCase() === local_contentType.toUpperCase());
    }

    let local_mediaType = req.body.mediaType !== 'empty' ? req.body.mediaType : null

    if (filtered && local_mediaType) {
        filtered = filtered.filter(({mediaType}) => mediaType.toUpperCase() === local_mediaType.toUpperCase());
    }

    if (filtered) {
        filtered = filtered.filter(({status}) => ['public', 'finalPublic'].includes(status));
    }

    // -----------------------------------------------------------------
    // ---------------------------tag filter----------------------------
    // -----------------------------------------------------------------

    let filteredResource = []
    if (req.body.tags.length > 0) {
        console.log("tag used")
        for (let m = 0; m < filtered.length; m++) {
            let tagged = await req.body.tags.split(',')
            let result = tagged.every(val => filtered[m].tags.includes(val));
            if (result) {
                filteredResource.push(filtered[m])
            }
        }
    } else {
        console.log("tag not used")
        filteredResource = filtered
    }

    res.locals.resourceInfo = filteredResource
    res.render('./pages/showPublicResources')
}