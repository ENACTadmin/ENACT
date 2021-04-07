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
    password: String,
    profilePicURL: String,
    status: String, // status of the user: student/faculty/admin
    linkedInURL: String,
    state: String,
    enrolledCourses: [ObjectID],
    workEmail: String,
    personalEmail: String,
    phoneNumber: String,
    affiliation: String,
    department: String,
    pronoun: String,
    personalWebsiteURL: String,
    networkCheck: String,
    graduationYear: Number
});

module.exports = mongoose.model('User', userSchema);
