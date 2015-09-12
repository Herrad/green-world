function createOutgoingEvents() {
    var socket = io();

    return {
        // playerLocationUpdate: function (coordinates) {
        //     socket.emit('player-location-update', {
        //         coordinates: coordinates
        //     });
        // },
        newPlayer: function (player) {
            console.log('emit new player')
            socket.emit('new-player', player);
        },
        locationUpdate: function (player) {
            socket.emit('location-update', player);

        }
    }
}