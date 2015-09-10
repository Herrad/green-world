function createEventHandler() {
    return {
        registerEventHandlers: function (update) {
            var socket = io();

            socket.on('chunk-update', function (data) {
                update.updateChunk(data)
            });

            socket.on('player-at', function (data) {
                update.drawPlayerAt(data)
            });
        }
    }
}