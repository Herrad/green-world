var socketio = require('socket.io')
var players = require('./lib/players')();

module.exports.listen = function (app) {
    io = socketio.listen(app)

    var chunk = {
        blips: []
    };
    var blipSize = 64;

    function updateChunks() {
        chunk = {
            blips: []
        };
        for (var x = 0; x < 50; x++) {
            for (var y = 0; y < 50; y++) {
                var r = Math.floor(Math.random() * 50 + 100);
                var g = Math.floor(Math.random() * 80 + 100);
                var b = Math.floor(20);
                chunk.blips.push({
                    rgb: "rgb(" + r + "," + g + "," + b + ")",
                    x: x * blipSize,
                    y: y * blipSize,
                    width: blipSize,
                    height: blipSize
                })
            };
        };
        return chunk;
    };
    var chunk = updateChunks();

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

    io.sockets.on('connection', function (socket) {
        socket.handshake.user = generateGuid();
        socket.emit('chunk-update', chunk);

        socket.on('new-player', function (player) {
            player.connectionReference = player.connectionReference || socket.handshake.user
            players.add(player);
        });

        socket.on('location-update', function (player) {
            var box = {
                minX: player.coordinates.x - 1024 / 2 - 32,
                maxX: player.coordinates.x + 1024 / 2 - 32,
                minY: player.coordinates.y - 720 / 2 - 32,
                maxY: player.coordinates.y + 720 / 2 - 32
            }
            player.connectionReference = player.connectionReference || socket.handshake.user
            players.update(player);
            var foundPlayers = players.within(box);
            socket.emit('player-list-update', foundPlayers);
        });

        socket.on('disconnect', function () {
            players.removeByConnection(socket.handshake.user);
        })

    });

    return io
}