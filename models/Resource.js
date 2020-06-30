'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectID = mongoose.Schema.Types.ObjectID;

const resourceSchema = Schema({
    ownerId: ObjectID,
    ownerName: String,
    courseId: ObjectID,
    status: String, // public/private to class/private to professors
    createdAt: Date,
    name: String,
    description: String,
    tags: [String], // tag the resource
    uri: String, // universal resource identifier specific to the resource
    state: String,
    resourceType: String, // video/text document ...
    institution: String,
    yearOfCreation: Number, // content's actual creation time
    facultyId: ObjectID, //belong to which faculty to approve
    checkStatus: String, //what is the status of student resources that required faculty to check, UnderReview/deny/approve
    publicStatus: String, //yes or no
    review: String  // given by faculty to student resources
});

module.exports = mongoose.model('Resource', resourceSchema);
