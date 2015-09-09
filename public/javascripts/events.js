function createEventHandler() {
    return {
        registerEventHandlers: function (update) {
            var socket = io();

            socket.on('chunk-update', function (data) {
                console.log('new chunk')
                update.updateChunk(data)
            });
        }
    }
}