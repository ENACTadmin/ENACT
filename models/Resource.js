"use strict";
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectID = mongoose.Schema.Types.ObjectID;

const resourceSchema = Schema({
  ownerId: ObjectID,
  ownerName: String,
  courseId: ObjectID,
  status: String, // finalPublic (open to the public and displayed on the index page)/public (open to public but NOT displayed on the index page)/partPublic (requested public access but not approved by admin yet)/private to ENACT/private to professors
  createdAt: Date,
  name: String,
  description: String,
  tags: [String], // Area of the resource (Optional)
  uri: String, // universal resource identifier specific to the resource
  state: String,
  mediaType: String, // video/text document ...
  contentType: String, // pitch/research...
  institution: String,
  yearOfCreation: Number, // content's actual creation time
  facultyId: ObjectID, // belong to which faculty to approve
  checkStatus: String, // what is the status of student resources that required faculty to check, UnderReview/deny/approve
  review: String, // given by faculty to student resources
  views: { type: Number, required: false, default: 0 }
});

// resourceSchema.ensureIndex({name: "text", ownerName: "text", description: "text", tags: "text", state: "text", mediaType: "text", contentType: "text", institution: "text", yearOfCreation: "text"})
module.exports = mongoose.model("Resource", resourceSchema);
