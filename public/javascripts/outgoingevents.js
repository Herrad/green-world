function createOutgoingEvents(){
    var socket = io();

	return {
		playerLocationUpdate: function(player){
			socket.emit('player-location-update', {coordinates:player.coordinates});
		}
	}
}