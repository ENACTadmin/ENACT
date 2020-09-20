'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const objectID = mongoose.Schema.Types.ObjectID;

const courseSchema = Schema({
    ownerId: objectID,
    instructor: String,
    courseName: String,
    coursePin: String, // pin number to join the class
    tas: [objectID],
    zipcode: String,
    state: String,
    semester: String,
    createdAt: Date,
    institution: String,
    officeHour: String,
    officeHourLocation: String
});

module.exports = mongoose.model('Course', courseSchema);
