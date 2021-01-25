'use strict';
const Event = require('../models/Event');

exports.saveEvent = async (req, res, next) => {
    try {
        let timezoneOffset = req.body.TZ
        timezoneOffset = parseInt(timezoneOffset) - new Date().getTimezoneOffset()
        console.log("timezone offset is: ", timezoneOffset)
        let startDate = new Date(req.body.start).getTime() + parseInt(timezoneOffset) * 60000
        let endDate = new Date(req.body.end).getTime() + parseInt(timezoneOffset) * 60000
        let newEvent = new Event({
            ownerId: req.user._id,
            title: req.body.title,
            start: startDate,
            end: endDate,
            uri: req.body.uri,
            description: req.body.description,
            icon: req.body.icon,
            visibility: req.body.visibility
        })
        await newEvent.save()
        res.redirect('back')
    } catch (e) {
        next(e)
    }
}

exports.editEvent = async (req, res, next) => {
    try {
        let eventToEdit = await Event.findOne({_id: req.params.eventId})
        eventToEdit.title = req.body.title
        eventToEdit.start = req.body.start
        eventToEdit.end = req.body.end
        eventToEdit.uri = req.body.uri
        eventToEdit.description = req.body.description
        // eventToEdit.className = req.body.className
        eventToEdit.icon = req.body.icon
        eventToEdit.visibility = req.body.visibility
        await eventToEdit.save()
        res.redirect('back')
    } catch (e) {
        next(e)
    }
}


exports.deleteEvent = async (req, res, next) => {
    try {
        let eventId = req.params.eventId
        await Event.deleteOne({_id: eventId})
        res.redirect('/events')
    } catch (e) {
        next(e)
    }
}