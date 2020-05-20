var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  if (req.user && !req.user.userName) {
    console.log("first time user!");
    res.redirect('/')
  } else {
    res.render('index', {
      req: req,
      title: 'ENACT'
    })
  }
});

module.exports = router;