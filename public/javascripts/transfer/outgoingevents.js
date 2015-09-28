function createOutgoingEvents(screenSize, chunkCache, buildingCache) {
    var socket = io();

    return {
        newPlayer: function (player) {
            console.log('emit new player')
            socket.emit('new-player', player);
        },
        locationUpdate: function (player) {
            var serialisedPlayer = player.serialise(chunkCache.hash, buildingCache.hash)
            serialisedPlayer.screenSize = screenSize
            socket.emit('location-update', serialisedPlayer);
        },
        sendChunkUpdate: function (chunk) {
            socket.emit('chunk-update', chunk);
        },
        sendBuildingUpdate: function (building) {
            socket.emit('new-building', building);
        },
        disconnect: function () {
            socket.emit('disconnect');
        }
    }
}