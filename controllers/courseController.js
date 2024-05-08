"use strict";
const Course = require("../models/Course");
const Resource = require("../models/Resource");
const User = require("../models/User");
const CourseMember = require("../models/CourseMember");
const CourseTime = require("../models/CourseTime");
const TA = require("../models/TA");
const Faculty = require("../models/Faculty");
const moment = require("moment-timezone");

/**
 * create a new course
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
  let coursePin;
  exports.createNewClass = async (req, res, next) => {
    if (res.locals.status === "student") {
      res.send(
        "You must log in with an authorized faculty account to create a class. <a href='/logout'>Logout</a>"
      );
      return;
    } else if (!(req.body.norobot === "on" && req.body.robot === undefined)) {
      res.send("no robots allowed!");
      return;
    }
    try {
      coursePin = await getCoursePin();

      let ownerId = req.user._id;
      let instructor = req.user.userName;
      console.log(ownerId, req.body.email);
      if (res.locals.status === "admin" && req.body.email !== "") {
        let facultyId = await Faculty.findOne({ _id: req.body.email });
        let facultyUser = await User.findOne({ _id: facultyId.userId });
        ownerId = facultyId.userId;
        instructor = facultyUser.userName;
      }

      const isAsynchronous = req.body.asynchronous === 'true';
      const isUndecided = req.body.undecided === 'true';

      let newCourse = new Course({
        courseName: req.body.courseName,
        ownerId,
        instructor,
        coursePin: coursePin,
        year: req.body.year,
        semester: req.body.semester,
        timezone: req.body.timezone,
        state: req.body.state,
        createdAt: new Date(),
        institution: req.body.institution,
        institutionURL: req.body.institutionURL,
        asynchronous: isAsynchronous,
        undecided: isUndecided,
      });
      // await until the newCourse is saved properly
      await newCourse.save();
      // add additional authors
      let startTime = req.body.startTime;
      let endTime = req.body.endTime;
      let day = req.body.day;
      if (startTime) {
        if (typeof startTime === "string") {
          let courseTime = new CourseTime({
            courseId: newCourse._id,
            day: day,
            startTime: startTime,
            endTime: endTime,
          });
          await courseTime.save();
        } else {
          for (let i = 0; i < startTime.length; i++) {
            let courseTime = new CourseTime({
              courseId: newCourse._id,
              day: day[i],
              startTime: startTime[i],
              endTime: endTime[i],
            });
            await courseTime.save();
          }
        }
      }
      res.redirect("/course/view/" + newCourse._id + "/10");
    } catch (e) {
      next(e);
    }

  };

exports.copyCourse = async (req, res, next) => {
  try {
    let oldCourse = await Course.findOne({ _id: req.params.courseId });
    coursePin = await getCoursePin();
    let newCourse = new Course({
      courseName: req.body.courseName,
      ownerId: req.user._id,
      instructor: req.user.userName,
      coursePin: coursePin,
      semester: req.body.semester,
      // city: req.body.city,
      state: oldCourse.state,
      createdAt: new Date(),
      institution: oldCourse.institution,
      institutionURL: oldCourse.institutionURL,
      officeHour: req.body.officeHour,
      officeHourLocation: req.body.officeHourLocation,
    });
    // await until the courseToEdit is saved properly
    await newCourse.save();

    // migrate existing instructor uploaded resources
    if (req.body.resourcesToCopy === "self") {
      let oldResources = await Resource.find({
        courseId: req.params.courseId,
        ownerId: req.user._id,
      });
      if (oldResources.length > 0) {
        for (let i = 0; i < oldResources.length; i++) {
          let oldResource = oldResources[i];
          console.log(oldResource.status);
          let newResource = new Resource({
            ownerId: req.user._id,
            courseId: newCourse._id,
            status: oldResource.status, // public/private to class/private to professors
            createdAt: new Date(),
            name: oldResource.name,
            description: oldResource.description,
            tags: oldResource.tags, // tags as array
            uri: oldResource.uri, // universal resource identifier specific to the resource
            state: oldResource.state,
            contentType: oldResource.contentType,
            mediaType: oldResource.mediaType,
            institution: oldResource.institution,
            yearOfCreation: oldResource.yearOfCreation, // content's actual creation time
            checkStatus: "approve",
          });
          await newResource.save();
        }
      }
    }
    res.redirect("/courses");
  } catch (e) {
    next(e);
  }
};

exports.updateCourse = async (req, res, next) => {
  try {
    let courseToEdit = await Course.findOne({ _id: req.params.courseId });
    courseToEdit.courseName = req.body.courseName;
    courseToEdit.semester = req.body.semester;
    courseToEdit.institution = req.body.institution;
    courseToEdit.institutionURL = req.body.institutionURL;
    courseToEdit.year = req.body.year;
    courseToEdit.timezone = req.body.timezone;
    courseToEdit.state = req.body.state;
    let tempId = req.body.ownerId;
    let tempUser = await User.findOne({ _id: tempId });
    courseToEdit.instructor = tempUser.userName;
    courseToEdit.ownerId = tempUser._id;

    await CourseTime.deleteMany({ courseId: req.params.courseId });
    let startTime = req.body.startTime;
    let endTime = req.body.endTime;
    let day = req.body.day;
    if (startTime) {
      if (typeof startTime === "string") {
        let courseTime = new CourseTime({
          courseId: courseToEdit._id,
          day: day,
          startTime: startTime,
          endTime: endTime,
        });
        await courseTime.save();
      } else {
        for (let i = 0; i < startTime.length; i++) {
          let courseTime = new CourseTime({
            courseId: courseToEdit._id,
            day: day[i],
            startTime: startTime[i],
            endTime: endTime[i],
          });
          await courseTime.save();
        }
      }
    }

    // await until the courseToEdit is saved properly
    await courseToEdit.save();
    res.redirect("/courses");
  } catch (e) {
    next(e);
  }
};

/**
 * get course pin, a 7-digit randomly generated number
 * @returns {Promise<number>}
 */
async function getCoursePin() {
  // this only works if there are many fewer than 10000000 courses
  // but that won't be an issue with this alpha version!
  let coursePin = padDigits(Math.floor(Math.random() * 10000000), 7);
  let lookupPin = await Course.find({ coursePin: coursePin }, "coursePin");

  while (lookupPin && lookupPin.length > 0) {
    coursePin = padDigits(Math.floor(Math.random() * 10000000), 7);
    lookupPin = await Course.find({ coursePin: coursePin }, "coursePin");
  }
  return coursePin;
}

function padDigits(number, digits) {
  return (
    Array(Math.max(digits - String(number).length + 1, 0)).join(0) + number
  );
}

exports.showOneCourse = async (req, res, next) => {
  let courseId = req.params.courseId;
  try {
    res.locals.courseInfo = await Course.findOne({ _id: courseId });
    next();
  } catch (e) {
    next(e);
  }
};

exports.joinCourse = async (req, res, next) => {
  try {
    let coursePin = req.body.coursePin;

    let courseInfo = await Course.findOne({ coursePin: coursePin });

    let newCourseMember = new CourseMember({
      studentId: req.user._id,
      courseId: courseInfo._id,
      createdAt: new Date(),
    });

    await newCourseMember.save();
    console.log("courseMember saved");

    let enrolledCourses = req.user.enrolledCourses || [];

    if (containsString(enrolledCourses, courseInfo._id)) {
      console.log("Enrolled already!");
      res.send("Enrolled already");
      return;
    }
    // update user's enrolledCourses field
    await req.user.enrolledCourses.push(courseInfo._id);
    await req.user.save();
    console.log("update finish");
    res.redirect("/course/view/" + courseInfo._id + "/10");
  } catch (e) {
    next(e);
  }
};

function containsString(list, elt) {
  let found = false;
  list.forEach((e) => {
    if (JSON.stringify(e) === JSON.stringify(elt)) {
      found = true;
    }
  });
  return found;
}

// function editCourseTimes(courseTimes){
//     for (courseTime in courseTimes) {
//         courseTime.startTime = "edited"
//         courseTime.endTime = "edited"
//     }
// }

// exports.showSchedule = async (req, res) => {

//     const d = new Date();
//     let year = d.getFullYear();
//     let month = d.getMonth();

//     let sem = "fall";
//     if (month<6){
//         sem ="spring"
//     }else if(month<9){
//         sem ="summer"
//     }

//     let courseTimes = await CourseTime.find({}, {'_id': 0, '__v': 0});
//     // editCourseTimes(courseTimes)
//     // console.log(courseTimes);
//     let courses = await Course.find({year: year, semester: sem}, {
//         'ownerId': 1,
//         'institutionURL': 1,
//         '_id': 1,
//         'state': 1,
//         'courseName': 1,
//         'timezone': 1,
//         'semester': 1,
//         'year': 1,
//         'instructor': 1,
//         'institution': 1,
//     })

//     if (month==0){
//         courses = await Course.find({year: year, $or: [{semester: sem}, {semester: "january"}]}, {
//             'ownerId': 1,
//             'institutionURL': 1,
//             '_id': 1,
//             'state': 1,
//             'courseName': 1,
//             'timezone': 1,
//             'semester': 1,
//             'year': 1,
//             'instructor': 1,
//             'institution': 1,
//         })
//     }

//     res.render('./pages/courses-schedule', {
//         courseTimes: courseTimes,
//         courses: courses
//     })
// }

exports.showSchedule = async (req, res) => {
  try {
    let courseTimes = await CourseTime.find({}, { _id: 0, __v: 0 });

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;

    let query = { year: currentYear };
    
    // Adjust the query based on the current month.
    if (currentMonth >= 1 && currentMonth <= 6) {
      // If it's currently the first half of the year, fetch courses from "spring" or "january".
      query.$or = [{ semester: "spring" }, { semester: "january" }];
    } else if (currentMonth >= 7 && currentMonth <= 12) {
      // If it's the second half of the year, fetch only "fall" semester courses.
      query.semester = "fall";
    }

    let courses = await Course.find(query, {
      ownerId: 1,
      institutionURL: 1,
      _id: 1,
      state: 1,
      courseName: 1,
      timezone: 1,
      semester: 1,
      year: 1,
      instructor: 1,
      institution: 1,
      asynchronous: 1, 
      undecided: 1, 
    });

    console.log(courses);
    res.render("./pages/courses-schedule", {
      courseTimes: courseTimes,
      courses: courses,
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send("Internal Server Error");
  }
};

exports.showCourses = async (req, res) => {
  let courseTimes = await CourseTime.find({}, { _id: 0, __v: 0 });
  let courses = await Course.find(
    {},
    {
      ownerId: 1,
      institutionURL: 1,
      _id: 1,
      state: 1,
      courseName: 1,
      timezone: 1,
      semester: 1,
      year: 1,
      instructor: 1,
      institution: 1,
    }
  ).sort({year: -1});

  res.render("./pages/course-pastList", {
    courseTimes: courseTimes,
    courses: courses,
  });
};

exports.deleteCourse = async (req, res) => {
  await Course.deleteOne({ _id: req.params.courseId });
  await CourseTime.deleteMany({ courseId: req.params.courseId });
  let users = await User.find();
  // clean user object fields
  for (let i = 0; i < users.length; i++) {
    users[i].enrolledCourses.remove(req.params.courseId);
    await users[i].save();
  }
  res.redirect("back");
};

exports.assignTA = async (req, res) => {
  let taInfo = await User.findOne({
    $or: [{ workEmail: req.body.email }, { googleemail: req.body.email }],
  });
  // if TA profile is not in our system, set up a new one
  if (!taInfo) {
    let email = req.body.email;
    let name = "changeMe";
    let status = "TA";
    let password = await getRandomPassword();
    let newUser = new User({
      workEmail: email,
      userName: name,
      password: password,
      status: status,
    });
    await newUser.save();
    let newTA = new TA({
      email: email,
    });
    console.log("new TA set");
    // await until the newCourse is saved properly
    await newTA.save();
    let userId = newUser._id;
    console.log("id: ", userId);
    let url = "https://www.enactnetwork.org/login";
    const sgMail = require("@sendgrid/mail");
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
      to: email,
      from: "enact@brandeis.edu",
      subject: "ENACT Digital Platform: you have one new notification.",
      text: "ENACT Digital Platform: you have one new notification.",
      html:
        "Hi,<br>" +
        "<br>" +
        "Your TA profile is set by an ENACT faculty fellow: " +
        req.user.userName +
        ". <br>The default password is: " +
        "<b>" +
        newUser.password +
        "</b>" +
        "<br>Please remember to change your password by navigating to <b>People & Networking -> Update profile</b> to change your password" +
        "<br>" +
        "<b>Click <a href=" +
        url +
        ">" +
        "here" +
        "</a>" +
        " to login</b>" +
        "<br><br>" +
        "ENACT Support Team",
    };
    try {
      await sgMail.send(msg);
    } catch (e) {
      console.log("SENDGRID EXCEPTION: ", e);
    }
    // points to newUser
    taInfo = newUser;
  }

  // update enrollment
  let enrolledCourses = taInfo.enrolledCourses || [];
  if (containsString(enrolledCourses, req.params.courseId)) {
    console.log("Enrolled already!");
  } else {
    // update user's enrolledCourses field
    await taInfo.enrolledCourses.push(req.params.courseId);
    await taInfo.save();
  }
  let currCourse = await Course.findOne({ _id: req.params.courseId });

  let existOrNot = await TA.findOne({ email: req.body.email });
  // if this ta's email is already stored in DB, no need to create a new entry
  if (!existOrNot) {
    let ta = new TA({
      email: req.body.email,
    });
    await ta.save();
  }
  if (currCourse.tas) {
    currCourse.tas.push(taInfo._id);
    await currCourse.save();
  } else {
    currCourse.tas = [taInfo._id];
    await currCourse.save();
  }
  res.redirect("back");
};

async function getRandomPassword() {
  // this only works if there are many fewer than 10000000 courses
  // but that won't be an issue with this alpha version!
  return Math.floor(Math.random() * 10000000);
}
