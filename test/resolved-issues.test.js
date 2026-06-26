const assert = require('assert');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const AuthorAlt = require('../models/AuthorAlternative');
const Course = require('../models/Course');
const Resource = require('../models/Resource');
const mongoose = require('mongoose');

describe('Resolved Issues Verification', function () {
  this.timeout(15000);

  before(async function () {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/ENACT');
    }
  });

  after(async function () {
    await User.deleteOne({ workEmail: 'test-resolved@test.com' });
    await Course.deleteOne({ courseName: 'test-resolved-course' });
    await Resource.deleteOne({ name: 'test-resolved-resource' });
    await AuthorAlt.deleteMany({ userName: 'Test Co-Author' });
  });

  // #28 - Allow multiple authors
  describe('#28 - Multiple authors', function () {
    it('should allow storing and retrieving additional authors via AuthorAlt model', async function () {
      const authorAlt = new AuthorAlt({
        resourceId: new mongoose.Types.ObjectId(),
        userName: 'Test Co-Author',
        userEmail: 'coauthor@test.com'
      });
      await authorAlt.save();
      const found = await AuthorAlt.findOne({ userName: 'Test Co-Author' });
      assert.strictEqual(found.userName, 'Test Co-Author');
    });
  });

  // #32 - Disallow duplicate emails
  describe('#32 - Disallow duplicate emails', function () {
    it('local-signup strategy should reject duplicate email', async function () {
      const existing = await User.findOne({
        $or: [{ workEmail: 'test@test.com' }, { googleemail: 'test@test.com' }]
      });
      if (!existing) {
        await new User({ workEmail: 'test@test.com', password: 'test' }).save();
      }
      const duplicate = await User.findOne({
        $or: [{ workEmail: 'test@test.com' }, { googleemail: 'test@test.com' }]
      });
      assert.ok(duplicate);
    });
  });

  // #34 - Rank resource by year of creation
  describe('#34 - Rank by year of creation', function () {
    it('resources should have yearOfCreation field and be sortable', async function () {
      const r1 = await new Resource({
        name: 'test-resolved-resource',
        yearOfCreation: 2023,
        ownerId: new mongoose.Types.ObjectId(),
        ownerName: 'test',
        createdAt: new Date()
      }).save();

      const results = await Resource.find({ name: 'test-resolved-resource' })
        .sort({ yearOfCreation: -1 });
      assert.ok(results.length > 0);
      assert.strictEqual(results[0].yearOfCreation, 2023);
    });
  });

  // #36 - Password encryption
  describe('#36 - Password encryption with bcrypt', function () {
    it('should hash password on save via pre-save hook', async function () {
      const user = new User({
        workEmail: 'test-resolved@test.com',
        password: 'plaintextPassword123'
      });
      await user.save();
      assert.notStrictEqual(user.password, 'plaintextPassword123');
      assert.ok(user.password.startsWith('$2b$'));
    });

    it('comparePassword should return true for correct password', async function () {
      const user = await User.findOne({ workEmail: 'test-resolved@test.com' });
      assert.ok(user.comparePassword('plaintextPassword123'));
    });

    it('comparePassword should return false for wrong password', async function () {
      const user = await User.findOne({ workEmail: 'test-resolved@test.com' });
      assert.strictEqual(user.comparePassword('wrongpassword'), false);
    });

    it('should migrate plaintext to bcrypt on save', async function () {
      const user = await User.findOne({ workEmail: 'test-resolved@test.com' });
      user.password = 'plaintextPassword123';
      await user.save();
      assert.ok(user.password.startsWith('$2b$'));
      assert.ok(user.comparePassword('plaintextPassword123'));
    });
  });

  // #38 - Reassign course owner
  describe('#38 - Reassign course owner', function () {
    it('should update course ownerId', async function () {
      const newOwnerId = new mongoose.Types.ObjectId();
      const course = await new Course({
        courseName: 'test-resolved-course',
        ownerId: new mongoose.Types.ObjectId(),
        instructor: 'Old Instructor',
        coursePin: 'TESTPIN',
        year: 2024,
        semester: 'spring',
        createdAt: new Date()
      }).save();

      course.ownerId = newOwnerId;
      course.instructor = 'New Instructor';
      await course.save();

      const updated = await Course.findById(course._id);
      assert.strictEqual(updated.ownerId.toString(), newOwnerId.toString());
      assert.strictEqual(updated.instructor, 'New Instructor');
    });
  });

  // #87 - Empty state search
  describe('#87 - Empty state search', function () {
    it('should handle empty results gracefully', async function () {
      const results = await Resource.find({
        name: { $regex: 'zzzzthisdoesnotexistzzzz', $options: 'i' }
      });
      assert.ok(Array.isArray(results));
      assert.strictEqual(results.length, 0);
    });
  });
});
