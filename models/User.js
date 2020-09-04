'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectID = mongoose.Schema.Types.ObjectID;

const userSchema = Schema({
    googleid: String,
    googletoken: String,
    googlename: String,
    googleemail: String,
    userName: String,
    profilePicURL: String,
    status: String, // status of the user: student/faculty/admin
    zipcode: String,
    city: String,
    state: String,
    enrolledCourses: [ObjectID],
    ownedCourses: [ObjectID],
    workEmail: String,
    personalEmail: String,
    phoneNumber: String,
    affiliation: String,
    bio: String // required for faculty members
});

module.exports = mongoose.model('User', userSchema);
