'use strict';
const Resource = require('../models/Resource');
const User = require('../models/User');
const Message = require('../models/Message');
const Tag = require('../models/Tag');
const AuthorAlt = require('../models/AuthorAlternative');


exports.loadMessagingPage = async (req, res, next) => {
    try {
        let senderId = req.params.sender
        let receiverId = req.params.receiver
        let resourceId = req.params.resourceId
        let senderInfo = await User.findOne({_id: senderId})
        let receiverInfo = await User.findOne({_id: receiverId})

        let resourceInfo
        if (resourceId === 'general') {
            resourceInfo = null
        } else {
            resourceInfo = await Resource.findOne({_id: resourceId})
        }

        res.locals.senderInfo = senderInfo
        res.locals.receiverInfo = receiverInfo
        res.locals.resourceInfo = resourceInfo
        let messageInfo
        if (resourceId === 'general') {
            messageInfo = await Message.find({
                $and: [
                    {senderId: senderId, receiverId: receiverId, relevantResourceId: {$exists: false}},
                ]
            }).sort({createdAt: 1})
        } else {
            messageInfo = await Message.find({
                $and: [
                    {senderId: senderId, receiverId: receiverId, relevantResourceId: resourceId},
                ]
            }).sort({createdAt: 1})
        }
        res.locals.messageInfo = await messageInfo
        res.render('./pages/message')
    } catch (e) {
        next(e)
    }
}

exports.saveMessage = async (req, res, next) => {
    try {
        let sentBy = req.user._id
        let receivedBy
        if (sentBy.equals(req.params.sender)) {
            receivedBy = req.params.receiver
        } else {
            receivedBy = req.params.sender
        }
        let newMessage
        if (req.params.resourceId === 'general') {
            newMessage = Message({
                senderId: req.params.sender,
                receiverId: req.params.receiver,
                sentBy: sentBy,
                receivedBy: receivedBy,
                subject: req.body.subject,
                message: req.body.message,
                createdAt: new Date()
            })
        } else {
            newMessage = Message({
                senderId: req.params.sender,
                receiverId: req.params.receiver,
                sentBy: sentBy,
                receivedBy: receivedBy,
                relevantResourceId: req.params.resourceId,
                subject: req.body.subject,
                message: req.body.message,
                createdAt: new Date()
            })
        }
        await newMessage.save()
        let receiver = await User.findOne({_id: req.params.receiver})
        let workEmail = receiver.workEmail
        let userName = receiver.userName
        // send email to alternative users
        if (req.params.resourceId !== 'general') {
            let otherAuthors = await AuthorAlt.find({resourceId: req.params.resourceId})
            for (let i = 0; i < otherAuthors.length; i++) {
                let name = otherAuthors[i];
                let email = otherAuthors[i];
                send_email(email, name, newMessage, 'http://enact-brandeis.herokuapp.com/' + 'message/' + req.params.sender + '/' + req.params.receiver + '/' + req.params.resourceId)
            }
        }
        send_email(workEmail, userName, newMessage, 'http://enact-brandeis.herokuapp.com/' + 'message/' + req.params.sender + '/' + req.params.receiver + '/' + req.params.resourceId)
        res.redirect('back')
    } catch (e) {
        next(e)
    }
}

exports.sendProfileEmail = async (req, res, next) => {
    let userId = req.params.id
    console.log("id: ", userId)
    let currUser = await User.findOne({_id: userId})
    let userName = currUser.userName
    let email = currUser.workEmail || currUser.googleemail
    let url = 'http://enact-brandeis.herokuapp.com/'
    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
        to: email,
        from: 'enact@brandeis.edu',
        subject: 'ENACT Digital Platform: you have one new message from ' + userName,
        text: 'ENACT Digital Platform: you have one new message from ' + userName,
        html: 'Hi,' +
            '<br>' + '  Your profile is set by ENACT admin, the default password is: ' + currUser.password + '<br>Please remember to change your password by navigating to Settings -> Update profile to change your password' +
            '<br>' + '<b>  Click <a href=' + url + '>' + 'here' + '</a>' + ' to login</b>' +
            '<br><br>' + 'ENACT Support Team'
    };
    await sgMail.send(msg);
    res.render('./pages/showProfile', {
        userInfo: currUser,
        sentStatus: 'Email Sent'
    })
}

function send_email(workEmail, userName, message, url) {
    console.log('email: ', workEmail)
    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    if (message.subject) {
        const msg = {
            to: workEmail,
            from: 'enact@brandeis.edu',
            subject: 'ENACT Digital Platform: you have one new message from ' + userName,
            text: 'ENACT Digital Platform: you have one new message from ' + userName,
            html: 'Hi, <br><br>you received a message from  ' + userName +
                '<br>' + '<b>Subject</b>: ' + message.subject +
                '<br>' + '<b>Content</b>: ' + message.message +
                '<br>' + '<b>Time</b>: ' + message.createdAt +
                '<br>' + '<b>Click <a href=' + url + '>' + 'here' + '</a>' + ' to reply</b>' +
                '<br><br>' + 'ENACT Support Team'
        };
        sgMail.send(msg);
    } else {
        const msg = {
            to: workEmail,
            from: 'enact@brandeis.edu',
            subject: 'ENACT Digital Platform: you have one new message from ' + userName,
            text: 'ENACT Digital Platform: you have one new message from ' + userName,
            html: 'Hi, <br><br>you received a message from ' + userName +
                '<br>' + '<b>Content</b>: ' + message.message +
                '<br>' + '<b>Time</b>: ' + message.createdAt +
                '<br>' + '<b>Click <a href=' + url + '>' + 'here' + '</a>' + ' to reply</b>' +
                '<br><br>' + 'ENACT Support Team'
        };
        sgMail.send(msg);
    }
}

exports.loadMessageBoard = async (req, res, next) => {
    try {
        let userId = req.user._id
        let messageInfo = await Message.find({
            $and: [
                {
                    $or: [
                        {senderId: userId}, {receiverId: userId}
                    ]
                },
                {
                    relevantResourceId: {$exists: true}
                }
            ]
        })
        let messageInfo_general = await Message.find({
            $and: [
                {
                    $or: [
                        {senderId: userId}, {receiverId: userId}
                    ]
                },
                {
                    relevantResourceId: {$exists: false}
                }
            ]
        })
        let resourceInfo = await Resource.find({
            checkStatus: 'underReview',
            facultyId: req.user._id
        })
        let approveInfo = await Resource.find({
            checkStatus: 'approve',
            ownerId: req.user._id
        })
        let denyInfo = await Resource.find({
            checkStatus: 'deny',
            ownerId: req.user._id
        })
        let publicInfo = await Resource.find({
            status: 'public',
            ownerId: req.user._id
        })
        let tagsInfo = await Tag.find({
            ownerId: req.user._id
        })
        res.locals.resourceNum = await resourceInfo.length
        res.locals.messageInfo = await messageInfo
        res.locals.messageInfo_general = await messageInfo_general
        res.locals.approveInfo = await approveInfo
        res.locals.denyInfo = await denyInfo
        res.locals.publicInfo = await publicInfo
        res.locals.tagsInfo = await tagsInfo
        res.render('./pages/messageBoard')
    } catch (e) {
        next(e)
    }
}