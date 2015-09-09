var socketio = require('socket.io')

module.exports.listen = function (app) {
    io = socketio.listen(app)

    io.on('connection', function () {
        io.emit('user-details', "{\"Name\": \"Hello\"}");
    });
    var chunk = {
        blips: []
    };
    var blipSize = 16;

    function updateChunks() {
        chunk = {
            blips: []
        };
        for (var x = 0; x < 1024 / blipSize; x++) {
            for (var y = 0; y < 720 / blipSize; y++) {
                var r = Math.floor(Math.random() * 100 + 55);
                var g = Math.floor(Math.random() * 120 + 55);
                var b = Math.floor(55);
                chunk.blips.push({
                    rgb: "rgb(" + r + "," + g + "," + b + ")",
                    x: x * blipSize,
                    y: y * blipSize,
                    width: blipSize,
                    height: blipSize
                })
            };
        };
        io.emit('chunk-update', chunk)
    };
    updateChunks();

    return io
}