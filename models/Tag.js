'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const objectID = mongoose.Schema.Types.ObjectID;

const tagSchema = Schema({
    ownerId: objectID,
    ownerName: String,
    ownerStatus: String,
    status: String,
    info: String,
    reason: String,
    // contentType: String
});

module.exports = mongoose.model('Tag', tagSchema);