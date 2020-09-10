const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const passport = require('passport');
const flash = require('connect-flash');
const session = require("express-session");
const bodyParser = require("body-parser");


const Course = require('../models/Course');
const User = require('../models/User');
const Faculty = require('../models/Faculty')
const Event = require('../models/Event')


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
                let courseInfoSet = await Course.find({ownerId: req.user._id})
                res.locals.courseInfoSet = courseInfoSet
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

router.get('/login',
    (req, res) =>
        res.render('./pages/login')
)

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

module.exports = router;