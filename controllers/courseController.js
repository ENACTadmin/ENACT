'use strict';
const Course = require('../models/Course');
const Resource = require('../models/Resource');
const User = require('../models/User');
const CourseMember = require('../models/CourseMember');
const CourseTime = require('../models/CourseTime');


/**
 * create a new course
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
let coursePin;
exports.createNewClass = async (req, res, next) => {
    if (res.locals.status === 'student') {
        res.send("You must log in with an authorized faculty account to create a class. <a href='/logout'>Logout</a>")
        return
    } else if (!(req.body.norobot === 'on' && req.body.robot === undefined)) {
        res.send("no robots allowed!")
        return
    }
    try {
        coursePin = await getCoursePin()
        let newCourse = new Course(
            {
                courseName: req.body.courseName,
                ownerId: req.user._id,
                instructor: req.user.userName,
                coursePin: coursePin,
                year: req.body.year,
                semester: req.body.semester,
                timezone: req.body.timezone,
                state: req.body.state,
                createdAt: new Date(),
                institution: req.body.institution,
                institutionURL: req.body.institutionURL
            }
        )
        // await until the newCourse is saved properly
        await newCourse.save()
        // add additional authors
        let startTime = req.body.startTime
        let endTime = req.body.endTime
        let day = req.body.day
        if (startTime) {
            if (typeof startTime === 'string') {
                let courseTime = new CourseTime({
                    courseId: newCourse._id,
                    day: day,
                    startTime: startTime,
                    endTime: endTime,
                })
                await courseTime.save()
            } else {
                for (let i = 0; i < startTime.length; i++) {
                    let courseTime = new CourseTime({
                        courseId: newCourse._id,
                        day: day[i],
                        startTime: startTime[i],
                        endTime: endTime[i],
                    })
                    await courseTime.save()
                }
            }
        }
        next()
    } catch (e) {
        next(e)
    }
}

exports.copyCourse = async (req, res, next) => {
    try {
        let oldCourse = await Course.findOne({_id: req.params.courseId})
        coursePin = await getCoursePin()
        let newCourse = new Course(
            {
                courseName: req.body.courseName,
                ownerId: req.user._id,
                instructor: req.user.userName,
                coursePin: coursePin,
                semester: req.body.semester,
                // city: req.body.city,
                state: oldCourse.state,
                createdAt: new Date(),
                institution: oldCourse.institution,
                institutionURL: oldCourse.institutionURL,
                officeHour: req.body.officeHour,
                officeHourLocation: req.body.officeHourLocation
            }
        )
        // await until the courseToEdit is saved properly
        await newCourse.save()

        // migrate existing instructor uploaded resources
        if (req.body.resourcesToCopy === 'self') {
            let oldResources = await Resource.find({courseId: req.params.courseId, ownerId: req.user._id})
            if (oldResources.length > 0) {
                for (let i = 0; i < oldResources.length; i++) {
                    let oldResource = oldResources[i]
                    console.log(oldResource.status)
                    let newResource = new Resource({
                        ownerId: req.user._id,
                        courseId: newCourse._id,
                        status: oldResource.status, // public/private to class/private to professors
                        createdAt: new Date(),
                        name: oldResource.name,
                        description: oldResource.description,
                        tags: oldResource.tags, // tags as array
                        uri: oldResource.uri, // universal resource identifier specific to the resource
                        state: oldResource.state,
                        contentType: oldResource.contentType,
                        mediaType: oldResource.mediaType,
                        institution: oldResource.institution,
                        yearOfCreation: oldResource.yearOfCreation,// content's actual creation time
                        checkStatus: 'approve'
                    })
                    await newResource.save()
                }
            }
        }
        res.redirect('/courses')
    } catch (e) {
        next(e)
    }
}

exports.updateCourse = async (req, res, next) => {
    try {
        let courseToEdit = await Course.findOne({_id: req.params.courseId})
        courseToEdit.courseName = req.body.courseName
        courseToEdit.semester = req.body.semester
        courseToEdit.institution = req.body.institution
        courseToEdit.institutionURL = req.body.institutionURL
        courseToEdit.year = req.body.year
        courseToEdit.timezone = req.body.timezone
        courseToEdit.state = req.body.state
        let tempId = req.body.ownerId
        let tempUser = await User.findOne({_id: tempId})
        courseToEdit.instructor = tempUser.userName
        courseToEdit.ownerId = tempUser._id

        await CourseTime.deleteMany({courseId: req.params.courseId})
        let startTime = req.body.startTime
        let endTime = req.body.endTime
        let day = req.body.day
        if (startTime) {
            if (typeof startTime === 'string') {
                let courseTime = new CourseTime({
                    courseId: courseToEdit._id,
                    day: day,
                    startTime: startTime,
                    endTime: endTime,
                })
                await courseTime.save()
            } else {
                for (let i = 0; i < startTime.length; i++) {
                    let courseTime = new CourseTime({
                        courseId: courseToEdit._id,
                        day: day[i],
                        startTime: startTime[i],
                        endTime: endTime[i],
                    })
                    await courseTime.save()
                }
            }
        }

        // await until the courseToEdit is saved properly
        await courseToEdit.save()
        res.redirect('/courses')
    } catch (e) {
        next(e)
    }
}

/**
 * add created course to the list of owned courses
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
exports.addToOwnedCourses = async (req, res, next) => {
    try {
        console.log("in add to owned")
        let courseInfo = await Course.findOne({
            coursePin: coursePin
        })
        await req.user.ownedCourses.push(courseInfo._id)
        await req.user.save()
        res.redirect('/course/view/' + courseInfo._id)
    } catch (e) {
        next(e)
    }
}

/**
 * get course pin, a 7-digit randomly generated number
 * @returns {Promise<number>}
 */
async function getCoursePin() {
    // this only works if there are many fewer than 10000000 courses
    // but that won't be an issue with this alpha version!
    let coursePin = padDigits(Math.floor(Math.random() * 10000000), 7)
    let lookupPin = await Course.find({coursePin: coursePin}, 'coursePin')

    while (lookupPin && lookupPin.length > 0) {
        coursePin = padDigits(Math.floor(Math.random() * 10000000), 7)
        lookupPin = await Course.find({coursePin: coursePin}, 'coursePin')
    }
    return coursePin
}

function padDigits(number, digits) {
    return Array(Math.max(digits - String(number).length + 1, 0)).join(0) + number;
}

exports.showOneCourse = async (req, res, next) => {
    let courseId = req.params.courseId;
    try {
        res.locals.courseInfo = await Course.findOne({_id: courseId})
        await next()
    } catch (e) {
        next(e)
    }
}

exports.joinCourse = async (req, res, next) => {
    try {
        let coursePin = req.body.coursePin

        let courseInfo = await Course.findOne({coursePin: coursePin})

        let newCourseMember = new CourseMember({
            studentId: req.user._id,
            courseId: courseInfo._id,
            createdAt: new Date()
        })

        await newCourseMember.save()
        console.log("courseMember saved")

        let enrolledCourses = req.user.enrolledCourses || []

        if (containsString(enrolledCourses, courseInfo._id)) {
            console.log("Enrolled already!")
            res.send("Enrolled already")
            return
        }
        // update user's enrolledCourses field
        await req.user.enrolledCourses.push(courseInfo._id)
        await req.user.save()
        console.log("update finish")
        res.redirect("/course/view/" + courseInfo._id)

    } catch (e) {
        next(e)
    }
}

function containsString(list, elt) {
    let found = false;
    list.forEach(e => {
        if (JSON.stringify(e) === JSON.stringify(elt)) {
            found = true
        }
    });
    return found
}

exports.showSchedule = async (req, res) => {
    let courseTimes = await CourseTime.find({}, {'_id': 0, '__v': 0});
    let courses = await Course.find({year: 2021}, {
        'ownerId': 1,
        'institutionURL': 1,
        '_id': 1,
        'state': 1,
        'courseName': 1,
        'timezone': 1,
        'instructor': 1,
        'institution': 1
    })
    res.render('./pages/courses-schedule', {
        courseTimes: courseTimes,
        courses: courses
    })
}