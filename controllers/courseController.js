'use strict';
const Course = require('../models/Course');
const User = require('../models/User');
const CourseMember = require('../models/CourseMember');


/**
 * create a new course
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
let coursePin;
exports.createNewClass = async (req, res, next) => {
    //console.dir(req.body)
    if (!req.user.googleemail.endsWith("edu") && res.locals.status !== 'faculty') {
        res.send("You must log in with an authorized faculty account to create a class. <a href='/logout'>Logout</a>")
        return
    } else if (!(req.body.norobot === 'on' && req.body.robot == undefined)) {
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
                semester: req.body.semester,
                // city: req.body.city,
                state: req.body.state,
                createdAt: new Date(),
                institution: req.body.institution,
                officeHour: req.body.officeHour,
                officeHourLocation: req.body.officeHourLocation
            }
        )
        // await until the newCourse is saved properly
        await newCourse.save()
        next()
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
        res.redirect('/showOneCourse/' + courseInfo._id)
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
    let coursePin = Math.floor(Math.random() * 10000000)
    let lookupPin = await Course.find({coursePin: coursePin}, 'coursePin')

    while (lookupPin.length > 0) {
        coursePin = Math.floor(Math.random() * 10000000)
        lookupPin = await Course.find({coursePin: coursePin}, 'coursePin')
    }
    return coursePin
}

exports.showOneCourse = async (req, res, next) => {
    let courseId = req.params.courseId;
    try {
        //courseInfo contains these fields
        let courseSet = res.locals.courseInfoSet
        for (let i = 0; i < courseSet.length; i++) {
            if (courseSet[i]._id.toString() === courseId.toString()) {
                res.locals.courseInfo = courseSet[i];
                break
            }
        }
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
            console.log("enrolled already!")
            return
        }
        // update user's enrolledCourses field
        await req.user.enrolledCourses.push(courseInfo._id)
        await req.user.save()
        console.log("update finish")
        res.redirect("/showOneCourse/" + courseInfo._id)

    } catch (e) {
        next(e)
    }
}

function containsString(list, elt) {
    let found = false;
    list.forEach(e => {
        if (JSON.stringify(e) === JSON.stringify(elt)) {
            found = true
        } else {
            console.log(JSON.stringify(e) + "!=" + JSON.stringify(elt));
        }
    });
    return found
}