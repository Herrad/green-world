function init() {

    var gameScreen = $('#gameScreen');

    var canvas = document.getElementById('gameScreen');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    var ctx = canvas.getContext('2d');

    var gameScreenSize = {
        width: gameScreen.width(),
        height: gameScreen.height()
    };

    var outgoingEvents = createOutgoingEvents(gameScreenSize);

    var draw = createDraw(gameScreenSize);

    var collisionDetection = createCollisionDetection();

    var player = createPlayer(outgoingEvents, $.cookie('character-name'));

    var controls = createControls(player, collisionDetection, gameScreenSize);

    $('body').on('keydown', function (e) {
        controls.keyDown(e.keyCode);
    });

    $('body').on('keyup', function (e) {
        controls.keyUp(e.keyCode);
    });

    var update = createUpdate(player, outgoingEvents, collisionDetection, draw, controls);

    var incomingEvents = createIncomingEventHandler();

    incomingEvents.registerEventHandlers(update);

    outgoingEvents.newPlayer({
        id: player.id,
        coordinates: player.coordinates
    });

    setInterval(function () {
        update.mainLoop(canvas, ctx)
    }, 1000 / 30);
    console.log('initialised');
}

window.onload = init;