'use strict';
const Course = require('../models/Course');

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
                officeHour: req.body.officeHour
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

