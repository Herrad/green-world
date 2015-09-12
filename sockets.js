var socketio = require('socket.io')

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

    io.sockets.on('connection', function (socket) {
        socket.emit('chunk-update', chunk);

        socket.on('update-players', function (player) {
            console.log('new-player')
            io.sockets.emit('new-player', player)
        });

    });

    return io
}