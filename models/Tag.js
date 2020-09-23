'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const objectID = mongoose.Schema.Types.ObjectID;

const tagSchema = Schema({
    ownerId: objectID,
    ownerStatus: String,
    status: String,
    info: String
});

module.exports = mongoose.model('Tag', tagSchema);