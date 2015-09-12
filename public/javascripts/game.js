var canvas = document.getElementById('screen');
var ctx = canvas.getContext('2d');

function init() {
    var outgoingEvents = createOutgoingEvents();

    var player = createPlayer(outgoingEvents);

    var collisionDetection = createCollisionDetection();

    var update = createUpdate(player, outgoingEvents, collisionDetection);

    var incomingEvents = createIncomingEventHandler();

    incomingEvents.registerEventHandlers(update);

    outgoingEvents.newPlayer({
        id: player.id,
        coordinates: player.coordinates
    });

    setInterval(update.mainLoop, 1000 / 60);
    console.log('initialised');
}

window.onload = init;