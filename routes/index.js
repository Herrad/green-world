var express = require('express');
var router = express.Router();
var io = require('socket.io');

module.exports = function createRoutes(playerList) {
    /* GET home page. */
    router.get('/', function (req, res) {
        res.render('index', {
            title: 'Green World',
            error: req.query.error
        });
    });

    router.post('/createCharacter', function (req, res) {
        var characterName = req.body.characterName;
        res.cookie('character-name', characterName);
        res.redirect('/game')
    });

    router.get('/game', function (req, res) {
        if (!req.cookies['character-name']) {
            return res.redirect('/?error=You need a character name');
        }
        var characterName = req.cookies['character-name'];
        if (playerList.hasPlayerWithName(characterName)) {
            res.cookie('character-name', '');
            return res.redirect('/?error=Character ' + characterName + ' already exists');
        }
        res.render('game', {
            title: 'Green World'
        });
    });

    return router;
}