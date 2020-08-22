'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectID = mongoose.Schema.Types.ObjectID;

const EventSchema = Schema({
    ownerId: ObjectID,
    title: String,
    start: Date,
    end: Date,
    uri: String,
    description: String,
    className: String,
    icon: String
});

module.exports = mongoose.model('Event', EventSchema);
