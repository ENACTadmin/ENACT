"use strict";
const Course = require("../models/Course");
const User = require("../models/User");
const Tag = require("../models/Tag");
const Resource = require("../models/Resource");
const ResourceSet = require("../models/ResourceSet");
const AuthorAlt = require("../models/AuthorAlternative");
const mongoose = require("mongoose");

//TODO Caching!!!!

// Function to retrieve all resources with expanded owner and course information
exports.getAllResources = async (req, res, next) => {
  try {
    // Define the aggregation pipeline
    const resourcesPipeline = [
      // Join with the User collection to replace `ownerId` with `ownerName`
      {
        $lookup: {
          from: "users", // The name of the User collection
          localField: "ownerId", // The field in the Resource collection
          foreignField: "_id", // The field in the User collection
          as: "ownerDetails" // Name for the new field in the resulting documents
        }
      },
      { $unwind: "$ownerDetails" }, // Convert `ownerDetails` array into a single object
      // Join with the Course collection to replace `courseId` with the course name
      {
        $lookup: {
          from: "courses", // The name of the Course collection
          localField: "courseId", // The field in the Resource collection
          foreignField: "_id", // The field in the Course collection
          as: "courseDetails" // Name for the new field in the resulting documents
        }
      },
      { $unwind: "$courseDetails" }, // Convert `courseDetails` array into a single object
      // Project only the necessary fields and exclude `facultyId`
      {
        $project: {
          _id: 1,
          name: 1,
          description: 1,
          tags: 1,
          uri: 1,
          state: 1,
          resourceType: 1,
          institution: 1,
          yearOfCreation: 1,
          checkStatus: 1,
          contentType: 1,
          mediaType: 1,
          createdAt: 1,
          authorName: "$ownerDetails.userName", // Replace `ownerId` with `userName`
          courseName: "$courseDetails.courseName", // Replace `courseId` with `courseName`
          facultyId: 1 // Exclude `facultyId`
        }
      }
    ];

    // Execute the aggregation pipeline
    const allResources = await Resource.aggregate(resourcesPipeline);

    // Return the aggregated array of resources
    res.json(allResources);
  } catch (e) {
    // Handle any errors that occur during the process
    next(e);
  }
};

exports.getResourceById = async (req, res, next) => {
  try {
    // Get the `id` from the request parameters
    const { id } = req.params;

    // Convert the `id` parameter to a valid ObjectId
    const objectId = new mongoose.Types.ObjectId(id);

    // Define the aggregation pipeline
    const resourcesPipeline = [
      // Match only the resource with the given ObjectId
      { $match: { _id: objectId } },

      // Join with the User collection to replace `ownerId` with `ownerName`
      {
        $lookup: {
          from: "users", // The name of the User collection
          localField: "ownerId", // The field in the Resource collection
          foreignField: "_id", // The field in the User collection
          as: "ownerDetails" // Name for the new field in the resulting documents
        }
      },
      { $unwind: { path: "$ownerDetails", preserveNullAndEmptyArrays: true } },

      // Join with the Course collection to replace `courseId` with the course name
      {
        $lookup: {
          from: "courses", // The name of the Course collection
          localField: "courseId", // The field in the Resource collection
          foreignField: "_id", // The field in the Course collection
          as: "courseDetails" // Name for the new field in the resulting documents
        }
      },
      { $unwind: { path: "$courseDetails", preserveNullAndEmptyArrays: true } },

      // Project only the necessary fields
      {
        $project: {
          _id: 1,
          name: 1,
          description: 1,
          tags: 1,
          uri: 1,
          state: 1,
          resourceType: 1,
          institution: 1,
          yearOfCreation: 1,
          checkStatus: 1,
          contentType: 1,
          mediaType: 1,
          createdAt: 1,
          authorName: "$ownerDetails.userName", // Replace `ownerId` with `userName`
          courseName: "$courseDetails.courseName" // Replace `courseId` with `courseName`
        }
      }
    ];

    // Execute the aggregation pipeline
    const resources = await Resource.aggregate(resourcesPipeline);

    // If no resource is found, return a 404 response
    if (!resources.length) {
      return res.status(404).json({ message: "Resource not found" });
    }

    // Return the single aggregated resource
    res.json(resources[0]);
  } catch (e) {
    // Handle any errors that occur during the process
    console.error("Error in getResourceById:", e);
    next(e);
  }
};

exports.getResourcesByKeyWord = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search; // Retrieve the search keyword from query parameters

    const matchQuery = {};
    if (search) {
      matchQuery.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { "courseDetails.courseName": { $regex: search, $options: "i" } }
      ];
    }

    const resourcesPipeline = [
      // Lookup and unwind steps as before...
      { $match: matchQuery }, // Use the matchQuery to filter results
      // Remaining pipeline stages...
      { $skip: skip },
      { $limit: limit }
    ];

    const totalCountPipeline = [{ $match: matchQuery }, { $count: "total" }];
    const [totalCountResult] = await Resource.aggregate(totalCountPipeline);
    const totalCount = totalCountResult ? totalCountResult.total : 0;

    const allResources = await Resource.aggregate(resourcesPipeline);
    const totalPages = Math.ceil(totalCount / limit);

    res.json({
      data: allResources,
      totalPages: totalPages,
      currentPage: page,
      itemsPerPage: limit
    });
  } catch (e) {
    console.error("Error in getResources:", e);
    next(e);
  }
};

exports.getResourceStats = async (req, res, next) => {
  try {
    // Aggregate statistics for overall count, count per author, count per tag, and per status

    // Total resources count
    const totalResourcesPipeline = [{ $count: "total" }];

    // Total approved resources
    const totalApprovedResourcesPipeline = [
      { $match: { checkStatus: "approve" } },
      { $count: "total" }
    ];

    // Total resources with "privateToENACT" status
    const totalPrivateToENACTPipeline = [
      { $match: { status: "privateToENACT" } },
      { $count: "total" }
    ];

    // Group resources by author
    const totalPerAuthorPipeline = [
      {
        $lookup: {
          from: "users",
          localField: "ownerId",
          foreignField: "_id",
          as: "ownerDetails"
        }
      },
      { $unwind: "$ownerDetails" },
      {
        $group: {
          _id: "$ownerDetails.userName",
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          authorName: "$_id",
          count: 1,
          _id: 0
        }
      }
    ];

    // Group resources by tag
    const totalPerTagPipeline = [
      { $unwind: "$tags" },
      {
        $group: {
          _id: "$tags",
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          tag: "$_id",
          count: 1,
          _id: 0
        }
      }
    ];

    // Group resources by year of creation
    const totalPerYearPipeline = [
      {
        $group: {
          _id: "$yearOfCreation",
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          year: "$_id",
          count: 1,
          _id: 0
        }
      }
    ];

    // Fetch results using aggregation pipelines
    const [totalResources] = await Resource.aggregate(totalResourcesPipeline);
    const [totalApproved] = await Resource.aggregate(
      totalApprovedResourcesPipeline
    );
    const [totalPrivateToENACT] = await Resource.aggregate(
      totalPrivateToENACTPipeline
    );
    const totalPerAuthor = await Resource.aggregate(totalPerAuthorPipeline);
    const totalPerTag = await Resource.aggregate(totalPerTagPipeline);
    const totalPerYear = await Resource.aggregate(totalPerYearPipeline);

    // Construct the final statistics response
    const stats = {
      totalResources: totalResources ? totalResources.total : 0,
      totalApproved: totalApproved ? totalApproved.total : 0,
      totalPrivateToENACT: totalPrivateToENACT ? totalPrivateToENACT.total : 0,
      totalPerAuthor: totalPerAuthor,
      totalPerTag: totalPerTag,
      totalPerYear: totalPerYear
    };

    // Send back the statistics
    res.json(stats);
  } catch (e) {
    next(e);
  }
};

// exports.getResources = async (req, res, next) => {
//     try {
//         // Retrieve and log page and limit parameters
//         const page = parseInt(req.query.page, 10) || 1;
//         const limit = parseInt(req.query.limit, 10) || 10;
//         const skip = (page - 1) * limit;

//         // console.log(`Pagination - Page: ${page}, Limit: ${limit}, Skip: ${skip}`);

//         // Define the aggregation pipeline with pagination
//         const resourcesPipeline = [
//             {
//                 $lookup: {
//                     from: "users",
//                     localField: "ownerId",
//                     foreignField: "_id",
//                     as: "ownerDetails"
//                 }
//             },
//             { $unwind: { path: "$ownerDetails", preserveNullAndEmptyArrays: true } },
//             {
//                 $lookup: {
//                     from: "courses",
//                     localField: "courseId",
//                     foreignField: "_id",
//                     as: "courseDetails"
//                 }
//             },
//             { $unwind: { path: "$courseDetails", preserveNullAndEmptyArrays: true } },
//             {
//                 $project: {
//                     _id: 1,
//                     name: 1,
//                     description: 1,
//                     tags: 1,
//                     uri: 1,
//                     state: 1,
//                     resourceType: 1,
//                     institution: 1,
//                     yearOfCreation: 1,
//                     checkStatus: 1,
//                     contentType: 1,
//                     mediaType: 1,
//                     createdAt: 1,
//                     authorName: "$ownerDetails.userName",
//                     courseName: "$courseDetails.courseName",
//                     facultyId: 1
//                 }
//             },
//             // Add pagination with skip and limit
//             { $skip: skip },
//             { $limit: limit }
//         ];

//         // Count total resources without pagination
//         const totalCountPipeline = [
//             { $count: "total" }
//         ];

//         const [totalCount] = await Resource.aggregate(totalCountPipeline);

//         // Execute the main aggregation pipeline
//         const allResources = await Resource.aggregate(resourcesPipeline);

//         // Calculate total pages
//         const totalPages = totalCount ? Math.ceil(totalCount.total / limit) : 0;

//         // Return the paginated results with pagination details
//         res.json({
//             data: allResources,
//             totalPages: totalPages,
//             currentPage: page,
//             itemsPerPage: limit
//         });
//     } catch (e) {
//         // Handle errors and log issues
//         console.error("Error in getAllResources:", e);
//         next(e);
//     }
// };
exports.getResources = async (req, res, next) => {
  try {
    // Retrieve and log page and limit parameters
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    // Define the aggregation pipeline with pagination
    const resourcesPipeline = [
      {
        $lookup: {
          from: "users",
          localField: "ownerId",
          foreignField: "_id",
          as: "ownerDetails"
        }
      },
      { $unwind: { path: "$ownerDetails", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "courses",
          localField: "courseId",
          foreignField: "_id",
          as: "courseDetails"
        }
      },
      { $unwind: { path: "$courseDetails", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 1,
          name: 1,
          description: 1,
          tags: 1,
          uri: 1,
          state: 1,
          resourceType: 1,
          institution: 1,
          yearOfCreation: 1,
          checkStatus: 1,
          contentType: 1,
          mediaType: 1,
          createdAt: 1,
          authorName: "$ownerDetails.userName",
          courseName: "$courseDetails.courseName",
          facultyId: 1
        }
      },
      // Add pagination with skip and limit
      { $skip: skip },
      { $limit: limit }
    ];

    // Count total resources without pagination
    const totalCountPipeline = [
      {
        $group: {
          _id: null,
          total: { $sum: 1 }
        }
      }
    ];

    const [totalCountResult] = await Resource.aggregate(totalCountPipeline);
    const totalCount = totalCountResult ? totalCountResult.total : 0;

    // Execute the main aggregation pipeline
    const allResources = await Resource.aggregate(resourcesPipeline);

    // Calculate total pages
    const totalPages = Math.ceil(totalCount / limit);

    // Return the paginated results with pagination details
    res.json({
      data: allResources,
      totalPages: totalPages,
      currentPage: page,
      itemsPerPage: limit
    });
  } catch (e) {
    // Handle errors and log issues
    console.error("Error in getResources:", e);
    next(e);
  }
};

// Function to aggregate and render resource statistics
exports.renderResourceStatsPage = async (req, res, next) => {
  try {
    // Total resources count
    const totalResourcesPipeline = [{ $count: "total" }];

    // Total approved resources
    const totalApprovedResourcesPipeline = [
      { $match: { checkStatus: "approve" } },
      { $count: "total" }
    ];

    // Total resources with "privateToENACT" status
    const totalPrivateToENACTPipeline = [
      { $match: { status: "privateToENACT" } },
      { $count: "total" }
    ];

    // Group resources by author
    const totalPerAuthorPipeline = [
      {
        $lookup: {
          from: "users",
          localField: "ownerId",
          foreignField: "_id",
          as: "ownerDetails"
        }
      },
      { $unwind: "$ownerDetails" },
      {
        $group: {
          _id: "$ownerDetails.userName",
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          authorName: "$_id",
          count: 1,
          _id: 0
        }
      }
    ];

    // Group resources by tag
    const totalPerTagPipeline = [
      { $unwind: "$tags" },
      {
        $group: {
          _id: "$tags",
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          tag: "$_id",
          count: 1,
          _id: 0
        }
      }
    ];

    // Group resources by year of creation
    const totalPerYearPipeline = [
      {
        $group: {
          _id: "$yearOfCreation",
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          year: "$_id",
          count: 1,
          _id: 0
        }
      }
    ];

    // Fetch results using aggregation pipelines
    const [totalResources] = await Resource.aggregate(totalResourcesPipeline);
    const [totalApproved] = await Resource.aggregate(
      totalApprovedResourcesPipeline
    );
    const [totalPrivateToENACT] = await Resource.aggregate(
      totalPrivateToENACTPipeline
    );
    const totalPerAuthor = await Resource.aggregate(totalPerAuthorPipeline);
    const totalPerTag = await Resource.aggregate(totalPerTagPipeline);
    const totalPerYear = await Resource.aggregate(totalPerYearPipeline);

    // Pass data to the EJS template
    res.render("pages/stats/resourceStats", {
      totalResources: totalResources ? totalResources.total : 0,
      totalApproved: totalApproved ? totalApproved.total : 0,
      totalPrivateToENACT: totalPrivateToENACT ? totalPrivateToENACT.total : 0,
      totalPerAuthor: totalPerAuthor,
      totalPerTag: totalPerTag,
      totalPerYear: totalPerYear
    });
  } catch (e) {
    next(e);
  }
};
