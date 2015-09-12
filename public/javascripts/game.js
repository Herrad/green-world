var canvas = document.getElementById('screen');
var ctx = canvas.getContext('2d');

function init() {
    var outgoingEvents = createOutgoingEvents();

    var collisionDetection = createCollisionDetection();

    var player = createPlayer(outgoingEvents);

    var update = createUpdate(player, outgoingEvents, collisionDetection);

    var incomingEvents = createIncomingEventHandler();

    incomingEvents.registerEventHandlers(update);

    outgoingEvents.newPlayer({
        id: player.id,
        coordinates: player.coordinates
    });

    setInterval(update.mainLoop, 1000 / 30);
    console.log('initialised');
}

window.onload = init;