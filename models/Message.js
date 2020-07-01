'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const messageSchema = Schema({
    relevantResourceId: ObjectId,
    senderId: ObjectId,
    receiverId: ObjectId,
    sentBy: ObjectId,
    receivedBy: ObjectId,
    subject: String,
    message: String,
    createdAt: Date
});

module.exports = mongoose.model('message', messageSchema);
