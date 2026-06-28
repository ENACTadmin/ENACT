'use strict';
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;
const ObjectID = mongoose.Schema.Types.ObjectID;

const userSchema = Schema({
    googleid: String,
    googletoken: String,
    googlename: String,
    googleemail: String,
    userName: String,
    password: String,
    profilePicURL: String,
    status: String, // status of the user: student/faculty/admin
    linkedInURL: String,
    hasFullAccess: Boolean,
    state: String,
    enrolledCourses: [ObjectID],
    workEmail: String,
    personalEmail: String,
    phoneNumber: String,
    affiliation: String,
    department: String,
    pronoun: String,
    personalWebsiteURL: String,
    networkCheck: String,
    graduationYear: Number
});

userSchema.pre('save', async function (next) {
    if (!this.password || this.password.startsWith('$2b$')) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});

userSchema.index({ workEmail: 1 });
userSchema.index({ googleemail: 1 });
userSchema.index({ status: 1 });

userSchema.methods.comparePassword = function (candidatePassword) {
    return bcrypt.compareSync(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
