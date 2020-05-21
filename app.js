var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var flash = require('connect-flash');
session = require("express-session");
bodyParser = require("body-parser");


// Models!
const Course = require('./models/Course');
const Resource = require('./models/Resource');
const User = require('./models/User');

//*******************************************
//***********Controller**********************

const courseController = require('./controllers/courseController');

// Authentication
// const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
// here we set up authentication with passport
const passport = require('passport');
const configPassport = require('./config/passport');
configPassport(passport);

const MONGODB_URI = 'mongodb://localhost/ENACT';
const mongoose = require('mongoose');

// Makes connection asynchronously.  Mongoose will queue up database
// operations and release them when the connection is complete.
mongoose.connect(MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("mongo connected")
});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// register middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
// app.use('/users', usersRouter);

app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: false,
}));

// Register passport middleware
app.use(flash());
app.use(passport.initialize(1));
app.use(passport.session(1));
app.use(bodyParser.urlencoded({extended: false}));

var facultyList = []
var adminList = ["bbdhy96@gmail.com"]
// here is where we check on their logged in status
app.use((req, res, next) => {
    res.locals.title = "ENACT";
    res.locals.loggedIn = false;
    res.locals.status = "student"
    if (req.isAuthenticated()) {
        let googleEmail = req.user.googleemail
        if (googleEmail.endsWith("edu") || googleEmail.endsWith("@gmail.com")) {
            res.locals.user = req.user;
            res.locals.loggedIn = true;
            if (facultyList.includes(googleEmail))
                req.locals.status = "faculty"
            if (adminList.includes(googleEmail))
                res.locals.status = "admin"
            console.log("user has been Authenticated. Status: " + res.locals.status)
        } else {
            res.locals.loggedIn = false
        }
    }
    next()
});

app.get('/loginerror', function (req, res) {
    res.render('loginerror', {})
});

// route for logging out
app.get('/logout', function (req, res) {
    req.session.destroy((error) => {
        console.log("Error in destroying session: " + error)
    });
    console.log("session has been destroyed");
    req.logout();
    res.redirect('/');
});

// ask for authentication
app.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']}));

// google returns authorized back to the URL below
app.get('/login/authorized',
    passport.authenticate('google', {
        successRedirect: '/',
        failureRedirect: '/error'
    })
);

//we can use this or the index router to handle req
app.get('/', function (req, res) {
    res.render('index', {
        req: req,
        user: req.user
    })
});

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
    console.log("checking to see if they are authenticated!");
    // if user is authenticated in the session, carry on
    res.locals.loggedIn = false;
    if (req.isAuthenticated()) {
        console.log("user has been Authenticated");
        res.locals.loggedIn = true;
        return next();
    } else {
        console.log("user has not been authenticated...");
        // res.send("you must login first!");
        return next();
    }
}


// =====================================
// Course ===============================
// =====================================
app.get('/createCourse',
    isLoggedIn,
    (req, res) => res.render('createCourse'))

// rename this to /createCourse and update the ejs form
app.post('/createNewCourse',
    isLoggedIn,
    courseController.createNewClass
)

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

app.get('/showCourses',
    async (req, res, next) => {
        if (!req.user) next()
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
)


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;