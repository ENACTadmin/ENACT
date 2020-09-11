const express = require('express');
const router = express.Router();
const passport = require('passport');
const flash = require('connect-flash');
const bodyParser = require("body-parser");


const Course = require('../models/Course');
const User = require('../models/User');
const Faculty = require('../models/Faculty');
const CourseMember = require('../models/CourseMember');


const configPassport = require('../config/passport');
configPassport(passport);

// Register passport middleware
router.use(flash());
router.use(passport.initialize(1));
router.use(passport.session(1));
router.use(bodyParser.urlencoded({extended: false}));

//*******************************************
//***********Login authorization*************

// will be moved to cloud later
let adminList = ["bbdhy96@gmail.com", "nicolezhang@brandeis.edu", "stimell@brandeis.edu", "djw@brandeis.edu", "epevide@brandeis.edu"]

// here is where we check and assign user's status
// this runs every time when a req is received
let loggedIn = false;
router.use(async (req, res, next) => {
    // console.log("In router!")
    res.locals.loggedIn = false;
    res.locals.status = "student"
    if (req.isAuthenticated()) {
        let googleEmail = req.user.googleemail
        res.locals.user = req.user;
        res.locals.loggedIn = true;
        loggedIn = true;
        // set appropriate status
        let userInfo = await User.findOne({_id: req.user._id})
        if (adminList.includes(googleEmail)) {
            res.locals.status = 'admin'
            let courseInfoSet = await Course.find({ownerId: req.user._id})
            userInfo.status = 'admin'
            await userInfo.save()
            res.locals.courseInfoSet = courseInfoSet
        } else {
            let user = await Faculty.findOne({email: googleEmail})
            if (user) {
                res.locals.status = user.status
                userInfo.status = 'faculty'
                await userInfo.save()
                res.locals.courseInfoSet = await Course.find({ownerId: req.user._id})
            } else {
                let enrolledCourses = req.user.enrolledCourses
                let courseInfoSet = await Course.find({_id: {$in: enrolledCourses}})
                userInfo.status = 'student'
                await userInfo.save()
                res.locals.courseInfoSet = courseInfoSet
            }
        }
        console.log("user has been Authenticated. Status: " + res.locals.status)
    }
    next()
});

// route for logging out
router.get('/logout', function (req, res) {
    req.session.destroy((error) => {
        console.log("Error in destroying session: " + error)
    });
    loggedIn = false
    console.log("session has been destroyed");
    req.logout();
    res.redirect('/');
});

// ask for authentication
router.get('/auth/google', passport.authenticate('google',
    {scope: ['profile', 'email']}));

// google returns authorized back to the URL below
router.get('/login/authorized',
    passport.authenticate('google', {
        successRedirect: '/',
        failureRedirect: '/error'
    })
);

router.get('/login',
    (req, res) =>
        res.render('./pages/login')
)

router.post('/login',
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login'
    })
);

router.get('/signup',
    (req, res) =>
        res.render('./pages/signup')
)

router.post('/signup',
    passport.authenticate('local-signup', {
        successRedirect: '/verification', // redirect to the secure profile section
        failureRedirect: '/login' // redirect back to the signup page if there is an error
    })
)

router.get('/verification',
    (req, res) => {
        res.render('./pages/verification')
    }
)

router.post('/verification',
    async (req, res, next) => {
        try {
            let coursePin = req.body.coursePin
            let courseInfo = await Course.findOne({coursePin: coursePin})
            if (!courseInfo) {
                await User.deleteOne({_id: req.user._id})
                res.send("Pin code incorrect! <a href='/signup'>Click here to try again</a>")
            }
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

            res.redirect("/profile/update")
        } catch (e) {
            next(e)
        }
    })

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

module.exports = router;