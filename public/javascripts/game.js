function init() {

    var gameScreen = $('#gameScreen');

    var canvas = document.getElementById('gameScreen');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    var ctx = canvas.getContext('2d');

    var gameScreenSize = {
        gameWindowWidth: gameScreen.width() - 501,
        realWidth: gameScreen.width(),
        height: gameScreen.height()
    };

    var outgoingEvents = createOutgoingEvents(gameScreenSize);

    var collisionDetection = createCollisionDetection();

    var player = createPlayer(outgoingEvents, $.cookie('character-name'));

    var controls = createControls(player, collisionDetection, gameScreenSize);

    var map = createMap(gameScreenSize, {
        x: 200,
        y: 200
    });
    var draw = createDraw(gameScreenSize, player, map);

    var update = createUpdate(player, outgoingEvents, collisionDetection, draw, controls);

    var incomingEvents = createIncomingEventHandler();

    incomingEvents.registerEventHandlers(update);

    outgoingEvents.newPlayer({
        id: player.id,
        coordinates: player.coordinates
    });

    $('body').on('keydown', function (e) {
        controls.keyDown(e.keyCode);
    });

    $('body').on('keyup', function (e) {
        controls.keyUp(e.keyCode);
    });

    setInterval(function () {
        update.mainLoop(canvas, ctx)
    }, 1000 / 30);
    console.log('initialised');
}

window.onload = init;