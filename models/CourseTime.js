'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const objectID = mongoose.Schema.Types.ObjectID;

const courseTimeSchema = Schema({
    courseId: objectID,
    day: String,
    startTime: String,
    endTime: String,
    // repeat: Boolean
});

module.exports = mongoose.model('CourseTime', courseTimeSchema);