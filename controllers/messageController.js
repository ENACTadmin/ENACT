'use strict';
const Resource = require('../models/Resource');
const User = require('../models/User');
const Message = require('../models/Message');
const Tag = require('../models/Tag');
const AuthorAlt = require('../models/AuthorAlternative');
const Event = require('../models/Event')

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
        res.locals.messageInfo = messageInfo
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
        let receiver = await User.findOne({_id: receivedBy})
        let sender = await User.findOne({_id: sentBy})
        let Email = receiver.workEmail || receiver.googleemail
        let senderName = sender.userName
        let receiverName = receiver.userName
        // send email to alternative users
        if (req.params.resourceId !== 'general') {
            let otherAuthors = await AuthorAlt.find({resourceId: req.params.resourceId})
            for (let i = 0; i < otherAuthors.length; i++) {
                let name = otherAuthors[i];
                let email = otherAuthors[i];
                send_email(email, name, newMessage, 'https://www.enactnetwork.org/messages/view/' + req.params.sender + '/' + req.params.receiver + '/' + req.params.resourceId)
            }
        }

        send_email(Email, senderName,receiverName, newMessage, 'https://www.enactnetwork.org/messages/view/' + req.params.sender + '/' + req.params.receiver + '/' + req.params.resourceId)
        res.redirect('back')
    } catch (e) {
        next(e)
    }
}


exports.sendResourceEmail = async (req, res) => {
    let userId = req.user.id
    let userToEmail = await User.findOne({_id: userId})
    const review = req.body.review;
    const sgMail = require('@sendgrid/mail');
    const msg = {
        to: userToEmail,
        from: "enact@brandeis.edu",
        subject: 'ENACT Digital Platform: you have one new notification.',
        text: 'ENACT Digital Platform: you have one new notification.',
        html: 'Hi, ' + userName + '<br>' +
            "<br>" + "An admin or faculty member has requested a change to your resource submission." +
            "<br>" + "Comment:" +
            "<br>" + "<b>" + review + "</b>" +
            '<br><br>' + 'ENACT Support Team'
    } 
    try {
        await sgMail.send(msg);
    } catch (e) {
        console.log("SENDGRID EXCEPTION: ", e)
    }
    res.render('./pages/deny')
}
exports.sendProfileEmail = async (req, res) => {
    let userId = req.params.id
    console.log("id: ", userId)
    let currUser = await User.findOne({_id: userId})
    let userName = currUser.userName
    let email = currUser.workEmail || currUser.googleemail
    let url = 'https://www.enactnetwork.org/login'
    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
        to: email,
        from: 'enact@brandeis.edu',
        subject: 'ENACT Digital Platform: you have one new notification.',
        text: 'ENACT Digital Platform: you have one new notification.',
        html: 'Hi, ' + userName + '<br>' +
            '<br>' + 'Your profile is set by ENACT admin, the default password is: ' + '<b>' + currUser.password + '</b>' + '<br>Please remember to change your password by navigating to <b>People & Networking -> Update profile</b> to change your password' +
            '<br>' + '<b>  Click <a href=' + url + '>' + 'here' + '</a>' + ' to login</b>' +
            '<br><br>' + 'ENACT Support Team'
    };
    try {
        await sgMail.send(msg);
    } catch (e) {
        console.log("SENDGRID EXCEPTION: ", e)
    }
    res.render('./pages/showProfile', {
        userInfo: currUser,
        sentStatus: 'Email Sent'
    })
}

function send_email(Email, senderName, receiverName, message, url) {
    console.log('email: ', Email)
    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    if (message.subject) {
        const msg = {
            to: Email,
            from: 'enact@brandeis.edu',
            subject: 'ENACT Digital Platform: you have one new message'+ senderName,
            text: 'ENACT Digital Platform: you have one new message from ' + senderName,
            html: 'Hi, '+receiverName+'<br><br>you received a message from ' + senderName + '<br>Here is the message content:'+
                '<br><br>' + 'Subject: ' + message.subject +
                '<br><br>' + 'Content:' + message.message +
                '<br><br>' + '<b>Click <a href=' + url + '>' + 'here' + '</a>' + ' to reply</b>' +
                '<br><br>' + 'ENACT Support Team' +
                '<br>'+'<img style=\'height: 120px; width: 120px\' src="/images/enact-logo.jpeg">'
        };
        try {
            sgMail.send(msg);
        } catch (e) {
            console.log("SENDGRID EXCEPTION: ", e)
        }
    } else {
        const msg = {
            to: Email,
            from: 'enact@brandeis.edu',
            subject: 'ENACT Digital Platform: you have one new message from ' + senderName,
            text: 'ENACT Digital Platform: you have one new message from ' + senderName,
            html: 'Hi, '+receiverName+'<br><br>you received a message from ' + senderName +'<br>Here is the message content:'+
                '<br><br>' + message.message +
                '<br><br>' + '<b>Click <a href=' + url + '>' + 'here' + '</a>' + ' to reply</b>' +
                '<br><br>' + 'ENACT Support Team <br>'+
                '<br>'+'<img style=\'height: 120px; width: 120px\' src="/images/enact-logo.jpeg">'
        };
        try {
            sgMail.send(msg);
        } catch (e) {
            console.log("SENDGRID EXCEPTION: ", e)
        }
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