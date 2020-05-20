var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var flash = require('connect-flash');
session = require("express-session");
bodyParser = require("body-parser");

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

var facultyList = ["supremeethan@brandeis.edu"]
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

// =====================================
// Course ===============================
// =====================================
app.get('/createCourse', (req, res) => {
    res.render('createCourse')
})

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