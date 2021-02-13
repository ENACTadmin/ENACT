'use strict';
const Event = require('../models/Event');
const Faculty = require('../models/Faculty');


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
            // icon: req.body.icon,
            visibility: req.body.visibility
        })
        let faculties = await Faculty.find()
        for (let faculty in faculties) {
            let email = faculties[faculty].email
            console.log('email: ', email)
            if (email) {
                console.log('email: ', email)
                let url = 'https://www.enactnetwork.org/events'
                const sgMail = require('@sendgrid/mail');
                sgMail.setApiKey(process.env.SENDGRID_API_KEY);
                const msg = {
                    to: email,
                    from: 'enact@brandeis.edu',
                    subject: 'ENACT Digital Platform: you have one new notification.',
                    text: 'ENACT Digital Platform: you have one new notification.',
                    html: 'Dear ENACT Faculty Fellow,' + '<br>' +
                        '<br>' + 'A new ENACT event has been created. <br>The event title is: ' + newEvent.title + '<br>' + '<b> Click <a href=' + url + '>' + 'here' + '</a>' + ' to view the details.</b>' +
                        '<br><br>' + 'ENACT Support Team'
                };
                await sgMail.send(msg);
            }
        }
        await newEvent.save()
        res.redirect('back')
    } catch (e) {
        next(e)
    }
}

exports.editEvent = async (req, res, next) => {
    try {
        console.log("start: ", req.body.start)
        console.log("end: ", req.body.end)
        let timezoneOffset = req.body.TZ
        console.log("TZ is: ", timezoneOffset)
        timezoneOffset = parseInt(timezoneOffset) - new Date().getTimezoneOffset()
        console.log("timezone offset is: ", timezoneOffset)
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