'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const objectID = mongoose.Schema.Types.ObjectID;

const authorAltSchema = Schema({
    resourceId: objectID,
    userName: String,
    userEmail: String
});

module.exports = mongoose.model('AuthorAlt', authorAltSchema);