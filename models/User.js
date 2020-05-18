'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
    classCodes: [String],
});

module.exports = mongoose.model('User', userSchema);
