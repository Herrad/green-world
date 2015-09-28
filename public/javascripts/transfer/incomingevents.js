function createIncomingEventHandler(buildingCache, chunkCache, eventLog) {
    return {
        registerEventHandlers: function (update, seedCallback) {
            var socket = io();

            socket.on('player-list-update', function (players) {
                update.playerList(players);
            });

            socket.on('ping', function () {
                socket.emit('pong')
            });
            socket.on('local-chunks', function (data) {
                chunkCache.incoming(data);
            });
            socket.on('local-buildings', function (data) {
                buildingCache.incoming(data);
            });
            socket.on('move', function (data) {
                update.movePlayer(data);
            });
            socket.on('flush', function () {
                buildingCache.flush();
                chunkCache.flush();
            });
            socket.on('seed', function (seed) {
                seedCallback(seed);
            });
            socket.on('new-player', function (playerName) {
                eventLog.info(playerName + " connected", 3000)
            });
            socket.on('player-left', function (player) {
                eventLog.info(player.name + " disconnected", 3000);
                update.removePlayer(player.id);
            });
        }
    }
}