var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('live', { title: `${user}的直播间` });
});

module.exports = router;
