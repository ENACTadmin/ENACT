require("dotenv").config();

const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const session = require("express-session");
const mailRouter = require("./routes/mail");

//*******************************************
//***********Development****************
// const livereload = require("livereload");
// const connectLivereload = require("connect-livereload");
// const liveReloadServer = livereload.createServer();
// liveReloadServer.watch(path.join(__dirname, "public"));

//*******************************************
//***********Database Schemas****************
const Event = require("./models/Event");
const Course = require("./models/Course");
const CourseTime = require("./models/CourseTime");
const Resource = require("./models/Resource");
const User = require("./models/User");
const AuthorAlt = require("./models/AuthorAlternative");
const Faculty = require("./models/Faculty");
const TA = require("./models/TA");

//*******************************************
//***********Controllers*********************
const courseController = require("./controllers/courseController");
const resourceController = require("./controllers/resourceController");
const resourceApiController = require("./controllers/resourceApiController");
const profileController = require("./controllers/profileController");
const notificationController = require("./controllers/notificationController");
const messageController = require("./controllers/messageController");
const eventController = require("./controllers/eventController");
const tagController = require("./controllers/tagController");
const utils = require("./controllers/utils");

//*******************************************
//***********Database connection*************
// const MONGODB_URI = 'mongodb://localhost/ENACT';
// const MONGODB_URI = process.env.MONGODB_URI_IND || 'mongodb://localhost/ENACT';
const MONGODB_URI =
  "mongodb+srv://heroku_s59qt61k:suo0sir3rh8b104b38574ju3dm@cluster-s59qt61k.xy6rv.mongodb.net/heroku_s59qt61k?retryWrites=true&w=majority" ||
  "mongodb://localhost/ENACT";
const mongoose = require("mongoose");

// Makes connection asynchronously.  Mongoose will queue up database
// operations and release them when the connection is complete.
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("mongo connected");
});

//*******************************************
//***********Middleware setup****************

const app = express();

// development web app reload
// app.use(connectLivereload());
// liveReloadServer.server.once("connection", () => {
//   setTimeout(() => {
//     liveReloadServer.refresh("/");
//   }, 100);
// });

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// register middleware
// app.use(logger("dev"));
// app.use(logger("combined"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false
  })
);

// Register the mail router
app.use("/api/mail", mailRouter);

// Apply middleware globally
app.use(utils.checkUserName);
app.use(utils.checkUserAccess);

// configure auth router
const auth = require("./routes/auth");
app.use(auth);

// configure aws router
const aws = require("./routes/aws");
app.use(aws);

//*******************************************
//***********Index page router***************

// load required resources and render index page
app.get(
  "/",
  utils.checkUserName,
  resourceController.loadDisplayedResources,
  resourceController.loadImages,
  eventController.loadEvents,
  (req, res) => {
    const notificationDismissed = req.cookies.notificationDismissed === "true"; // Define notificationDismissed
    res.render("./pages/index", { cookieDismissed: notificationDismissed });
  }
);

// Home route with notification check
app.get("/home", utils.checkUserName, (req, res) => {
  const notificationDismissed = req.cookies.notificationDismissed;
  res.render("home", { cookieDismissed: notificationDismissed });
});

//*******************************************
//***********New Search page router***************

// load required resources and render index page
app.get(
  "/search/",
  utils.checkUserName,
  resourceController.loadDisplayedResources,
  resourceController.loadImages,
  eventController.loadEvents,
  (req, res) => {
    res.render("./pages/newSearch/search");
  }
);

//*******************************************
//***********Course related******************

// course creation
app.get("/course/create", utils.checkUserName, async (req, res) => {
  let faculties = await Faculty.find();
  res.render("./pages/course-create", {
    faculties
  });
});

app.post("/course/create", courseController.createNewClass);

// get course schedule
app.get(
  "/courses/schedule",
  utils.checkUserName,
  courseController.showSchedule,
  (req, res) => {
    res.render("./pages/courses-schedule");
  }
);

// show all courses
app.get(
  "/courses",
  utils.checkUserName,
  utils.checkUserAccess,
  courseController.showCourseManagement,
  (req, res) => res.render("./pages/courses-management")
);

// show one course
app.get(
  "/course/view/:courseId/:limit",
  utils.checkUserName,
  tagController.getAllTags,
  courseController.showOneCourse,
  resourceController.loadResources,
  (req, res) => {
    res.render("./pages/showOneCourse");
  }
);

// update one course
app.get("/course/update/:courseId", utils.checkUserName, async (req, res) => {
  let courseInfo = await Course.findOne({ _id: req.params.courseId });
  let courseTimes = await CourseTime.find({ courseId: req.params.courseId });
  res.render("./pages/updateCourse", {
    courseInfo: courseInfo,
    courseTimes: courseTimes
  });
});

app.get("/profiles/faculties", async (req, res) => {
  try {
    const profiles = await User.find(
      { $or: [{ status: "faculty" }, { status: "admin" }] },
      { userName: 1, _id: 1 }
    );
    res.json(profiles);
  } catch (error) {
    res.status(500).json({ message: "Error fetching profiles", error });
  }
});

app.get("/api/getUserByUsername", async (req, res) => {
  try {
    const { userName } = req.query;
    if (!userName) {
      return res.status(400).json({ error: "Missing userName parameter" });
    }

    // First, check in the users collection
    let user = await User.findOne(
      { userName: userName, status: { $in: ["faculty", "admin"] } },
      { _id: 1, userName: 1 }
    );

    // If not found in users, check in faculties collection
    if (!user) {
      const faculty = await Faculty.findOne({ userName: userName }).populate(
        "userId"
      );
      if (faculty) {
        user = { _id: faculty.userId._id, userName: faculty.userName };
      }
    }

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post(
  "/course/update/:courseId",
  utils.checkUserName,
  courseController.updateCourse
);

// copy a course
app.get("/course/copy/:courseId", utils.checkUserName, async (req, res) => {
  let courseInfo = await Course.findOne({ _id: req.params.courseId });
  res.render("./pages/course-copy", {
    courseInfo: courseInfo
  });
});

app.post(
  "/course/copy/:courseId",
  utils.checkUserName,
  courseController.copyCourse
);

// delete a course
app.post(
  "/course/delete/:courseId",
  utils.checkUserName,
  courseController.deleteCourse
);

// render join course view
app.get("/course/join", utils.checkUserName, async (req, res) => {
  if (req.user.status !== "admin") res.render("./pages/course-join");
  else {
    let courseInfo = await Course.find();
    res.render("./pages/admin-course-join", {
      enrolledCourses: req.user.enrolledCourses,
      courseInfo: courseInfo
    });
  }
});

// process join course
app.post("/course/join", courseController.joinCourse);

// show a list of past courses
app.get(
  "/courses/pastList",
  utils.checkUserName,
  courseController.showCourses,
  (req, res) => res.render("./pages/course-pastList")
);

//*******************************************
//***********API related****************

//Resource API for ENACT-Data-Apps
app.get("/api/v0/resources/", resourceController.getResources);
app.get("/api/v0/resources/all", resourceApiController.getAllResources);
app.get("/api/v0/resources/sets", resourceController.getResourceUnique);
app.get("/api/v0/resources/counts", resourceController.getResourceCount);
app.get("/api/v0/resources/allstats", resourceController.getResourcesAndStats);
app.get("/api/v0/resources/stats", resourceController.getResourceStats);
app.get("/api/v0/resources/viewsAll", resourceController.getResourceViewsAll);
app.get("/api/v0/resources/views", resourceController.getResourceViewsCount);
app.post(
  "/api/v0/resources/:id/increment-view",
  resourceController.incrementViewCount
);
app.delete("/api/v0/resources/clean-views", resourceController.cleanViews);

// app.get("/api/v0/resources/search", (req, res) => {
//   console.log("Search query:", req.query.search);
//   resourceController.getResourcesByKeyWord(req, res);
// });

app.get("/api/v0/resources/searchByKeyword", (req, res) => {
  // Check if the searchString query parameter is provided
  if (!req.query.searchString) {
    return res.status(400).json({ error: "searchString parameter is missing" });
  }
  const keyword = req.query.searchString;
  // console.log("Search query:", keyword);
  // Call the controller function, passing the keyword and Express req, res objects
  resourceController.getResourcesByKeyword(req, res, keyword);
});

app.get("/api/v0/resources/storage/:id", resourceController.getResourceById);
app.get("/api/v0/resources/tags/:tag", resourceController.getResourcesByTag);

//*******************************************
//***********Resource related****************

//Resource API for ENACT-Data-Apps
app.get("/resources/", resourceController.getResources);
app.get("/resources/all", resourceController.getAllResources);
app.get("/resources/stats", resourceController.getResourceStats);
app.get("/resources/stats/page", resourceController.renderResourceStatsPage);
app.get("/resources/:id", resourceController.getResourceById);

// upload resource to a course
app.get(
  "/resource/upload/course/:courseId",
  utils.checkUserName,
  tagController.getAllTags,
  (req, res) => {
    res.render("./pages/uploadToCourse", {
      req: req
    });
  }
);

app.post(
  "/resource/upload/course/:courseId",
  resourceController.uploadResource
);

// upload faculty-only resources
app.get(
  "/resource/upload/faculty",
  utils.checkUserName,
  tagController.getAllTags,
  (req, res) => res.render("./pages/uploadToFaculty")
);

app.post("/resource/upload/faculty", resourceController.uploadResource);

// ENACT-only full-text search
app.get(
  "/resources/search/private/general",
  utils.checkUserName,
  tagController.getAllTags,
  (req, res) => res.render("./pages/search-primary")
);

// render full-text search result
app.post(
  "/resources/search/private/general/results",
  tagController.getAllTags,
  resourceController.primarySearch
);

// ENACT-only advanced search
app.get(
  "/resources/search/private/advanced",
  utils.checkUserName,
  tagController.getAllTags,
  (req, res) => res.render("./pages/search-advanced")
);

// ENACT-only advanced search
app.post(
  "/resources/search/private/advanced",
  tagController.getAllTags,
  resourceController.advancedSearch
);

// load public resource page
app.get(
  "/resources/view/public",
  utils.checkUserName,
  resourceController.showPublic
);

// public search related
app.get(
  "/resources/search/public/general",
  utils.checkUserName,
  tagController.getAllTags,
  (req, res) => res.render("./pages/search-primary-public")
);

app.get(
  "/resources/search/public/advanced",
  utils.checkUserName,
  tagController.getAllTags,
  (req, res) => res.render("./pages/search-advanced-public")
);

app.post(
  "/resources/search/public/advanced",
  tagController.getAllTags,
  resourceController.advancedSearchPublic
);

// get impact resources
app.get(
  "/resources/view/facultyResearch",
  utils.checkUserName,
  resourceController.loadImpactResources,
  (req, res) => res.render("./pages/facultyResearch")
);

app.get(
  "/resources/view/inTheNews",
  utils.checkUserName,
  resourceController.loadImpactResources,
  (req, res) => res.render("./pages/InTheNews")
);

// get student guide resources by students
app.get(
  "/resources/view/student-guide",
  resourceController.renderStudentGuidePage
);

// get faculty-only resources
app.get(
  "/resources/view/faculty",
  utils.checkUserName,
  resourceController.loadAllFacultyResources,
  (req, res) => res.render("./pages/showFacultyGuide")
);

// get faculty-only resources for a certain contentType
app.get(
  "/resources/view/faculty/:contentType",
  utils.checkUserName,
  tagController.getAllTags,
  resourceController.loadSpecificContentType
);

// update content of resource
// 1) in course page --> redirect back to course page (preserve loaded resources)
// 2) in other pages
app.post(
  "/resource/update/:resourceId/limit/:limit",
  resourceController.updateResource
);

// delete a resource
app.post("/resource/remove/:resourceId", resourceController.removeResource);

// select resources to show to the public on the index page
app.post("/resource/show/:resourceId", resourceController.postPublicResource);

app.post("/resource/hide/:resourceId", resourceController.removePublicResource);

// render public resource management page
app.get(
  "/resources/manage/public",
  resourceController.loadPublicResources,
  tagController.getAllTags,
  (req, res) => res.render("./pages/resource-management-public")
);

// get 'my favorites' resources
app.get(
  "/resources/view/favorite",
  utils.checkUserName,
  tagController.getAllTags,
  resourceController.showStarredResources
);

// 'like' a resource
app.post("/resource/star/:resourceId", resourceController.starResource);

// 'unlike' a resource
app.post("/resource/unstar/:resourceId", resourceController.unstarResource);

// get all my resources
app.get(
  "/resources/view/private",
  utils.checkUserName,
  resourceController.showMyResources
);

// update the owner of a resource
app.get(
  "/resource/update/:resourceId/:option",
  resourceController.getCurrentOwner
);

app.post(
  "/resource/update/:resourceId/:option",
  resourceController.updateOwner
);

//*******************************************
//********Collection/Folder related**********

// view collection
app.get(
  "/collection/view/:resourceSetId",
  resourceController.loadCollection,
  tagController.getAllTags,
  (req, res) => res.render("./pages/showCollection")
);

app.post(
  "/collection/:collectionId/delete/:resourceId",
  resourceController.removeFromCollection
);

app.post(
  "/collection/:collectionId/add/:resourceId",
  resourceController.addToCollection
);

app.post("/collection/create", resourceController.createCollection);

app.post(
  "/collection/delete/:collectionId",
  resourceController.deleteCollection
);

// load all under review resources (faculty/admin)
app.get(
  "/resource/review",
  utils.checkUserName,
  notificationController.loadUnderReviewResources
);

// load all under review resources (TA)
app.get(
  "/resource/review/:courseId",
  utils.checkUserName,
  notificationController.loadUnderReviewResourcesTA
);

app.post("/resource/approve", notificationController.approve);

// publish to public
app.post("/resource/publish", notificationController.toPublic);

app.post("/resource/deny", notificationController.deny);

app.post("/resource/resume/:resourceId", notificationController.resume);

app.post(
  "/resource/comment/:resourceId",
  notificationController.comment,
  messageController.sendProfileEmail
);

app.post("/resource/deny", notificationController.sendDeny);

app.get(
  "/resource/approve/public",
  notificationController.loadPartPublicResources
);

app.post(
  "/resource/status/toPublic",
  notificationController.partPublicToPublic
);

app.post("/resource/status/toENACT", notificationController.partPublicToENACT);

app.get(
  "/resources/view/my/denied",
  tagController.getAllTags,
  notificationController.loadDeniedResources
);

app.get(
  "/resources/view/my/approved",
  notificationController.loadApprovedResources
);

app.get(
  "/resources/view/my/public",
  notificationController.loadMyPublicResources
);

//*******************************************
//***********Profile related*****************

//show all profiles from all users
app.get(
  "/profile/view/:id",
  async (req, res, next) => {
    // update own profile first
    if (res.locals.loggedIn && res.locals.user.userName === undefined) {
      res.render("./pages/updateProfile");
    } else {
      next();
    }
  },
  profileController.findOneUser
);

app.get(
  "/profiles/view/faculty",
  resourceController.loadImages,
  profileController.showFacultyProfiles
);

app.get("/profile/update", (req, res) => {
  console.log("In profile update!");
  res.render("./pages/updateProfile");
});

app.post("/profile/update", profileController.updateProfile);

app.get("/profile/update/:userId", async (req, res) => {
  let account = await User.findOne({ _id: req.params.userId });
  res.render("./pages/updateProfileAdmin", {
    account: account
  });
});

app.post("/profile/update/:userId", profileController.updateProfileAdmin);

app.get(
  "/profiles/view/all",
  utils.checkUserName,
  profileController.showAllProfiles
);

app.get(
  "/profile/create/faculty",
  utils.checkUserName,
  profileController.loadFaculty
);

app.post("/profile/create/faculty", profileController.createFaculty);

app.post(
  "/profile/self/update/imageURL",
  profileController.updateProfileImageURL
);

app.post(
  "/profile/:userId/update/imageURL",
  profileController.updateProfileImageURLAdmin
);

// send profile email
app.get("/profile/send/:id", messageController.sendProfileEmail);

//*******************************************
//***********Networking related**************

app.get("/networking", async (req, res) => {
  let profileInfo = await User.find({ networkCheck: "on" }).collation({
    locale: "en"
  });
  let duplicate = JSON.parse(JSON.stringify(profileInfo));
  for (let i = 0; i < duplicate.length; i++) {
    if (duplicate[i].userName) {
      duplicate[i].score =
        duplicate[i].userName.split(" ")[
          duplicate[i].userName.split(" ").length - 1
        ];
    } else {
      duplicate[i].score = "zzzzzzz";
    }
  }
  duplicate = duplicate.sort((a, b) => a.score.localeCompare(b.score));
  res.render("./pages/networking", {
    profileInfo: duplicate,
    state: "U.S."
  });
});

app.get("/networking/:state", async (req, res) => {
  let profileInfo = await User.find({
    state: req.params.state,
    networkCheck: "on"
  }).collation({ locale: "en" });
  let duplicate = JSON.parse(JSON.stringify(profileInfo));
  for (let i = 0; i < duplicate.length; i++) {
    if (duplicate[i].userName) {
      duplicate[i].score =
        duplicate[i].userName.split(" ")[
          duplicate[i].userName.split(" ").length - 1
        ];
    } else {
      duplicate[i].score = "zzzzzzz";
    }
  }
  duplicate = duplicate.sort((a, b) => a.score.localeCompare(b.score));
  res.render("./pages/networking", {
    profileInfo: duplicate,
    state: req.params.state
  });
});

//*******************************************
//************Message related****************

app.get(
  "/messages/view/:sender/:receiver/:resourceId",
  utils.checkUserName,
  async (req, res, next) => {
    if (res.locals.loggedIn) next();
    else
      res.redirect(
        "/login/messages/view/" +
          req.params.sender +
          "/" +
          req.params.receiver +
          "/" +
          req.params.resourceId
      );
  },
  messageController.loadMessagingPage
);

app.get(
  "/login/messages/view/:sender/:receiver/:resourceId",
  (req, res, next) => {
    req.session["redirectPath"] =
      req.params.sender +
      "/" +
      req.params.receiver +
      "/" +
      req.params.resourceId;
    res.render("./pages/login/login", {
      secret: "redirect",
      req: req
    });
  }
);

app.post(
  "/messages/save/:sender/:receiver/:resourceId",
  messageController.saveMessage
);

app.get(
  "/messages/view/all",
  utils.checkUserName,
  messageController.loadMessageBoard
);

//*******************************************
//*************Event related*****************

app.get("/events", async (req, res) => {
  if (res.locals.loggedIn) {
    let eventsInfo = await Event.find({}).sort({ start: 1 });
    let futureEventsInfo = eventsInfo.filter(
      ({ start }) => new Date(start).getTime() >= new Date().getTime()
    );
    let pastEventsInfo = eventsInfo
      .filter(({ start }) => new Date(start).getTime() < new Date().getTime())
      .reverse();
    res.render("./pages/events-private", {
      futureEventsInfo: futureEventsInfo,
      pastEventsInfo: pastEventsInfo
    });
  } else {
    let eventsInfo = await Event.find({ visibility: "public" }).sort({
      start: 1
    });
    let futureEventsInfo = eventsInfo.filter(
      ({ start }) => new Date(start).getTime() >= new Date().getTime()
    );
    let pastEventsInfo = eventsInfo
      .filter(({ start }) => new Date(start).getTime() < new Date().getTime())
      .reverse();
    let courseTimes = await CourseTime.find({}, { _id: 0, __v: 0 });
    let courses = await Course.find(
      { year: 2021 },
      {
        institutionURL: 1,
        ownerId: 1,
        _id: 1,
        state: 1,
        semester: 1,
        courseName: 1,
        timezone: 1,
        instructor: 1,
        institution: 1
      }
    );
    res.render("./pages/events-public", {
      courseTimes: courseTimes,
      courses: courses,
      futureEventsInfo: futureEventsInfo,
      pastEventsInfo: pastEventsInfo
    });
  }
});

app.post("/event/delete/:eventId", eventController.deleteEvent);

app.post("/event/edit/:eventId", eventController.editEvent);

app.post("/event/save", eventController.saveEvent);
app.post(
  "/event/saveAndSendReminder",
  eventController.saveEventAndSendReminder
);

app.get("/event/image/update/:eventId", async (req, res) => {
  let eventInfo = await Event.findOne({ _id: req.params.eventId });
  res.render("./pages/event-updateImage", {
    eventInfo: eventInfo
  });
});

app.post("/event/image/update/:eventId", eventController.updateImageURL);

// send event email
app.get("/event/send/:id", eventController.sendEventEmail);

//*******************************************
//*************Tag related*****************
app.post("/tag/add", tagController.addTags);

app.get("/tag/approve", tagController.loadUnderReviewTags);

app.post("/tag/agree", tagController.agreeTags);

app.post("/tag/deny", tagController.denyTags);

app.get("/tag/my", tagController.loadTags);

//*************************************
//***********TA related****************

app.get("/TA/assign/:courseId", async (req, res) => {
  let currCourse = await Course.findOne({ _id: req.params.courseId });
  let tasInfo;
  if (currCourse.tas) {
    tasInfo = await User.find({
      _id: {
        $in: currCourse.tas
      }
    });
  } else {
    tasInfo = null;
  }
  res.render("./pages/ta-assign", {
    courseId: req.params.courseId,
    courseInfo: currCourse,
    tas: tasInfo
  });
});

app.post("/TA/assign/:courseId", courseController.assignTA);

//*******************************************
//***********Database related****************

// update author name for all resources
app.get("/secretFunction2", async (req, res) => {
  let allRes = await Resource.find();
  for (var resource in allRes) {
    let author = await User.findOne(allRes[resource].ownerId);
    if (author) {
      allRes[resource].ownerName = author.userName;
      await allRes[resource].save();
    }
  }
  res.send("Success!");
});

// remove faulty faculties
app.get("/secretFunction3", async (req, res) => {
  let allFaculty = await Faculty.find();
  for (var i in allFaculty) {
    let faculty = await User.findOne({
      $or: [
        { workEmail: allFaculty[i].email },
        { googleemail: allFaculty[i].email }
      ]
    });
    if (faculty) {
      allFaculty[i].userId = faculty._id;
      await allFaculty[i].save();
    } else {
      await Faculty.deleteOne({ email: allFaculty[i].email });
    }
  }
  res.send("Success!");
});

// add network check
app.get("/secretFunction4", async (req, res) => {
  let users = await User.find();
  for (let i = 0; i < users.length; i++) {
    users[i].networkCheck = "on";
    await users[i].save();
  }
  res.send("success!");
});

app.get("/secretFunction5/:userId", async (req, res) => {
  let curruser = await User.findOne({ _id: req.params.userId });
  let resources = await Resource.find();
  for (let i = 0; i < resources.length; i++) {
    if (resources[i].ownerName === "ENACT admin") {
      resources[i].ownerId = curruser._id;
      await resources[i].save();
    }
  }
  res.send("success!");
});

//*******************************************
//**************AJAX related*****************

app.get(
  "/course/:courseId/:limit",
  utils.checkUserName,
  courseController.showOneCourse,
  resourceController.loadMoreResourcesAjax
);

app.get("/resources/all", resourceController.getAllResourcesAjax);

app.get("/profiles/all", async (req, res) => {
  let userProfiles = await User.find();
  return res.send(userProfiles);
});

app.get("/tags/all", tagController.getAllTagsAjax);

app.get("/events/all", async (req, res) => {
  let now = new Date();
  let eventsInfo;
  if (res.locals.loggedIn) {
    eventsInfo = await Event.find({}).sort({ start: -1 });
  } else {
    eventsInfo = await Event.find({ visibility: "public" }).sort({ start: -1 });
  }
  for (let i = 0; i < eventsInfo.length; i++) {
    eventsInfo[i].start = new Date(
      eventsInfo[i].start - now.getTimezoneOffset() * 60000
    );
    eventsInfo[i].end = new Date(
      eventsInfo[i].end - now.getTimezoneOffset() * 60000
    );
  }
  return res.send(eventsInfo);
});

app.get("/resource/:resourceId", async (req, res) => {
  let resource = await Resource.findOne({ _id: req.params.resourceId });
  resource = await addAuthorAlt(resource);
  return res.send(resource);
});

async function addAuthorAlt(resource) {
  let authors = await AuthorAlt.find({ resourceId: resource._id });
  if (authors) {
    for (let j = 0; j < authors.length; j++)
      resource.ownerName += ", " + authors[j].userName;
  }
  return resource;
}

//*******************************************
//************Static pages*******************

app.get("/about", resourceController.loadImages, (req, res) =>
  res.render("./pages/staticPages/about")
);

app.get("/contact", (req, res) => res.render("./pages/staticPages/contact"));

app.get("/help", (req, res) => res.render("./pages/staticPages/help"));

app.get("/accountHelp", (req, res) =>
  res.render("./pages/staticPages/accountHelp")
);

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
  res.locals.error = req.app.get("env") === "development" ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.send("error message: " + err.message);
});

module.exports = app;
