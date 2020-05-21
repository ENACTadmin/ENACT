'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

let courseMemberSchema = Schema({
    studentId: ObjectId,
    courseId: ObjectId,
    createdAt: Date,
});

module.exports = mongoose.model('CourseMember', courseMemberSchema);