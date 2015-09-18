var express = require('express');
var router = express.Router();
var io = require('socket.io');

/* GET home page. */
router.get('/', function (req, res) {
    res.render('index', {
        title: 'Green World'
    });
});

router.post('/createCharacter', function (req, res) {
    res.cookie('character-name', req.body['characterName']);
    res.redirect('/game')
});

router.get('/game', function (req, res) {
    console.dir(req);
    if (!req.cookies['character-name']) {
        return res.redirect('/');
    }
    res.render('game', {
        title: 'Green World'
    });
});

module.exports = router;