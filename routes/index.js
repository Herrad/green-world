var express = require('express');
var router = express.Router();
var io = require('socket.io');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Green World' });
});

module.exports = router;
