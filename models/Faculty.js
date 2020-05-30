'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

let FacultySchema = Schema({
    email: String, // work email that should not change
    status: String,
    approvedBy: ObjectId
});

module.exports = mongoose.model('Faculty', FacultySchema);