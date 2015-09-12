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
            });
            socket.on('player-list-update', function (players) {
                update.playerList(players);
            });

            socket.on('ping', function () {
                socket.emit('pong')
            });
        }
    }
}