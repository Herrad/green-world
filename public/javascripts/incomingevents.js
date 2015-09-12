function createIncomingEventHandler() {
    return {
        registerEventHandlers: function (update) {
            var socket = io();

            socket.on('chunk-update', function (data) {
                update.updateChunk(data)
            });

            socket.on('player-at', function (data) {
                update.drawPlayerAt(data)
            });

            socket.on('new-player', function (player) {
                update.registerNewPlayer(player);
            })
        }
    }
}