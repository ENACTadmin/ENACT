'use strict';
const Event = require('../models/Event');
const Faculty = require('../models/Faculty');
const User = require('../models/User');
const sgMail = require('@sendgrid/mail');

exports.saveEvent = async (req, res, next) => {
    try {
        let timezoneOffset = req.body.TZ
        timezoneOffset = parseInt(timezoneOffset) - new Date().getTimezoneOffset()
        let startDate = new Date(req.body.start).getTime() + parseInt(timezoneOffset) * 60000
        let endDate = new Date(req.body.end).getTime() + parseInt(timezoneOffset) * 60000
        let newEvent = new Event({
            ownerId: req.user._id,
            title: req.body.title,
            start: startDate,
            end: endDate,
            uri: req.body.uri,
            description: req.body.description,
            visibility: req.body.visibility
        })
        let faculties = await User.find({status: {$in: ["admin", "faculty"]}})
        for (let idx in faculties) {
            let email = await faculties[idx].workEmail || faculties[idx].googleemail
            if (email && email !== 'shekenne@iupui.edu') {
                let eventName = newEvent.title
                let eventTime = parseInt(req.body.DST) === 0 ? new Date(newEvent.start - 300 * 60000) : new Date(newEvent.start - 240 * 60000)
                let eventDescription = newEvent.description
                let visibility = newEvent.visibility
                let url = 'https://www.enactnetwork.org/login'
                await sgMail.setApiKey(process.env.SENDGRID_API_KEY);
                const msg = {
                    to: email,
                    from: 'enact@brandeis.edu',
                    subject: 'ENACT Digital Platform: a new ENACT event has been created',
                    text: 'ENACT Digital Platform: a new ENACT event has been created',
                    html: 'Dear ENACT Faculty Fellow,' +
                        '<br><br>' + 'You may want to know about a new event: ' + '<br>' +
                        '<b>' + eventName + '</b>' +
                        '<br><br>' + 'Here is the event Description:' +
                        '<br><br>' + eventDescription +
                        '<br><br>' + 'Event will start at ' + '<b>' + eventTime.toLocaleString() + ' (in US/Canada Eastern Time)</b>' +
                        '<br><br>' + 'Event visibility is: ' + '<b>' + visibility + '</b>' +
                        '<br>Please click <a href=' + url + '>' + 'here' + '</a>' + ' to login, and more details can be viewed in ' + '<b>' + 'Events and Courses. ' + '</b>' +
                        '<br><br><br>' + 'ENACT Support Team'
                };
                try {
                    await sgMail.send(msg);
                } catch (e) {
                    console.log("SENDGRID EXCEPTION: ", e)
                }
            }
        }
        // }
        await newEvent.save()
        res.redirect('back')
    } catch (e) {
        next(e)
    }
}

exports.editEvent = async (req, res, next) => {
    try {
        let timezoneOffset = req.body.TZ
        timezoneOffset = parseInt(timezoneOffset) - new Date().getTimezoneOffset()
        let startDate = new Date(req.body.start).getTime() + parseInt(timezoneOffset) * 60000
        let endDate = new Date(req.body.end).getTime() + parseInt(timezoneOffset) * 60000
        let eventToEdit = await Event.findOne({_id: req.params.eventId})
        eventToEdit.title = req.body.title
        eventToEdit.start = startDate
        eventToEdit.end = endDate
        eventToEdit.uri = req.body.uri
        eventToEdit.description = req.body.description
        // eventToEdit.icon = req.body.icon
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

exports.updateImageURL = async (req, res, next) => {
    let eventToUpdate = await Event.findOne({_id: req.params.eventId})
    try {
        eventToUpdate.imageURL = req.body.imageURL;
        await eventToUpdate.save()
        res.redirect('back')
    } catch (e) {
        next(e)
    }
}

exports.sendEventEmail = async (req, res) => {
    let eventId = req.params.id
    console.log("id: ", eventId)
    let currEvent = await Event.findOne({_id: eventId})
    let eventName = currEvent.title
    let eventTime = parseInt(req.body.DST) === 0 ? new Date(currEvent.start - 300 * 60000) : new Date(currEvent.start - 240 * 60000)
    let eventDescription = currEvent.description
    let visibility = currEvent.visibility
    let faculties = await User.find({status: {$in: ["faculty", "admin"]}})
    for (let faculty in faculties) {
        let email = faculties[faculty].workEmail || faculties[faculty].googleemail
        if (email && email !== 'shekenne@iupui.edu') {
            let url = 'https://www.enactnetwork.org/login'
            const sgMail = require('@sendgrid/mail');
            sgMail.setApiKey(process.env.SENDGRID_API_KEY);
            const msg = {
                to: email,
                from: 'enact@brandeis.edu',
                subject: 'ENACT Digital Platform: a new ENACT event has been created',
                text: 'ENACT Digital Platform: a new ENACT event has been created',
                html: 'Dear ENACT Faculty Fellow,' +
                    '<br><br>' + 'You may want to know about a new event: ' + '<br>' +
                    '<b>' + eventName + '</b>' +
                    '<br><br>' + 'Here is the event Description:' +
                    '<br><br>' + eventDescription +
                    '<br><br>' + 'Event will start at ' + '<b>' + eventTime.toLocaleString() + ' (in US/Canada Eastern Time)</b>' +
                    '<br><br>' + 'Event visibility is: ' + '<b>' + visibility + '</b>' +
                    '<br>Please click <a href=' + url + '>' + 'here' + '</a>' + ' to login, and more details can be viewed in ' + '<b>' + 'Events and Courses. ' + '</b>' +
                    '<br><br><br>' + 'ENACT Support Team'
            };
            try {
                await sgMail.send(msg);
            } catch (e) {
                console.log("SENDGRID EXCEPTION: ", e)
            }
        }
    }
    res.send()
}

exports.loadEvents = async (req, res, next) => {
    let eventsInfo;
    if (res.locals.loggedIn) {
        eventsInfo = await Event.find({}).sort({start: -1}).limit(3)
    } else {
        eventsInfo = await Event.find({visibility: 'public'}).sort({start: -1}).limit(3)
    }
    // eventsInfo = eventsInfo.filter(({start}) => new Date(start).getTime() >= new Date().getTime());
    res.locals.eventsInfo = eventsInfo
    next()
}