var socketio = require('socket.io')
var seedrandom = require('seedrandom');
var gameSeed = 53198032
seedrandom(gameSeed, {
    global: true
});
var biomeGenerator = require('./lib/procedural/biomeGenerator')();
var nameGenerator = require('./lib/procedural/names')();
var chunkList = require('./lib/chunkList')(biomeGenerator, nameGenerator);
var buildingList = require('./lib/buildingList')();
var collision = require('./lib/collision')();

module.exports.listen = function (app, playerList) {
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
        socket.emit('flush');
        socket.emit('seed', gameSeed)
        socket.emit('local-chunks', [startingChunk]);

        socket.on('new-player', function (player) {
            player.connectionReference = player.connectionReference || socket.handshake.user
            while (collision.detect(playerList.list, player.coordinates, player)) {
                player.coordinates.x -= 50;
            }
            socket.emit('move', player.coordinates);
            playerList.add(player);
            console.log(player);
            socket.emit('new-player', player.name);
        });

        socket.on('location-update', function (player) {
            var currentPlayer = playerList.find(player.id)
            if (collision.detect(playerList.list, player.coordinates, player)) {
                socket.emit('move', currentPlayer.coordinates);
                return;
            }
            var box = {
                minX: player.coordinates.x - 1000,
                maxX: player.coordinates.x + 1000,
                minY: player.coordinates.y - 1000,
                maxY: player.coordinates.y + 1000
            }
            player.connectionReference = player.connectionReference || socket.handshake.user
            playerList.update(player);
            var foundPlayers = playerList.within(box);
            if (foundPlayers.length > 1) {
                socket.emit('player-list-update', foundPlayers);
            }
            if (chunkList.needsChunks(player.coordinates, player.chunkHash)) {
                socket.emit('local-chunks', chunkList.getChunksNearby(player.coordinates));
            }
            if (buildingList.needsUpdate(box, player.buildingHash)) {
                socket.emit('local-buildings', buildingList.getBuildingsIn(box));
            }
        });

        socket.on('chunk-update', function (chunk) {
            chunkList.writeChunk(chunk);
        });

        socket.on('new-building', function (chunk) {
            buildingList.writeBuilding(chunk);
        });

        socket.on('disconnect', function () {
            playerList.removeByConnection(socket.handshake.user);
        });

        var pongTimeout = 0;
        setInterval(function () {
            socket.emit('ping')
            pongTimeout = setTimeout(function removePlayer() {
                playerList.removeByConnection(socket.handshake.user);
            }, 1000);
        }, 10000);

        socket.on('pong', function () {
            clearTimeout(pongTimeout);
        })

    });

    return io
}