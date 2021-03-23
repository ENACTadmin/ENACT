'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

let TASchema = Schema({
    courseId: [ObjectId],
    email: String, // work email that should not change
    facultyId: [ObjectId]
});

module.exports = mongoose.model('TA', TASchema);