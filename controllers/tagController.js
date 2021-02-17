'use strict';
const Tag = require('../models/Tag');

exports.addTags = async (req, res, next) => {
    try {
        let newTag = new Tag(
            {
                ownerId: req.user._id,
                ownerStatus: req.user.status,
                ownerName: req.user.userName,
                info: req.body.addingTag,
                status: 'underReview',
                reason: req.body.reason
            }
        )
        // await until the newCourse is saved properly
        await newTag.save()
        res.redirect('back')
    } catch (e) {
        next(e)
    }
}

exports.loadUnderReviewTags = async (req, res, next) => {
    try {
        res.locals.tagsInfo = await Tag.find({
            status: 'underReview'
        }).sort({'createdAt': -1})
        res.render('./pages/approveTags')
    } catch (e) {
        console.log("error: " + e)
        next(e)
    }
}

exports.agreeTags = async (req, res, next) => {
    try {
        let tagsId = await req.body.checked
        let tagsInfo = await Tag.find({_id: tagsId})
        for (let i = 0; i < tagsInfo.length; i++) {
            tagsInfo[i].status = 'approve'
            tagsInfo[i].save()
        }
        res.redirect('back')
    } catch (e) {
        next(e)
    }
}

exports.denyTags = async (req, res, next) => {
    try {
        let tagsId = await req.body.checked
        let tagsInfo = await Tag.find({_id: tagsId})
        for (let i = 0; i < tagsInfo.length; i++) {
            tagsInfo[i].status = 'deny'
            tagsInfo[i].save()
        }
        res.redirect('back')
    } catch (e) {
        next(e)
    }
}

exports.loadTags = async (req, res, next) => {
    try {
        res.locals.tagsInfo = await Tag.find({
            ownerId: req.user._id
        }).sort({'createdAt': -1})
        res.render('./pages/newAreas')
    } catch (e) {
        console.log("error: " + e)
        next(e)
    }
}

exports.getAllTags = async (req, res, next) => {
    try {
        let tags = await Tag.find({status: "approve"}).sort({'createdAt': -1})
        res.send(tags)
    } catch (e) {
        console.log("error: " + e)
        next(e)
    }
}

exports.getAllTagsAlt = async (req, res, next) => {
    try {
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
        res.locals.tags = predefined
        next()
    } catch (e) {
        console.log("error: " + e)
        next(e)
    }
}