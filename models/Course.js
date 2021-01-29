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
    year: Number,
    semester: String,
    createdAt: Date,
    institution: String,
    timezone: String,
    institutionURL: String
});

module.exports = mongoose.model('Course', courseSchema);
