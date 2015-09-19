function createIncomingEventHandler() {
    return {
        registerEventHandlers: function (update) {
            var socket = io();

            socket.on('player-list-update', function (players) {
                update.playerList(players);
            });

            socket.on('ping', function () {
                socket.emit('pong')
            });
            socket.on('local-chunks', function (data) {
                update.chunksArrived(data);
            });
            socket.on('local-buildings', function (data) {
                update.buildingsArrived(data);
            });
            socket.on('move', function (data) {
                update.movePlayer(data);
            });
        }
    }
}