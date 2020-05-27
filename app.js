const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const flash = require('connect-flash');
const session = require("express-session");
const bodyParser = require("body-parser");

// Models!
const Course = require('./models/Course');
const Resource = require('./models/Resource');
const User = require('./models/User');

//*******************************************
//***********Controllers*********************

const courseController = require('./controllers/courseController');
const resourceController = require('./controllers/resourceController');
const profileController = require('./controllers/profileController');


//*******************************************
//***********Authentication******************

// here we set up authentication with passport
const passport = require('passport');
const configPassport = require('./config/passport');
configPassport(passport);

//*******************************************
//***********Database connection*************

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

const app = express();

//*******************************************
//***********Middleware setup****************

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
    resave: false,
    saveUninitialized: false,
}));

// Register passport middleware
app.use(flash());
app.use(passport.initialize(1));
app.use(passport.session(1));
app.use(bodyParser.urlencoded({extended: false}));

//*******************************************
//***********Login authorization*************

let facultyList = ["nicolezhang@brandeis.edu"]
let adminList = ["bbdhy96@gmail.com"]
// here is where we check and assign user's status
app.use((req, res, next) => {
    res.locals.title = "ENACT";
    res.locals.loggedIn = false;
    res.locals.status = "student"
    if (req.isAuthenticated()) {
        let googleEmail = req.user.googleemail
        if (googleEmail.endsWith("edu") || googleEmail.endsWith("@gmail.com")) {
            res.locals.user = req.user;
            res.locals.loggedIn = true;
            // set appropriate status
            if (facultyList.includes(googleEmail)) {
                res.locals.status = "faculty"
            } else if (adminList.includes(googleEmail)) {
                res.locals.status = "admin"
            }
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

//*******************************************
//***********Index page router***************

//we can use this or the index router to handle req
app.get('/', function (req, res) {
    res.render('index', {
        req: req,
        user: req.user
    })
});


//*******************************************
//***********Course related******************
app.get('/createCourse',
    (req, res) => res.render('createCourse'))

// rename this to /createCourse and update the ejs form
app.post('/createNewCourse',
    courseController.createNewClass,
    courseController.addToOwnedCourses
)

app.get('/showCourses',
    courseController.showOwnedCourses
)

app.get('/showOneCourse/:courseId',
    courseController.showOneCourse,
    resourceController.loadResources
)

app.get('/joinACourse',
    (req, res) => {
        res.render('joinACourse')
    }
)

app.post('/joinCourse',
    courseController.joinCourse
)

//*******************************************
//***********Resource related****************

app.get('/uploadToCourse/:courseId',
    (req, res) => {
        res.render('uploadToCourse', {
            req: req
        })
    })

app.post('/uploadResource/:courseId',
    resourceController.uploadResource)

//*******************************************
//***********Profile related*****************


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
    res.send("error message: " + err.message);
});

module.exports = app;