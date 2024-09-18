'use strict';
const Course = require('../models/Course');
const User = require('../models/User');
const Tag = require('../models/Tag');
const Resource = require('../models/Resource');
const ResourceSet = require('../models/ResourceSet');
const AuthorAlt = require('../models/AuthorAlternative')
const mongoose = require('mongoose');


// Function to retrieve all resources
// exports.getAllResources = async (req, res, next) => {
//     try {
//         // Retrieve all resource documents
//         const allResources = await Resource.find({});
//         // Optionally, modify or filter the documents as needed here

//         // Return or send the array of all resources
//         res.json(allResources);
//     } catch (e) {
//         // Handle any errors that occur during the process
//         next(e);
//     }
// };


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
            as: "ownerDetails", // Name for the new field in the resulting documents
          },
        },
        { $unwind: { path: "$ownerDetails", preserveNullAndEmptyArrays: true } },
  
        // Join with the Course collection to replace `courseId` with the course name
        {
          $lookup: {
            from: "courses", // The name of the Course collection
            localField: "courseId", // The field in the Resource collection
            foreignField: "_id", // The field in the Course collection
            as: "courseDetails", // Name for the new field in the resulting documents
          },
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
            courseName: "$courseDetails.courseName", // Replace `courseId` with `courseName`
          },
        },
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

 



  // Function to retrieve resources filtered by a specific tag with pagination
  exports.getResourcesByTag = async (req, res, next) => {
    try {
        // Extract the tag from the route parameters
        const { tag } = req.params;
        if (!tag) {
            return res.status(400).json({ error: "Tag parameter is missing" });
        }

        // Get pagination parameters from query, default to page 1 and 10 items per page
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const skip = (page - 1) * limit;

        // Define the aggregation pipeline with a match stage to filter by the tag
        const resourcesPipeline = [
            {
                $match: {
                    tags: tag
                }
            },
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
            },
            // Apply pagination with skip and limit
            { $skip: skip },
            { $limit: limit }
        ];

        // Get the total number of documents matching the tag
        const totalDocuments = await Resource.countDocuments({ tags: tag });

        // Execute the aggregation pipeline
        const resourcesByTag = await Resource.aggregate(resourcesPipeline);

        // Calculate the total number of pages
        const totalPages = Math.ceil(totalDocuments / limit);

        // Return the filtered resources with pagination info
        res.json({
            data: resourcesByTag,
            currentPage: page,
            totalPages: totalPages,
            itemsPerPage: limit
        });
    } catch (e) {
        // Handle errors and pass to the next middleware for error logging
        console.error("Error in getResourcesByTag:", e);
        next(e);
    }
};


exports.getResourceStats = async (req, res, next) => {
    try {
        // Aggregate statistics for overall count, count per author, count per tag, and per status

        // Total resources count
        const totalResourcesPipeline = [
            { $count: "total" }
        ];

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
        const [totalApproved] = await Resource.aggregate(totalApprovedResourcesPipeline);
        const [totalPrivateToENACT] = await Resource.aggregate(totalPrivateToENACTPipeline);
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




exports.getResources = async (req, res, next) => {
    try {
        // Retrieve and log page and limit parameters
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const skip = (page - 1) * limit;

        console.log(`Pagination - Page: ${page}, Limit: ${limit}, Skip: ${skip}`);

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
            { $count: "total" }
        ];

        const [totalCount] = await Resource.aggregate(totalCountPipeline);

        // Execute the main aggregation pipeline
        const allResources = await Resource.aggregate(resourcesPipeline);

        // Calculate total pages
        const totalPages = totalCount ? Math.ceil(totalCount.total / limit) : 0;

        // Return the paginated results with pagination details
        res.json({
            data: allResources,
            totalPages: totalPages,
            currentPage: page,
            itemsPerPage: limit
        });
    } catch (e) {
        // Handle errors and log issues
        console.error("Error in getAllResources:", e);
        next(e);
    }
};




// Function to aggregate and render resource statistics
exports.renderResourceStatsPage = async (req, res, next) => {
    try {
        // Total resources count
        const totalResourcesPipeline = [
            { $count: "total" }
        ];

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
        const [totalApproved] = await Resource.aggregate(totalApprovedResourcesPipeline);
        const [totalPrivateToENACT] = await Resource.aggregate(totalPrivateToENACTPipeline);
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



exports.getResourcesAndStats = async (req, res, next) => {
    try {
        // Define aggregation pipelines for statistics and resources

        // Pipeline for Total Resources count
        const totalResourcesPipeline = [{ $count: "total" }];

        // Pipeline for Total Approved Resources count
        const totalApprovedResourcesPipeline = [
            { $match: { checkStatus: "approve" } },
            { $count: "total" }
        ];

        // Pipeline for Total Private to ENACT Resources count
        const totalPrivateToENACTPipeline = [
            { $match: { status: "privateToENACT" } },
            { $count: "total" }
        ];

        // Pipeline for grouping resources by author
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

        // Pipeline for grouping resources by tag
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

        // Pipeline for grouping resources by year of creation
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

        // Pipeline for fetching all resources with joined data
        const resourcesPipeline = [
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
                $lookup: {
                    from: "courses",
                    localField: "courseId",
                    foreignField: "_id",
                    as: "courseDetails"
                }
            },
            { $unwind: "$courseDetails" },
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
            }
        ];

        // Execute the aggregation pipelines in parallel
        const [
            [totalResources],
            [totalApproved],
            [totalPrivateToENACT],
            totalPerAuthor,
            totalPerTag,
            totalPerYear,
            allResources
        ] = await Promise.all([
            Resource.aggregate(totalResourcesPipeline),
            Resource.aggregate(totalApprovedResourcesPipeline),
            Resource.aggregate(totalPrivateToENACTPipeline),
            Resource.aggregate(totalPerAuthorPipeline),
            Resource.aggregate(totalPerTagPipeline),
            Resource.aggregate(totalPerYearPipeline),
            Resource.aggregate(resourcesPipeline)
        ]);

        // Construct the combined response with statistics and resource data
        const response = {
            stats: {
                totalResources: totalResources ? totalResources.total : 0,
                totalApproved: totalApproved ? totalApproved.total : 0,
                totalPrivateToENACT: totalPrivateToENACT ? totalPrivateToENACT.total : 0,
                totalPerAuthor: totalPerAuthor,
                totalPerTag: totalPerTag,
                totalPerYear: totalPerYear
            },
            resources: allResources
        };

        // Send the combined response back to the client
        res.json(response);
    } catch (e) {
        next(e);
    }
};






//****************************************************
//*******************CRUD related*********************
exports.uploadResource = async (req, res, next) => {
    const courseId = req.params.courseId
    try {
        let tagsString = req.body.tags
        let tags = tagsString.split(",")
        let newResource
        let currUser = await User.findOne({_id: req.body.ownerId})
        // not uploaded from course page
        if (courseId === undefined) {
            newResource = new Resource({
                ownerId: currUser._id,
                ownerName: currUser.userName,
                status: req.body.status, // public/private to class/private to professors
                createdAt: new Date(),
                name: req.body.resourceName,
                description: req.body.description,
                tags: tags, // tags as array
                uri: req.body.uri, // universal resource identifier specIdific to the resource
                state: req.body.state,
                contentType: req.body.contentType,
                mediaType: req.body.mediaType, // video/text document ...
                institution: req.body.institution,
                yearOfCreation: req.body.yearOfCreation, // content's actual creation time
                checkStatus: 'approve'
            })
        }
        // uploaded directly from course page
        else {
            // student uploaded resource
            if (res.locals.status === "student") {
                let facultyInfo = await Course.findOne({_id: courseId})
                newResource = new Resource({
                    ownerId: currUser._id,
                    ownerName: currUser.userName,
                    courseId: courseId,
                    status: req.body.status, // partPublic/private to ENACT
                    createdAt: new Date(),
                    name: req.body.resourceName,
                    description: req.body.description,
                    tags: tags, // tags as array
                    uri: req.body.uri, // universal resource identifier specific to the resource
                    state: req.body.state,
                    contentType: req.body.contentType,
                    mediaType: req.body.mediaType, // video/text document ...
                    institution: req.body.institution,
                    yearOfCreation: req.body.yearOfCreation,// content's actual creation time
                    facultyId: facultyInfo.ownerId, //belong to which faculty to approve
                    checkStatus: 'underReview',
                })
            }
            // faculty/admin/TA uploaded resource
            else {
                newResource = new Resource({
                    ownerId: currUser._id,
                    ownerName: currUser.userName,
                    courseId: courseId,
                    status: req.body.status, // public/private to class/private to professors
                    createdAt: new Date(),
                    name: req.body.resourceName,
                    description: req.body.description,
                    tags: tags, // tags as array
                    uri: req.body.uri, // universal resource identifier specific to the resource
                    state: req.body.state,
                    contentType: req.body.contentType,
                    mediaType: req.body.mediaType,
                    institution: req.body.institution,
                    yearOfCreation: req.body.yearOfCreation,// content's actual creation time
                    checkStatus: 'approve',
                })
            }
        }
        // save the new resource
        await newResource.save()
        // add additional authors
        let authorNames = req.body.authorName
        let authorEmails = req.body.authorEmail
        if (authorNames) {
            if (typeof authorNames === 'string') {
                let newAuthor = new AuthorAlt({
                    resourceId: newResource._id,
                    userName: authorNames,
                    userEmail: authorEmails
                })
                await newAuthor.save()
            } else {
                for (let i = 0; i < authorNames.length; i++) {
                    let newAuthor = new AuthorAlt({
                        resourceId: newResource._id,
                        userName: authorNames[i],
                        userEmail: authorEmails[i]
                    })
                    await newAuthor.save()
                }
            }
        }
        res.render('./pages/status/uploadSuccess', {
            req: req,
            courseId: courseId
        })
    } catch (e) {
        next(e)
    }
}

exports.updateResource = async (req, res, next) => {
    const resourceId = req.params.resourceId
    const limit = req.params.limit
    try {
        let tagsString = req.body.selectedTags
        let tags = tagsString.split(",")
        let oldResource = await Resource.findOne({_id: resourceId})
        oldResource.name = req.body.resourceName
        oldResource.status = req.body.status
        oldResource.description = req.body.description
        oldResource.uri = req.body.uri
        oldResource.state = req.body.state
        oldResource.contentType = req.body.contentType
        oldResource.mediaType = req.body.mediaType
        oldResource.institution = req.body.institution
        oldResource.yearOfCreation = req.body.yearOfCreation
        oldResource.tags = tags
        if (res.locals.status === 'student') {
            oldResource.checkStatus = 'underReview'
        }
        await oldResource.save()
        // save the new resource
        // add additional authors
        let authorNames = req.body.authorName
        let authorEmails = req.body.authorEmail
        if (authorNames) {
            if (typeof authorNames === 'string') {
                let newAuthor = new AuthorAlt({
                    resourceId: oldResource._id,
                    userName: authorNames,
                    userEmail: authorEmails
                })
                await newAuthor.save()
            } else {
                for (let i = 0; i < authorNames.length; i++) {
                    let newAuthor = new AuthorAlt({
                        resourceId: oldResource._id,
                        userName: authorNames[i],
                        userEmail: authorEmails[i]
                    })
                    await newAuthor.save()
                }
            }
        }
        // user referer in header to determine where to redirect
        let redirect = req.headers.referer
        if (redirect.includes('course')) {
            let courseId = redirect.split('/limit')[0]
            courseId = courseId.split('view/')[1].split('/')[0]
            res.redirect('/course/view/' + courseId + '/' + limit)
        } else {
            res.redirect('back')
        }
    } catch (e) {
        next(e)
    }
}

exports.postPublicResource = async (req, res, next) => {
    const resourceId = await req.params.resourceId
    try {
        let OldResource = await Resource.findOne({_id: resourceId})
        OldResource.status = 'finalPublic'
        await OldResource.save()
        res.redirect('back')
    } catch (e) {
        next(e)
    }
}

exports.removePublicResource = async (req, res, next) => {
    const resourceId = await req.params.resourceId
    try {
        let OldResource = await Resource.findOne({_id: resourceId})
        OldResource.status = 'public'
        await OldResource.save()
        res.redirect('back')
    } catch (e) {
        next(e)
    }
}

exports.removeResource = async (req, res, next) => {
    try {
        let resourceId = await req.params.resourceId
        let resource = await Resource.findOne({_id: resourceId})
        await Resource.deleteOne({_id: resourceId})
        res.redirect('back')
    } catch (e) {
        next(e)
    }
}

exports.uploadToPublicResr = async (req, res, next) => {
    try {
        let tagsString = req.body.tags
        let tags = tagsString.split(",")
        let newResource
        newResource = new Resource({
            ownerId: req.user._id,
            status: req.body.status, // public/private to class/private to professors
            createdAt: new Date(),
            name: req.body.resourceName,
            description: req.body.description,
            tags: tags, // tags as array
            uri: req.body.uri, // universal resource identifier specIdific to the resource
            state: req.body.state,
            contentType: req.body.contentType,
            mediaType: req.body.mediaType, // video/text document ...
            institution: req.body.institution,
            yearOfCreation: req.body.yearOfCreation, // content's actual creation time
            checkStatus: 'approve'
        })
        let authorNames = req.body.authorName
        let authorEmails = req.body.authorEmail
        if (typeof authorNames === 'string') {
            let newAuthor = new AuthorAlt({
                resourceId: newResource._id,
                userName: authorNames,
                userEmail: authorEmails
            })
            await newAuthor.save()
        } else {
            for (let i = 0; i < authorNames.length; i++) {
                let newAuthor = new AuthorAlt({
                    resourceId: newResource._id,
                    userName: authorNames[i],
                    userEmail: authorEmails[i]
                })
                await newAuthor.save()
            }
        }
        await newResource.save()
        res.redirect('/resources/manage/public')
    } catch (e) {
        next(e)
    }
}

exports.updateOwner = async (req, res, next) => {
    try {
        let resource = await Resource.findOne({_id: req.params.resourceId})
        resource.ownerId = req.body.ownerId
        let tempUser = await User.findOne({_id: req.body.ownerId})
        resource.ownerName = tempUser.userName
        await resource.save()
        resource = await Resource.findOne({_id: req.params.resourceId})
        let ownerId = resource.ownerId
        tempUser = await User.findOne({_id: ownerId})
        let ownerName1 = tempUser.userName
        res.render('./pages/updateOwner', {
            resource: resource,
            ownerName1: ownerName1,
            req: req
        })
    } catch (e) {
        next(e)
    }
}

exports.getCurrentOwner = async (req, res) => {
    let resource = await Resource.findOne({_id: req.params.resourceId})
    let ownerId = resource.ownerId
    let tempUser = await User.findOne({_id: ownerId})
    let ownerName1 = tempUser.userName
    res.render('./pages/updateOwner', {
        resource: resource,
        ownerName1: ownerName1,
        req: req
    })
}

//****************************************************
//********************Load related********************

exports.loadResources = async (req, res, next) => {
    const courseId = req.params.courseId
    const checkStatus = 'approve'
    let toLimit = parseInt(req.params.limit)
    try {
        let resources = await Resource.find({
            courseId: courseId,
            checkStatus: checkStatus
        }).sort({yearOfCreation: -1, createdAt: -1}).limit(toLimit)
        let starred = await ResourceSet.findOne({ownerId: req.user._id, name: 'favorite'})
        let resourceIds = null
        if (starred) {
            resourceIds = await starred.resources
        }
        res.locals.resourceIds = resourceIds
        resources = await addAuthor(resources)
        res.locals.resourceInfo = resources
        next()
    } catch (e) {
        next(e)
    }
}

exports.loadMoreResourcesAjax = async (req, res, next) => {
    const courseId = req.params.courseId
    const skip = parseInt(req.params.limit)
    const checkStatus = 'approve'
    try {
        let resources = await Resource.find({
            courseId: courseId,
            checkStatus: checkStatus
        }).sort({yearOfCreation: -1, createdAt: -1}).skip(skip).limit(5)
        let starred = await ResourceSet.findOne({ownerId: req.user._id, name: 'favorite'})
        let resourceIds = null
        if (starred) {
            resourceIds = await starred.resources
        }
        res.locals.resourceIds = resourceIds
        resources = await addAuthor(resources)
        res.send(resources)
    } catch (e) {
        next(e)
    }
}


async function addAuthor(resources) {
    for (let i = 0; i < resources.length; i++) {
        let authors = await AuthorAlt.find({resourceId: resources[i]._id})
        if (authors) {
            for (let j = 0; j < authors.length; j++)
                resources[i].ownerName += (', ' + authors[j].userName)
        }
    }
    return resources
}

exports.loadAllFacultyResources = async (req, res, next) => {
    
    try {
        console.log(req.user.status, "*************");
        if (req.user.status !== 'admin' && req.user.status !== 'faculty')
            res.send("You are not allowed here!")
        else {
            let syllabus = await Resource.find({
                status: 'privateToProfessor',
                'contentType': 'Syllabus'
            }).sort({yearOfCreation: -1}).limit(3)
            let assignments = await Resource.find({
                status: 'privateToProfessor',
                'contentType': 'Assignment Guidelines'
            }).sort({yearOfCreation: -1}).limit(3)
            let guides = await Resource.find({
                status: 'privateToProfessor',
                'contentType': 'Course Planning'
            }).sort({yearOfCreation: -1}).limit(3)

            

            let starred = await ResourceSet.findOne({ownerId: req.user._id, name: 'favorite'})
            let resourceIds = null
            if (starred) {
                resourceIds = await starred.resources
            }
            res.locals.resourceIds = resourceIds
            res.locals.syllabus = await addAuthor(syllabus);
            res.locals.assignments = await addAuthor(assignments);
            res.locals.guides = await addAuthor(guides);
            next()
        }
    } catch (e) {
        next(e)
    }
}

exports.loadImpactResources = async (req, res, next) => {
    try {
        let facultyResearch = await Resource.find({
            status: {$in: ['public', 'finalPublic']},
            contentType: 'ENACT Research'
        }).sort({yearOfCreation: -1})
        let essayENACT = await Resource.find({
            status: {$in: ['public', 'finalPublic']},
            contentType: {$in: ['Personal Reflection', 'News and Articles']} // 'Essays about Enact' value is set to 'Personal Reflection'
        }).sort({yearOfCreation: -1})
        res.locals.facultyResearch = await addAuthor(facultyResearch);
        res.locals.essayENACT = await addAuthor(essayENACT);
        next()
    } catch (e) {
        console.log("error: " + e)
        next(e)
    }
}

exports.loadSpecificContentType = async (req, res, next) => {
    try {
        let contentType = ''
        if (req.params.contentType === 'syllabus')
            contentType = 'Syllabus'
        else if (req.params.contentType === 'assignments')
            contentType = 'Assignment Guidelines'
        else if (req.params.contentType === 'facultyResearch')
            contentType = 'ENACT Faculty Research'
        else if (req.params.contentType === 'essayENACT')
            contentType = 'Essays About ENACT'
        else if (req.params.contentType === 'plan')
            contentType = 'Course Planning'

        let resourceInfo = await Resource.find({
            status: 'privateToProfessor',
            contentType: contentType
        }).sort({yearOfCreation: -1})
        let starred = await ResourceSet.findOne({ownerId: req.user._id, name: 'favorite'})
        let resourceIds = null
        if (starred) {
            resourceIds = await starred.resources
        }

        res.locals.resourceIds = resourceIds

        res.locals.resourceInfo = await addAuthor(resourceInfo)

        if (contentType === 'Assignment Guidelines')
            contentType = 'Assignment Guidelines & Rubrics'
        res.render('./pages/resources-searchResult-private', {
            secretType: contentType,
            search_text: null,
            search_tags: null,
            search_state: null,
            search_contentType: contentType,
            search_institution: null,
            search_mediaType: null,
            search_yearOfCreation: null,
            search_status: null
        })

    } catch (e) {
        next(e)
    }
}

let fileData = require('../public/js/slideShow')
exports.loadImages = async (req, res, next) => {
    try {
        let imagePaths = fileData.getPath('slideShow')
        let facultyPaths = fileData.getPath('faculty')
        let labelPaths = fileData.getPath('label')
        res.locals.imagePaths = imagePaths
        res.locals.labelPaths = labelPaths
        res.locals.facultyPaths = facultyPaths
        next()
    } catch (e) {
        console.log("error: " + e)
        next(e)
    }
}

exports.loadPublicResources = async (req, res, next) => {
    try {
        let resourceInfo = await Resource.find({
            status: {$in: ["finalPublic", "public"]}
        }).sort({yearOfCreation: -1})
        res.locals.resourceInfo = await addAuthor(resourceInfo)
        next()
    } catch (e) {
        console.log("error: " + e)
        next(e)
    }
}

exports.loadDisplayedResources = async (req, res, next) => {
    try {
        let resourceInfo = await Resource.find({
            status: "finalPublic"
        }).sort({yearOfCreation: -1})
        res.locals.resourceInfo = await addAuthor(resourceInfo)
        next()
    } catch (e) {
        console.log("error: " + e)
        next(e)
    }
}

exports.showMyResources = async (req, res, next) => {
    try {
        let resourceInfo = await Resource.find({ownerId: req.user._id})
        let tags = await getTags(req, res)
        resourceInfo = await addAuthor(resourceInfo)
        if (req.user.status === 'student') {
            res.render('./pages/myResourcesStudent', {
                resourceInfo: resourceInfo,
                tags: tags
            })
        } else {
            res.render('./pages/myResourcesFaculty', {
                resourceInfo: resourceInfo,
                tags: tags
            })
        }
    } catch (e) {
        next(e)
    }
}

async function getTags(req, res) {
    let predefined = ['agriculture'
        , 'arts and culture'
        , 'cannabis'
        , 'consumer protection'
        , 'COVID-19'
        , 'criminal justice'
        , 'disability'
        , 'education'
        , 'elderly'
        , 'energy'
        , 'environment/climate change'
        , 'gun control'
        , 'healthcare'
        , 'higher education'
        , 'housing and homelessness'
        , 'immigration'
        , 'labor'
        , 'LGBTQ+'
        , 'mental health'
        , 'opioids'
        , 'public health'
        , 'public safety'
        , 'race'
        , 'substance use and recovery'
        , 'taxes'
        , 'technology'
        , 'tourism'
        , 'transportation'
        , 'veterans'
        , 'violence and sexual assault'
        , 'voting'
        , 'women and gender']
    let tags = await Tag.find({status: "approve"}).sort({'createdAt': -1})
    for (let tag = 0; tag < tags.length; tag++) {
        predefined.push(tags[tag].info)
    }
    return predefined
}

exports.showPublic = async (req, res, next) => {
    try {
        let resourceInfo = await Resource.find({
            status: {$in: ["finalPublic", "public"]},
            checkStatus: 'approve'
        }).sort({yearOfCreation: -1}).limit(10)
        resourceInfo = await addAuthor(resourceInfo)
        res.render('./pages/search-primary-public', {
            resourceInfo: resourceInfo,
        })
    } catch (e) {
        next(e)
    }
}

//****************************************************
//****************Special operations******************
exports.starResource = async (req, res, next) => {
    try {
        let resourceId = await req.params.resourceId
        let resourceSet = await ResourceSet.findOne({ownerId: req.user._id, name: 'favorite'})
        // if resourceSet collection is empty, then create a new instance
        if (!resourceSet) {
            let newResourceSet = new ResourceSet({
                ownerId: req.user._id,
                name: 'favorite',
                createdAt: new Date()
            })
            await newResourceSet.save()
            resourceSet = newResourceSet
        }
        // use the newly created instance or the one in the database
        let resourceIds = resourceSet.resources
        let newResourceIds
        if (!resourceIds) {
            newResourceIds = [resourceId]
        } else {
            newResourceIds = [resourceId].concat(resourceIds)
        }
        // save to db
        resourceSet.resources = newResourceIds
        await resourceSet.save()
        res.send()
    } catch (e) {
        next(e)
    }
}

exports.unstarResource = async (req, res, next) => {
    try {
        let resourceId = await req.params.resourceId
        let resourceSet = await ResourceSet.findOne({ownerId: req.user._id, name: 'favorite'})
        let resourceIds = resourceSet.resources
        let newResourceIds = []
        for (let i = 0; i < resourceIds.length; i++) {
            if (resourceIds[i].toString() !== resourceId) {
                newResourceIds.push(resourceIds[i])
            }
        }
        resourceSet.resources = newResourceIds
        await resourceSet.save()
        console.log("unstar success!")
        return res.send()
    } catch (e) {
        next(e)
    }
}

exports.showStarredResources = async (req, res, next) => {
    try {
        let resourceInfo = null
        let resourceSet = await ResourceSet.findOne({ownerId: req.user._id, name: 'favorite'})
        // console.log(resourceSet)
        if (!resourceSet) {
            console.log('resource set empty')
        } else {
            let resourceInfoIds = await resourceSet.resources
            resourceInfo = await Resource.find({_id: {$in: resourceInfoIds}})
        }
        let allResourceSets = await ResourceSet.find({ownerId: req.user._id})
        res.locals.allResourceSets = allResourceSets
        if (resourceInfo) {
            resourceInfo = await addAuthor(resourceInfo)
        }
        res.locals.resourceInfo = resourceInfo
        res.render('./pages/showStarredResources')
    } catch (e) {
        next(e)
    }
}

exports.loadCollection = async (req, res, next) => {
    try {
        let resourceSetId = req.params.resourceSetId
        let resourceSet = await ResourceSet.findOne({_id: resourceSetId})
        let resourceInfoIds = resourceSet.resources
        let resourceInfo = await Resource.find({_id: {$in: resourceInfoIds}})
        res.locals.resourceSet = resourceSet
        resourceInfo = await addAuthor(resourceInfo)
        res.locals.resourceInfo = resourceInfo
        if (req.user) {
            let allLikedResourceSet = await ResourceSet.findOne({ownerId: req.user._id, name: 'favorite'})
            let allLikedResourceIds = allLikedResourceSet?allLikedResourceSet.resources:[]
            res.locals.allLikedResourceInfo = await Resource.find({_id: {$in: allLikedResourceIds}})
        }
        next()
    } catch (e) {
        next(e)
    }
}

exports.removeFromCollection = async (req, res, next) => {
    try {
        let collectionId = req.params.collectionId
        let resourceId = req.params.resourceId
        let resourceSet = await ResourceSet.findOne({_id: collectionId})
        let resourceIds = resourceSet.resources
        let newResourceIds = []
        for (let i = 0; i < resourceIds.length; i++) {
            if (resourceIds[i].toString() !== resourceId) {
                newResourceIds.push(resourceIds[i])
            }
        }
        resourceSet.resources = newResourceIds
        await resourceSet.save()
        res.redirect('back')
    } catch (e) {
        next(e)
    }
}

exports.addToCollection = async (req, res, next) => {
    try {
        let collectionId = req.params.collectionId
        let resourceId = req.params.resourceId
        let resourceSet = await ResourceSet.findOne({_id: collectionId})
        // use the newly created instance or the one in the database
        let resourceIds = resourceSet.resources
        let newResourceIds
        if (!resourceIds) {
            newResourceIds = [resourceId]
        } else {
            newResourceIds = [resourceId].concat(resourceIds)
        }
        // save to db
        resourceSet.resources = newResourceIds
        await resourceSet.save()
        res.redirect('back')
    } catch (e) {
        next(e)
    }
}

exports.createCollection = async (req, res, next) => {
    try {
        let newResourceSet = new ResourceSet({
            ownerId: req.user._id,
            name: req.body.collectionName,
            createdAt: new Date()
        })
        await newResourceSet.save()
        res.redirect('/collection/view/' + newResourceSet._id)
    } catch (e) {
        next(e)
    }
}

exports.deleteCollection = async (req, res, next) => {
    try {
        let collectionId = req.params.collectionId
        await ResourceSet.deleteOne({_id: collectionId})
        res.redirect('/resources/view/favorite')
    } catch (e) {
        next(e)
    }
}

// -----------------------------------------------
// --------------- General Search ----------------
// -----------------------------------------------

exports.primarySearch = async (req, res, next) => {
    try {
        let resourceInfo = await invertedSearch(req, res);
        let starred = await ResourceSet.findOne({ownerId: req.user._id, name: 'favorite'})
        let starredResourceIds = null
        if (starred) {
            starredResourceIds = await starred.resources
        }

        // remove duplicates in resource objects
        let uniqueResourceInfo = null
        if (resourceInfo) {
            let jsonObject = resourceInfo.map(JSON.stringify);
            uniqueResourceInfo = Array.from(new Set(jsonObject)).map(JSON.parse);
        }

        if (uniqueResourceInfo) {
            for (let i = 0; i < uniqueResourceInfo.length; i++) {
                let authors = await AuthorAlt.find({resourceId: uniqueResourceInfo[i]._id})
                if (authors) {
                    for (let j = 0; j < authors.length; j++)
                        uniqueResourceInfo[i].ownerName += (', ' + authors[j].userName)
                }
            }
        }
        res.locals.resourceIds = starredResourceIds
        res.locals.resourceInfo = uniqueResourceInfo
        // resourceInfoSet = uniqueResourceInfo
        res.render('./pages/resources-searchResult-private', {
            secretType: 'Search Result',
            search_text: req.body.search,
            search_tags: null,
            search_state: null,
            search_contentType: null,
            search_institution: null,
            search_mediaType: null,
            search_yearOfCreation: null,
            search_status: null
        })
    } catch (e) {
        next(e)
    }
}

async function invertedSearch(req, res) {
    const checkStatus = 'approve'
    let resourceInfo
    if (req.body.search && req.body.search.length > 0) {
        // admin search
        if (res.locals.status === 'admin' || res.locals.status === 'faculty' || res.locals.status === 'TA') {
            resourceInfo = await Resource.find(
                {
                    $text: {$search: req.body.search},
                    checkStatus: 'approve'
                },
                {
                    score: {$meta: "textScore"},
                    ownerId: 1,
                    ownerName: 1,
                    name: 1,
                    description: 1,
                    tags: 1,
                    uri: 1,
                    state: 1,
                    mediaType: 1, // video/text document ...
                    contentType: 1, // pitch/research...
                    institution: 1,
                    yearOfCreation: 1
                }
            ).sort({score: {$meta: "textScore"}, yearOfCreation: -1})
        }
        // student search
        else if (res.locals.status === 'student') {
            resourceInfo = await Resource.find(
                {
                    $text: {$search: req.body.search},
                    checkStatus: 'approve',
                    status: {$in: ["privateToENACT", "public", "finalPublic"]}
                },
                {
                    score: {$meta: "textScore"},
                    ownerId: 1,
                    ownerName: 1,
                    name: 1,
                    description: 1,
                    tags: 1,
                    uri: 1,
                    state: 1,
                    mediaType: 1, // video/text document ...
                    contentType: 1, // pitch/research...
                    institution: 1,
                    yearOfCreation: 1
                }
            ).sort({score: {$meta: "textScore"}})
        } else {
            resourceInfo = await Resource.find(
                {
                    $text: {$search: req.body.search},
                    checkStatus: 'approve',
                    status: {$in: ["public", "finalPublic"]}
                },
                {
                    score: {$meta: "textScore"},
                    ownerId: 1,
                    ownerName: 1,
                    name: 1,
                    description: 1,
                    tags: 1,
                    uri: 1,
                    state: 1,
                    mediaType: 1, // video/text document ...
                    contentType: 1, // pitch/research...
                    institution: 1,
                    yearOfCreation: 1
                } // content's actual creation time}
            ).sort({score: {$meta: "textScore"}})
        }
    }
    // empty param search
    else {
        if (res.locals.status === 'admin' || res.locals.status === 'faculty' || res.locals.status === 'TA') {
            resourceInfo = await Resource.find({
                checkStatus: checkStatus
            }, {
                ownerId: 1,
                ownerName: 1,
                name: 1,
                description: 1,
                tags: 1,
                uri: 1,
                state: 1,
                mediaType: 1, // video/text document ...
                contentType: 1, // pitch/research...
                institution: 1,
                yearOfCreation: 1 // content's actual creation time
            })
        } else if (res.locals.status === 'student') {
            resourceInfo = await Resource.find({
                checkStatus: checkStatus,
                status: {$in: ["privateToENACT", "public", "finalPublic"]}
            }, {
                ownerId: 1,
                ownerName: 1,
                name: 1,
                description: 1,
                tags: 1,
                uri: 1,
                state: 1,
                mediaType: 1, // video/text document ...
                contentType: 1, // pitch/research...
                institution: 1,
                yearOfCreation: 1 // content's actual creation time
            })
        } else {
            resourceInfo = await Resource.find({
                checkStatus: checkStatus,
                status: {$in: ["public", "finalPublic"]}
            }, {
                ownerId: 1,
                ownerName: 1,
                name: 1,
                description: 1,
                tags: 1,
                uri: 1,
                state: 1,
                mediaType: 1, // video/text document ...
                contentType: 1, // pitch/research...
                institution: 1,
                yearOfCreation: 1 // content's actual creation time
            })
        }
    }
    resourceInfo = await addAuthor(resourceInfo)
    return resourceInfo
}


// -----------------------------------------------
// --------------- Advanced Search ---------------
// -----------------------------------------------

exports.advancedSearch = async (req, res) => {

    let filtered = await invertedSearch(req, res);

    let local_state = req.body.state !== 'empty' ? req.body.state : null

    if (filtered && local_state) {
        filtered = filtered.filter(({state}) => state.toUpperCase() === local_state.toUpperCase());
    }

    let local_institution = req.body.institution

    if (filtered && local_institution !== '') {
        filtered = filtered.filter(({institution}) => institution.toUpperCase() === local_institution.toUpperCase());
    }

    let local_yearOfCreation = req.body.yearOfCreation

    if (filtered && local_yearOfCreation !== '') {
        filtered = filtered.filter(({yearOfCreation}) => yearOfCreation === parseInt(local_yearOfCreation));
    }

    let local_contentType = req.body.contentType !== 'empty' ? req.body.contentType : null

    if (filtered && local_contentType) {
        filtered = filtered.filter(({contentType}) => contentType.toUpperCase() === local_contentType.toUpperCase());
    }

    let local_mediaType = req.body.mediaType !== 'empty' ? req.body.mediaType : null

    if (filtered && local_mediaType) {
        filtered = filtered.filter(({mediaType}) => mediaType.toUpperCase() === local_mediaType.toUpperCase());
    }

    let local_status = req.body.status

    if (filtered && local_status !== '' && local_status !== 'all') {
        if (local_status === 'public')
            filtered = filtered.filter(({status}) =>
                ['public', 'finalPublic'].includes(status)
            );
        else
            filtered = filtered.filter(({status}) => status.toUpperCase() === local_status.toUpperCase());
    }

    let filteredResource = []
    if (filtered && req.body.tags.length > 0) {
        for (let m = 0; m < filtered.length; m++) {
            let tagged = req.body.tags.split(',')
            let result = tagged.every(val => filtered[m].tags.includes(val));
            if (result) {
                filteredResource.push(filtered[m])
            }
        }
    } else {
        filteredResource = filtered
    }

    // find all starred resources
    let starred = await ResourceSet.findOne({ownerId: req.user._id, name: 'favorite'})

    let starredResourceIds = null
    if (starred) {
        starredResourceIds = await starred.resources
    }

    res.locals.resourceIds = starredResourceIds

    res.render('./pages/resources-searchResult-private', {
        resourceInfo: filteredResource,
        resourceIds: starredResourceIds,
        secretType: 'Search Result',
        search_text: req.body.search,
        search_tags: req.body.tags,
        search_state: local_state,
        search_contentType: local_contentType,
        search_institution: local_institution,
        search_mediaType: local_mediaType,
        search_yearOfCreation: local_yearOfCreation,
        search_status: local_status
    })
}

exports.advancedSearchPublic = async (req, res) => {
    let filtered = await invertedSearch(req, res);

    let local_state = req.body.state !== 'empty' ? req.body.state : null

    if (filtered && local_state) {
        filtered = filtered.filter(({state}) => state.toUpperCase() === local_state.toUpperCase());
    }

    let local_institution = req.body.institution

    if (filtered && local_institution !== '') {
        filtered = filtered.filter(({institution}) => institution.toUpperCase() === local_institution.toUpperCase());
    }

    let local_yearOfCreation = req.body.yearOfCreation

    if (filtered && local_yearOfCreation !== '') {
        filtered = filtered.filter(({yearOfCreation}) => yearOfCreation === parseInt(local_yearOfCreation).toUpperCase());
    }

    let local_contentType = req.body.contentType !== 'empty' ? req.body.contentType : null

    if (filtered && local_contentType) {
        filtered = filtered.filter(({contentType}) => contentType.toUpperCase() === local_contentType.toUpperCase());
    }

    let local_mediaType = req.body.mediaType !== 'empty' ? req.body.mediaType : null

    if (filtered && local_mediaType) {
        filtered = filtered.filter(({mediaType}) => mediaType.toUpperCase() === local_mediaType.toUpperCase());
    }

    // -----------------------------------------------------------------
    // ---------------------------tag filter----------------------------
    // -----------------------------------------------------------------

    let filteredResource = []
    if (req.body.tags.length > 0) {
        for (let m = 0; m < filtered.length; m++) {
            let tagged = req.body.tags.split(',')
            let result = tagged.every(val => filtered[m].tags.includes(val));
            if (result) {
                filteredResource.push(filtered[m])
            }
        }
    } else {
        filteredResource = filtered
    }

    res.locals.resourceInfo = filteredResource

    res.render('./pages/resources-searchResult-public', {
        search_text: req.body.search,
        search_tags: req.body.tags,
        search_state: local_state,
        search_contentType: local_contentType,
        search_institution: local_institution,
        search_mediaType: local_mediaType,
        search_yearOfCreation: local_yearOfCreation
    })
}

exports.getAllResourcesAjax = async (req, res) => {
    let resources
    // ENACT users
    if (res.locals.loggedIn) {
        // admin/student requesting
        if (res.locals.status === 'admin' || res.locals.status === 'faculty')
            resources = await Resource.find({
                checkStatus: 'approve'
            }, {
                name: 1,
                contentType: 1,
                ownerName: 1
            })
        else
            resources = await Resource.find({
                checkStatus: 'approve',
                status: {$in: ["privateToENACT", "public", "finalPublic"]}
            }, {
                name: 1,
                contentType: 1,
                ownerName: 1
            })
    }
    // public users
    else {
        resources = await Resource.find({
            checkStatus: 'approve',
            status: {$in: ["finalPublic", "public"]}
        }, {
            name: 1,
            contentType: 1,
            ownerName: 1
        })
    }
    return res.send(resources)
}
