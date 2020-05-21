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
    status: String, // status of the user: student/faculty/administrator
    zipcode: String,
    city: String,
    state: String,
    enrolledCourses: [ObjectID],
    ownedCourses: [ObjectID],

});

module.exports = mongoose.model('User', userSchema);
