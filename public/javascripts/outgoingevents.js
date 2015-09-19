function createOutgoingEvents(screenSize) {
    var socket = io();

    return {
        newPlayer: function (player) {
            console.log('emit new player')
            socket.emit('new-player', player);
        },
        locationUpdate: function (player) {
            player.screenSize = screenSize
            socket.emit('location-update', player);
        },
        sendChunkUpdate: function (chunk) {
            socket.emit('chunk-update', chunk);
        }
    }
}