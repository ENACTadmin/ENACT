'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

let ResourceSet = Schema({
    ownerId: ObjectId,
    name: String,
    resources: [ObjectId],
    createdAt: Date
});

module.exports = mongoose.model('ResourceSet', ResourceSet);