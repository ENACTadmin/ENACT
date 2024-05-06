const express = require('express');
const router = express.Router();
const passport = require('passport');
const flash = require('connect-flash');
const bodyParser = require("body-parser");
const session = require('session')
const { sendMail } = require('../controllers/mailer'); 


const Course = require('../models/Course');
const User = require('../models/User');
const Faculty = require('../models/Faculty');
const CourseMember = require('../models/CourseMember');
const Verification = require('../models/Verification');
const TA = require('../models/TA');

const configPassport = require('../config/passport');
configPassport(passport);

// Register passport middleware
router.use(flash());
router.use(passport.initialize(1));
router.use(passport.session(1));
router.use(bodyParser.urlencoded({extended: false}));

//*******************************************
//***********Login authorization*************

// here is where we check and assign user's status
// this runs every time when a req is received
let loggedIn = false;
router.use(async (req, res, next) => {
    res.locals.loggedIn = false;
    res.locals.status = "student"
    if (req.isAuthenticated()) {
        let email = req.user.googleemail || req.user.workEmail
        res.locals.user = req.user;
        res.locals.loggedIn = true;
        loggedIn = true;
        // set appropriate status
        let userInfo = await User.findOne({_id: req.user._id})
        if (adminList.includes(email)) {
            res.locals.status = 'admin'
            let enrolledCourses = req.user.enrolledCourses
            if (userInfo.status !== 'admin') {
                userInfo.status = 'admin'
                await userInfo.save()
            }
            res.locals.courseInfoSet = await Course.find({$or: [{_id: {$in: enrolledCourses}}, {ownerId: req.user._id}]})
        } else {
            let faculty = await Faculty.findOne({email: email})
            let ta = await TA.findOne({email: email})
            if (faculty) {
                res.locals.status = faculty.status
                if (userInfo.status !== 'faculty') {
                    userInfo.status = 'faculty'
                    await userInfo.save()
                }
                res.locals.courseInfoSet = await Course.find({ownerId: req.user._id})
            } else if (ta) {
                res.locals.status = 'TA'
                let enrolledCourses = req.user.enrolledCourses
                if (userInfo.status !== 'TA') {
                    userInfo.status = 'TA'
                    await userInfo.save()
                }
                res.locals.courseInfoSet = await Course.find({_id: {$in: enrolledCourses}})
            } else {
                let enrolledCourses = req.user.enrolledCourses
                if (userInfo.status !== 'student') {
                    userInfo.status = 'student'
                    await userInfo.save()
                }
                res.locals.courseInfoSet = await Course.find({_id: {$in: enrolledCourses}})
            }
        }
    }
    next()
});

// route for logging out
router.get('/logout', function (req, res) {
    req.session.destroy((error) => {
        console.log("Error in destroying session: " + error)
        // Handle errors if necessary
    });
    loggedIn = false
    console.log("session has been destroyed");

    // Call req.logout with a callback function
    req.logout((err) => {
        if (err) {
            console.log("Error in logout: " + err);
            // Handle errors if necessary
        }
        // Redirect after logout
        res.redirect('/');
    });
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
        res.render('./pages/login/login', {
            secret: 'general'
        })
)

router.post('/login',
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login-fail'
    })
);

// ask for authentication
router.get('/auth/google/messages', passport.authenticate('google-secret',
    {scope: ['profile', 'email']}));

// google returns authorized back to the URL below
router.get('/login/authorized/messages',
    passport.authenticate('google-secret', {
        successRedirect: '/messages/view/redirect',
        failureRedirect: '/error'
    })
);

router.post('/login/messages/view/:sender/:receiver/:resourceId',

    passport.authenticate('local-secret', {
        successRedirect: '/messages/view/redirect',
        failureRedirect: '/login-fail'
    })
);

router.get('/messages/view/redirect',
    (req, res, next) => {
        res.redirect('/messages/view/' + req.session['redirectPath'])
    }
);


router.get('/login-fail',
    (req, res) =>
        res.render('./pages/login/login-fail')
)


// will be moved to cloud later
const adminList = ["tjhickey@brandeis.edu", "bbdhy96@gmail.com", "enact@brandeis.edu", "stimell@brandeis.edu", "djw@brandeis.edu", "epevide@brandeis.edu",  "charlottepowley88@gmail.com", "madina@brandeis.edu", "aiberkleid@brandeis.edu"]

router.get('/signup',
    (req, res) =>
        res.render('./pages/login/signup')
)

router.post('/signup',
    passport.authenticate('local-signup', {
        successRedirect: '/verification', // redirect to the secure profile section
        failureRedirect: '/login-fail' // redirect back to the fail page if there is an error
    })
)

router.get('/reset',
    (req, res) =>
        res.render('./pages/login/login-reset')
)

// router.post('/reset',
//     async (req, res) => {
//         let user = await User.findOne({
//             $or: [
//                 {workEmail: req.body.email}, {googleemail: req.body.email}
//             ]
//         })
//         if (user) {
//             send_email(req.body.email, user._id)
//             res.send("<h1>Reset email sent, please check your email :) </h1><br><h1>Back to Login: <a href='/login'>Login</a></h1>")
//         } else {
//             res.send("<h1>Sry, your email is not registered in our system </h1><br><h1>Sign up if your are an ENACT member: <a href='/signup'>Sign Up</a></h1>")

//         }
//     }
// )

// POST route for password reset
// router.post('/reset', async (req, res) => {
//     const user = await User.findOne({
//       $or: [
//         { workEmail: req.body.email }, { googleemail: req.body.email }
//       ],
//     });
  
//     if (user) {
//       try {
//         await sendMail(
//           req.body.email,
//           'ENACT Digital Platform: Password Reset',
//           `Password reset link: https://www.enactnetwork.org/reset/${user._id}`
//         );
  
//         res.send("<h1>Reset email sent, please check your email :) </h1><br><h1>Back to Login: <a href='/login'>Login</a></h1> </h1><br><p>If you do not recevie an email in the next 10 minutes try clicking the reset link again os sign in with Google</p>");
//       } catch (error) {
//         console.error('Error sending email:', error.message);
//         res.send("<h1>Error sending email. Please try again.</h1>");
//       }
//     } else {
//       res.send("<h1>Sorry, your email is not registered in our system </h1><br><h1>Sign up if you're an ENACT member: <a href='/signup'>Sign Up</a></h1>");
//     }
//   });

router.post('/reset', async (req, res) => {
    const user = await User.findOne({
        $or: [
            { workEmail: req.body.email }, { googleemail: req.body.email }
        ],
    });

    if (user) {
        try {
            await sendMail(
                req.body.email,
                'ENACT Digital Platform: Password Reset',
                `Password reset link: https://www.enactnetwork.org/reset/${user._id}`
            );

            // Render the success page with a nice UI
            res.render('pages/login/login-reset-response', {
                statusClass: 'success',
                message: `${req.body.email}`,
                linkHref: '/login',
                linkText: 'Back to Login'
            });
        } catch (error) {
            console.error('Error sending email:', error.message);
            res.render('pages/login/login-reset-response', {
                statusClass: 'danger',
                message: 'Error sending email. Please try again.',
                linkHref: '/reset',
                linkText: 'Try Again'
            });
        }
    } else {
        // Render a page for unregistered email
        res.render('pages/login/login-reset-response', {
            statusClass: 'warning',
            message: 'Your email is not registered in our system.',
            linkHref: '/signup',
            linkText: 'Sign Up'
        });
    }
});


router.get('/reset/:id',
    async (req, res) => {
        let user = await User.findOne({_id: req.params.id})
        res.render('./pages/login/login-resetPwd', {
            userIdParam: req.params.id,
            emailFromServer: user.googleemail || user.workEmail
        })
    }
)

router.post('/reset/:id',
    async (req, res, next) => {
        console.log("in resetting password")
        let user = await User.findOne({_id: req.params.id})
        user.password = req.body.password
        await user.save()
        console.log('user saved')
        next()
    }, passport.authenticate('local-reset', {
        successRedirect: '/',
        failureRedirect: '/login'
    })
)

function send_email(workEmail, userId) {
    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
        to: workEmail,
        from: 'enact@brandeis.edu',
        subject: 'ENACT Digital Platform: Password Reset',
        text: 'Password Reset',
        html: 'Password reset Link: https://www.enactnetwork.org/reset/' + userId
    };
    try {
        sgMail.send(msg);
    } catch (e) {
        console.log("SENDGRID EXCEPTION: ", e)
    }
}


router.get('/verification',
    async (req, res) => {
        let temp = await Faculty.findOne({email: {$in: [req.user.googleemail, req.user.workEmail]}})
        // if the user is an admin or faculty, skip verification step
        if (adminList.includes(req.user.googleemail) || adminList.includes(req.user.workEmail) || temp) {
            res.redirect("/profile/update")
        } else {
            res.render('./pages/login/verification')
        }
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

            let newVerifiedMember = new Verification({
                email: req.user.googleemail || req.user.workEmail
            })

            await newVerifiedMember.save()
            console.log("verified member saved")

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
            // console.log(JSON.stringify(e) + "!=" + JSON.stringify(elt));
        }
    });
    return found
}

module.exports = router;
