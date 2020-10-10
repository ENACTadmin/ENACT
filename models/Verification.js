'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const verificationSchema = Schema({
    email: {type: String, index: true}
});

module.exports = mongoose.model('Verification', verificationSchema);