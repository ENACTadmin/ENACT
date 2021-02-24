'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectID = mongoose.Schema.Types.ObjectID;

const Word2IdSchema = Schema({
    word: {type: String, index: true},
    ids: [ObjectID]
});

module.exports = mongoose.model('Word2Id', Word2IdSchema);
