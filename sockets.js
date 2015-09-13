var socketio = require('socket.io')
var players = require('./lib/players')();
var biomeGenerator = require('./lib/procedural/biomeGenerator')();
var chunkList = require('./lib/chunkList')(biomeGenerator);

module.exports.listen = function (app) {
    io = socketio.listen(app)

    function generateGuid() {
        var result, i, j;
        result = '';
        for (j = 0; j < 32; j++) {
            if (j == 8 || j == 12 || j == 16 || j == 20)
                result = result + '-';
            i = Math.floor(Math.random() * 16).toString(16).toUpperCase();
            result = result + i;
        }
        return result
    }
    var startingChunk = chunkList.findChunkAt({
        x: 0,
        y: 0
    });

    io.sockets.on('connection', function (socket) {
        socket.handshake.user = generateGuid();
        socket.emit('chunk-update', startingChunk);

        socket.on('new-player', function (player) {
            player.connectionReference = player.connectionReference || socket.handshake.user
            players.add(player);
        });

        socket.on('location-update', function (player) {
            var box = {
                minX: player.coordinates.x - 2000,
                maxX: player.coordinates.x + 2000,
                minY: player.coordinates.y - 2000,
                maxY: player.coordinates.y + 2000
            }
            player.connectionReference = player.connectionReference || socket.handshake.user
            players.update(player);
            var foundPlayers = players.within(box);
            socket.emit('player-list-update', foundPlayers);
            socket.emit('local-chunks', chunkList.getChunksNearby(player.coordinates));
        });

        socket.on('disconnect', function () {
            players.removeByConnection(socket.handshake.user);
        });

        var pongTimeout = 0;
        setInterval(function () {
            socket.emit('ping')
            pongTimeout = setTimeout(function removePlayer() {
                players.removeByConnection(socket.handshake.user);
            }, 1000);
        }, 10000);

        socket.on('pong', function () {
            clearTimeout(pongTimeout);
        })

    });

    return io
}