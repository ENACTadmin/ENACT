const express = require('express');
const router = express.Router();
const passport = require('passport');
const flash = require('connect-flash');
const bodyParser = require("body-parser");

// Register passport middleware
router.use(flash());
router.use(passport.initialize(1));
router.use(passport.session(1));
router.use(bodyParser.urlencoded({extended: false}));

//*******************************************
//***********AWS S3 storage setup************
const aws = require('aws-sdk');

/*
* Configure the AWS region of the target bucket.
* Remember to change this to the relevant region.
*/
aws.config.region = 'us-east-2';

const S3_BUCKET = process.env.S3_BUCKET || 'enact-resources'

/*
* Respond to GET requests to /signAWS.
* Upon request, return JSON containing the temporarily-signed S3 request and
* the anticipated URL of the image.
*/
router.get('/sign-s3', (req, res) => {
    const s3 = new aws.S3({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    });
    const fileName = req.query['file-name'];
    const fileType = req.query['file-type'];
    const s3Params = {
        Bucket: S3_BUCKET,
        Key: fileName,
        Expires: 60,
        ContentType: fileType,
        ACL: 'public-read'
    };

    s3.getSignedUrl('putObject', s3Params, (err, data) => {
        if (err) {
            console.log(err);
            return res.end();
        }
        const returnData = {
            signedRequest: data,
            url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`
        };
        res.write(JSON.stringify(returnData));
        res.end();
    });
});

module.exports = router;
