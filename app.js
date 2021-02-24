const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require("express-session");

// Models!
const Event = require('./models/Event')
const Course = require('./models/Course')
const CourseTime = require('./models/CourseTime')
const Resource = require('./models/Resource')
const User = require('./models/User')
const AuthorAlt = require('./models/AuthorAlternative')
const Faculty = require('./models/Faculty')
const Tag = require('./models/Tag')

//*******************************************
//***********Controllers*********************

const courseController = require('./controllers/courseController');
const resourceController = require('./controllers/resourceController');
const profileController = require('./controllers/profileController');
const notificationController = require('./controllers/notificationController');
const messageController = require('./controllers/messageController');
const eventController = require('./controllers/eventController');
const tagController = require('./controllers/tagController');
const utils = require('./controllers/utils');

//*******************************************
//***********Database connection*************

// const MONGODB_URI = 'mongodb://localhost/ENACT';
const MONGODB_URI = process.env.MONGODB_URI_IND || 'mongodb://localhost/ENACT';
// const MONGODB_URI = 'mongodb+srv://heroku_s59qt61k:suo0sir3rh8b104b38574ju3dm@cluster-s59qt61k.xy6rv.mongodb.net/heroku_s59qt61k?retryWrites=true&w=majority' || 'mongodb://localhost/ENACT';
const mongoose = require('mongoose');

// Makes connection asynchronously.  Mongoose will queue up database
// operations and release them when the connection is complete.
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});
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

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
}));

// configure auth router
const auth = require('./routes/auth')
app.use(auth)

// configure aws router
const aws = require('./routes/aws')
app.use(aws)

//*******************************************
//***********Index page router***************

//we can use this or the index router to handle req
app.get('/',
    utils.checkUserName,
    resourceController.loadDisplayedResources,
    resourceController.loadImages,
    async (req, res) => {
        let eventsInfo = await Event.find({}).sort({start: -1})
        eventsInfo = eventsInfo.filter(({start}) => new Date(start).getTime() >= new Date().getTime());
        res.locals.eventsInfo = eventsInfo
        res.render('./pages/index')
    })

app.get('/about',
    resourceController.loadImages,
    (req, res) =>
        res.render('./pages/about'))

app.get('/contact',
    (req, res) =>
        res.render('./pages/contact'))

app.get('/help',
    (req, res) =>
        res.render('./pages/help'))

//*******************************************
//***********Course related******************
app.get('/course',
    utils.checkUserName,
    (req, res) =>
        res.render('./pages/createCourse'))

app.get('/courses/schedule',
    utils.checkUserName,
    courseController.showSchedule,
    (req, res) =>
        res.render('./pages/courses-schedule'))

// rename this to /createCourse and update the ejs form
app.post('/course',
    courseController.createNewClass,
    courseController.addToOwnedCourses
)

app.get('/courses',
    utils.checkUserName,
    (req, res) =>
        res.render('./pages/courses-management')
)

app.get('/course/view/:courseId/:limit',
    utils.checkUserName,
    tagController.getAllTagsAlt,
    courseController.showOneCourse,
    resourceController.loadResources
)

app.get('/course/:limit/:courseId/:skip',
    utils.checkUserName,
    courseController.showOneCourse,
    resourceController.loadMoreResources
)

app.get('/course/update/:courseId',
    utils.checkUserName,
    async (req, res) => {
        let courseInfo = await Course.findOne({_id: req.params.courseId})
        let courseTimes = await CourseTime.find({courseId: req.params.courseId})
        res.render('./pages/updateCourse', {
            courseInfo: courseInfo,
            courseTimes: courseTimes
        })
    }
)

app.post('/course/update/:courseId',
    utils.checkUserName,
    courseController.updateCourse
)

app.get('/course/copy/:courseId',
    utils.checkUserName,
    async (req, res) => {
        let courseInfo = await Course.findOne({_id: req.params.courseId})
        res.render('./pages/copyCourse', {
            courseInfo: courseInfo
        })
    }
)


app.post('/course/copy/:courseId',
    utils.checkUserName,
    courseController.copyCourse
)

app.post('/course/delete/:courseId',
    utils.checkUserName,
    async (req, res) => {
        await Course.deleteOne({_id: req.params.courseId})
        await CourseTime.deleteMany({courseId: req.params.courseId})
        let users = await User.find()
        // clean user object fields
        for (let i = 0; i < users.length; i++) {
            users[i].ownedCourses.remove(req.params.courseId)
            users[i].enrolledCourses.remove(req.params.courseId)
            await users[i].save()
        }
        res.redirect('back')
    }
)

// render join course view
app.get('/course/join',
    utils.checkUserName,
    async (req, res) => {
        if (req.user.status !== 'admin')
            res.render('./pages/joinACourse')
        else {
            let courseInfo = await Course.find()
            res.render('./pages/joinACourseAlt', {
                enrolledCourses: req.user.enrolledCourses,
                courseInfo: courseInfo
            })
        }
    }
)

// process join course
app.post('/course/join',
    courseController.joinCourse
)

//*******************************************
//***********Resource related****************

app.get('/resource/upload/course/:courseId',
    utils.checkUserName,
    tagController.getAllTagsAlt,
    (req, res) => {
        res.render('./pages/uploadToCourse', {
            req: req
        })
    })

app.post('/resource/upload/course/:courseId',
    resourceController.uploadResource
)

app.get('/resources/search/private/general',
    utils.checkUserName,
    tagController.getAllTagsAlt,
    (req, res) =>
        res.render('./pages/search-primary')
)

app.post('/resources/search/private/general/results',
    tagController.getAllTagsAlt,
    resourceController.primarySearch
)

app.get('/resource/upload/public',
    utils.checkUserName,
    tagController.getAllTagsAlt,
    (req, res) => {
        if (req.user.status !== 'admin')
            res.send("You are not admin!")
        else
            res.render('./pages/uploadToPublic')
    }
)

app.post('/resource/upload/public',
    resourceController.uploadToPublicResr
)

app.get('/resources/search/private/advanced',
    utils.checkUserName,
    tagController.getAllTagsAlt,
    (req, res) =>
        res.render('./pages/search-advanced'))

app.post('/resources/search/private/advanced',
    tagController.getAllTagsAlt,
    resourceController.advancedSearch
)


app.get('/resources/view/my/public/all',
    utils.checkUserName,
    resourceController.showPublic
)

app.get('/resources/search/public/general',
    utils.checkUserName,
    tagController.getAllTagsAlt,
    (req, res) =>
        res.render('./pages/search-primary-public')
)

app.get('/resources/search/public/advanced',
    utils.checkUserName,
    tagController.getAllTagsAlt,
    (req, res) =>
        res.render('./pages/search-advanced-public'))

app.post('/resources/view/my/public/advancedResult',
    tagController.getAllTagsAlt,
    resourceController.advancedSearchPublic
)

app.get('/resources/view/faculty',
    utils.checkUserName,
    resourceController.loadAllFacultyResources,
    (req, res) =>
        res.render('./pages/facultyGuide')
)

app.get('/resources/view/faculty/:contentType',
    utils.checkUserName,
    resourceController.loadSpecificContentType,
)


app.get('/resource/upload/faculty',
    utils.checkUserName,
    tagController.getAllTagsAlt,
    (req, res) =>
        res.render('./pages/uploadToFaculty')
)

app.post('/resource/upload/faculty',
    resourceController.uploadResource
)

app.post('/resource/update/:resourceId/limit/:limit',
    resourceController.updateResource
)

app.post('/resource/remove/:resourceId',
    resourceController.removeResource
)

app.post('/resource/hide/:resourceId',
    resourceController.removePublicResource
)

app.post('/resource/show/:resourceId',
    resourceController.postPublicResource
)

app.get('/resources/view/favorite',
    utils.checkUserName,
    tagController.getAllTagsAlt,
    resourceController.showStarredResources
)

app.post('/resource/star/:resourceId',
    resourceController.starResource
)

app.post('/resource/unstar/:resourceId',
    resourceController.unstarResource
)

app.post('/resource/starAlt/:resourceId',
    resourceController.starResourceAlt
)

app.post('/resource/unstarAlt/:resourceId',
    resourceController.unstarResourceAlt
)

app.get('/resources/view/private',
    utils.checkUserName,
    resourceController.showMyResources
)

app.get('/resources/all',
    async (req, res) => {
        let resources
        // ENACT users
        if (res.locals.loggedIn) {
            // admin/student requesting
            if (res.locals.status === 'admin' || res.locals.status === 'faculty')
                resources = await Resource.find({
                    checkStatus: 'approve'
                }, {
                    name: 1,
                    contentType: 1,
                    ownerName: 1
                })
            else
                resources = await Resource.find({
                    checkStatus: 'approve',
                    status: {$in: ["privateToENACT", "public", "finalPublic"]}
                }, {
                    name: 1,
                    contentType: 1,
                    ownerName: 1
                })
        }
        // public users
        else {
            resources = await Resource.find({
                checkStatus: 'approve',
                status: {$in: ["finalPublic", "public"]}
            }, {
                name: 1,
                contentType: 1,
                ownerName: 1
            })
        }
        return res.send(resources)
    }
)

app.get('/resource/update/:resourceId/:option',
    async (req, res) => {
        let resource = await Resource.findOne({_id: req.params.resourceId})
        let ownerId = resource.ownerId
        let tempUser = await User.findOne({_id: ownerId})
        let ownerName1 = tempUser.userName
        res.render('./pages/updateOwner', {
            resource: resource,
            ownerName1: ownerName1,
            req: req
        })
    }
)

app.post('/resource/update/:resourceId/:option',
    resourceController.updateOwner
)

app.get('/resources/manage/public',
    resourceController.loadPublicResources,
    tagController.getAllTagsAlt,
    (req, res) =>
        res.render('./pages/resource-management-public')
)

app.get('/collection/view/:resourceSetId',
    resourceController.loadCollection,
    tagController.getAllTagsAlt,
    (req, res) =>
        res.render('./pages/showCollection')
)

app.post('/collection/:collectionId/delete/:resourceId',
    resourceController.removeFromCollection
)

app.post('/collection/:collectionId/add/:resourceId',
    resourceController.addToCollection
)

app.post('/collection/create',
    resourceController.createCollection
)

app.post('/collection/delete/:collectionId',
    resourceController.deleteCollection
)

//*******************************************
//***********Notification related************

app.get('/resource/review',
    utils.checkUserName,
    notificationController.loadUnderReviewResources
)

app.post('/resource/approve',
    notificationController.approve
)

app.post('/resource/publish',
    notificationController.toPublic
)

app.post('/resource/deny',
    notificationController.deny
)

app.post('/resource/resume/:resourceId',
    notificationController.resume
)

app.post('/resource/comment/:resourceId',
    notificationController.comment
)

app.post('/resource/deny',
    notificationController.sendDeny
)

app.get('/resource/approve/public',
    notificationController.loadPartPublicResources
)
app.post('/resource/status/toPublic',
    notificationController.partPublicToPublic
)

app.post('/resource/status/toENACT',
    notificationController.partPublicToENACT
)

app.get('/resources/view/my/denied',
    tagController.getAllTagsAlt,
    notificationController.loadDeniedResources
)

app.get('/resources/view/my/approved',
    notificationController.loadApprovedResources
)

app.get('/resources/view/my/public',
    notificationController.loadMyPublicResources
)

//*******************************************
//***********Profile related*****************

//show all profiles from all users
app.get('/profile/view/:id',
    async (req, res, next) => {
        // update own profile first
        if (res.locals.loggedIn && res.locals.user.userName === undefined) {
            res.render('./pages/updateProfile')
        } else {
            next()
        }
    },
    profileController.findOneUser
)

app.get('/profiles/view/faculty',
    resourceController.loadImages,
    profileController.showFacultyProfiles
)

app.get('/profile/update',
    (req, res) => {
        console.log("In profile update!")
        res.render('./pages/updateProfile')
    }
)

app.post('/profile/update',
    profileController.updateProfile
)

app.get('/profile/update/:userId',
    async (req, res) => {
        let account = await User.findOne({_id: req.params.userId})
        res.render('./pages/updateProfileAdmin', {
            account: account,
        })
    }
)

app.post('/profile/update/:userId',
    profileController.updateProfileAdmin
)

app.get('/profiles/view/all',
    utils.checkUserName,
    profileController.showAllProfiles
)

app.get('/profile/create/faculty',
    utils.checkUserName,
    profileController.loadFaculty
)

app.post('/profile/create/faculty',
    profileController.createFaculty
)

app.post('/profile/self/update/imageURL',
    profileController.updateProfileImageURL
)

app.post('/profile/:userId/update/imageURL',
    profileController.updateProfileImageURLAdmin
)

// send profile email
app.get('/profile/send/:id',
    messageController.sendProfileEmail
)


//*******************************************
//***********Networking related**************

app.get('/networking',
    async (req, res) => {
        let profileInfo = await User.find({networkCheck: 'on'})
        res.render('./pages/networking', {
            profileInfo: profileInfo,
            state: 'U.S.'
        })
    })

app.get('/networking',
    async (req, res) => {
        let profileInfo = await User.find({networkCheck: 'on'})
        res.render('./pages/networking', {
            profileInfo: profileInfo,
            state: 'U.S.'
        })
    })

app.get('/networking/:state',
    async (req, res) => {
        let profileInfo = await User.find({state: req.params.state, networkCheck: 'on'})
        res.render('./pages/networking', {
            profileInfo: profileInfo,
            state: req.params.state
        })
    }
)


//*******************************************
//************Message related****************
app.get('/messages/view/:sender/:receiver/:resourceId',
    utils.checkUserName,
    async (req, res, next) => {
        if (res.locals.loggedIn)
            next()
        else
            res.redirect('/login/messages/view/' + req.params.sender + '/' + req.params.receiver + '/' + req.params.resourceId)
    },
    messageController.loadMessagingPage
)

app.get('/login/messages/view/:sender/:receiver/:resourceId',
    (req, res, next) => {
        req.session['redirectPath'] = req.params.sender + '/' + req.params.receiver + '/' + req.params.resourceId
        res.render('./pages/login', {
            secret: 'redirect',
            req: req
        })
    }
)

app.post('/messages/save/:sender/:receiver/:resourceId',
    messageController.saveMessage
)

app.get('/messages/view/all',
    utils.checkUserName,
    messageController.loadMessageBoard
)

//*******************************************
//*************Event related*****************

app.get('/events',
    async (req, res) => {
        if (res.locals.loggedIn) {
            let eventsInfo = await Event.find({}).sort({start: 1})
            let futureEventsInfo = eventsInfo.filter(({start}) => new Date(start).getTime() >= new Date().getTime());
            let pastEventsInfo = eventsInfo.filter(({start}) => new Date(start).getTime() < new Date().getTime()).reverse();
            res.render('./pages/events', {
                futureEventsInfo: futureEventsInfo,
                pastEventsInfo: pastEventsInfo
            })
        } else {
            let eventsInfo = await Event.find({visibility: 'public'}).sort({start: 1})
            let futureEventsInfo = eventsInfo.filter(({start}) => new Date(start).getTime() >= new Date().getTime());
            let pastEventsInfo = eventsInfo.filter(({start}) => new Date(start).getTime() < new Date().getTime()).reverse();
            let courseTimes = await CourseTime.find({}, {'_id': 0, '__v': 0});
            let courses = await Course.find({year: 2021}, {
                'institutionURL': 1,
                'ownerId': 1,
                '_id': 1,
                'state': 1,
                'courseName': 1,
                'timezone': 1,
                'instructor': 1,
                'institution': 1
            })
            res.render('./pages/events-public', {
                courseTimes: courseTimes,
                courses: courses,
                futureEventsInfo: futureEventsInfo,
                pastEventsInfo: pastEventsInfo
            })
        }
    }
)

app.get('/events/all',
    async (req, res) => {
        let now = new Date();
        let eventsInfo;
        if (res.locals.loggedIn) {
            eventsInfo = await Event.find({}).sort({start: -1})
        } else {
            eventsInfo = await Event.find({visibility: 'public'}).sort({start: -1})
        }
        for (let i = 0; i < eventsInfo.length; i++) {
            eventsInfo[i].start = new Date(eventsInfo[i].start - (now.getTimezoneOffset() * 60000))
            eventsInfo[i].end = new Date(eventsInfo[i].end - (now.getTimezoneOffset() * 60000))
        }
        return res.send(eventsInfo)
    }
)

app.post('/event/delete/:eventId',
    eventController.deleteEvent
)

app.post('/event/edit/:eventId',
    eventController.editEvent
)

app.post('/event/save',
    eventController.saveEvent
)

app.get('/event/image/update/:eventId',
    (async (req, res) => {
        let eventInfo = await Event.findOne({_id: req.params.eventId})
        res.render('./pages/event-updateImage', {
            eventInfo: eventInfo
        })
    })
)

app.post('/event/image/update/:eventId',
    eventController.updateImageURL
)

//*******************************************
//*************Tag related*****************
app.post('/tag/add',
    tagController.addTags
)

app.get('/tag/approve',
    tagController.loadUnderReviewTags
)

app.post('/tag/agree',
    tagController.agreeTags
)

app.post('/tag/deny',
    tagController.denyTags
)

app.get('/tag/my',
    tagController.loadTags
)

app.get('/tags/all',
    tagController.getAllTags
)


//*******************************************
//***********Database related****************

// update author name for all resources
app.get('/secretFunction2',
    async (req, res) => {
        let allRes = await Resource.find()
        for (var resource in allRes) {
            let author = await User.findOne(allRes[resource].ownerId)
            if (author) {
                allRes[resource].ownerName = author.userName
                await allRes[resource].save()
            }
        }
        res.send("Success!")
    }
)

// remove faulty faculties
app.get('/secretFunction3',
    async (req, res) => {
        let allFaculty = await Faculty.find()
        for (var i in allFaculty) {
            let faculty = await User.findOne({
                $or: [
                    {workEmail: allFaculty[i].email}, {googleemail: allFaculty[i].email}
                ]
            })
            if (faculty) {
                allFaculty[i].userId = faculty._id
                await allFaculty[i].save()
            } else {
                await Faculty.deleteOne({email: allFaculty[i].email})
            }
        }
        res.send("Success!")
    }
)

// add network check
app.get('/secretFunction4',
    async (req, res) => {
        let users = await User.find()
        for (let i = 0; i < users.length; i++) {
            users[i].networkCheck = 'on'
            await users[i].save()
        }
        res.send("success!")
    }
)

app.get('/secretFunction5/:userId',
    async (req, res) => {
        let curruser = await User.findOne({_id: req.params.userId})
        let resources = await Resource.find()
        for (let i = 0; i < resources.length; i++) {
            if (resources[i].ownerName === 'ENACT admin') {
                resources[i].ownerId = curruser._id
                await resources[i].save()
            }
        }
        res.send("success!")
    }
)


//*******************************************
//**************AJAX related*****************
app.get('/profiles/all',
    async (req, res) => {
        let userProfiles = await User.find()
        return res.send(userProfiles)
    }
)

app.get('/resource/:resourceId',
    async (req, res) => {
        let resource = await Resource.findOne({_id: req.params.resourceId})
        resource = await addAuthorAlt((resource))
        return res.send(resource)
    }
)

async function addAuthorAlt(resource) {
    let authors = await AuthorAlt.find({resourceId: resource._id})
    if (authors) {
        for (let j = 0; j < authors.length; j++)
            resource.ownerName += (', ' + authors[j].userName)
    }
    return resource
}

app.get('/profiles/faculties',
    async (req, res) => {
        let userProfiles = await User.find({
            $or: [
                {status: 'faculty'}, {status: 'admin'}
            ]
        })
        return res.send(userProfiles)
    }
)

//*******************************************
//*************Error related*****************

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