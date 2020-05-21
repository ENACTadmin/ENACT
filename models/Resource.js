'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectID = mongoose.Schema.Types.ObjectID;

const resourceSchema = Schema({
    ownerId: ObjectID,
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
    yearOfCreation: Number // content's actual creation time
});

module.exports = mongoose.model('Resource', resourceSchema);
