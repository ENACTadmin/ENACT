'use strict';
const Resource = require('../models/Resource');
const User = require('../models/User');
const Message = require('../models/Message');


exports.loadMessagingPage = async (req, res, next) => {
    try {
        let senderId = await req.params.sender
        let receiverId = await req.params.receiver
        let resourceId = await req.params.resourceId
        console.log("idid: ", resourceId)
        let senderInfo = await User.findOne({_id: senderId})
        let receiverInfo = await User.findOne({_id: receiverId})
        let resourceInfo = await Resource.findOne({_id: resourceId})
        console.log('info: ', resourceInfo)
        res.locals.senderInfo = await senderInfo
        res.locals.receiverInfo = await receiverInfo
        res.locals.resourceInfo = await resourceInfo
        let messageInfo = Message.find({
            $or: [
                {senderId: senderId, receiverId: receiverId},
            ]
        }).sort({createdAt: 1})
        res.locals.messageInfo = await messageInfo
        res.render('./pages/message')
    } catch (e) {
        next(e)
    }
}

exports.saveMessage = async (req, res, next) => {
    try {
        let sentBy = await req.user._id
        let receivedBy
        if (sentBy.equals(await req.params.sender)) {
            receivedBy = await req.params.receiver
        } else {
            receivedBy = await req.params.sender
        }
        console.log('sb: ', await req.body.subject)
        let newMessage = Message({
            senderId: await req.params.sender,
            receiverId: await req.params.receiver,
            sentBy: sentBy,
            receivedBy: receivedBy,
            relevantResourceId: await req.params.resourceId,
            subject: await req.body.subject,
            message: await req.body.message,
            createdAt: new Date()
        })
        await newMessage.save()
        res.redirect('back')
    } catch (e) {
        next(e)
    }
}

exports.loadMessageBoard = async (req, res, next) => {
    try {
        let userId = req.user._id
        let messageInfo = await Message.find({
            $or: [
                {senderId: userId}, {receiverId: userId}
            ]
        })
        res.locals.messageInfo = await messageInfo
        res.render('./pages/messageBoard')
    } catch (e) {
        next(e)
    }
}