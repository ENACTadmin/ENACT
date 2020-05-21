'use strict';
const Course = require('../models/Course');

/**
 * create a new course
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
exports.createNewClass = async (req, res, next) => {
    //console.dir(req.body)
    if (false && !req.user.googleemail.endsWith("edu") && res.locals.status !== 'faculty') {
        res.send("You must log in with an authorized faculty account to create a class. <a href='/logout'>Logout</a>")
        return
    } else if (!(req.body.norobot === 'on' && req.body.robot == undefined)) {
        res.send("no robots allowed!")
        return
    }
    try {
        let coursePin = await getCoursePin()
        //console.dir(req.user)
        let newCourse = new Course(
            {
                courseName: req.body.courseName,
                ownerId: req.user._id,
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

        newCourse.save()
            .then(() => {
                res.redirect('/showCourses');
            })
            .catch(error => {
                res.send(error);
            });
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

exports.showOwnedCourses = async (req, res, next) => {
    if (!req.user)
        next()
    let coursesOwned =
        await Course.find({ownerId: req.user._id}, 'courseName coursePin')
    res.locals.coursesOwned = coursesOwned
    // res.locals.coursesTAing = []
    //
    // let registrations =
    //     await  CourseMember.find({studentId:req.user._id},'courseId')
    // res.locals.registeredCourses = registrations.map((x)=>x.courseId)
    //
    // let coursesTaken =
    //     await Course.find({_id:{$in:res.locals.registeredCourses}},'name')
    // res.locals.coursesTaken = coursesTaken
    //
    // res.locals.title = "PRA"
    res.render('showCourses');
}
