function init() {

    var canvas = document.getElementById('gameScreen');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    var ctx = canvas.getContext('2d');

    var gameScreenSize = {
        gameWindowWidth: canvas.width - 501,
        realWidth: canvas.width,
        height: canvas.height //gameScreen.height()
    };

    var outgoingEvents = createOutgoingEvents(gameScreenSize);

    var collisionDetection = createCollisionDetection();

    var player = createPlayer(outgoingEvents, $.cookie('character-name'));
    player.coordinateChange({
        x: Math.floor(gameScreenSize.gameWindowWidth / 2) + 32,
        y: Math.floor(gameScreenSize.height / 2) + 32
    })

    var controls = createControls(player, collisionDetection, gameScreenSize);

    var map = createMap(gameScreenSize, {
        x: 200,
        y: 200
    });
    var draw = createDraw(gameScreenSize, player, map, collisionDetection);

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

    $('#gameScreen').on('mousemove', function (e) {
        if (e.layerX) {
            update.setMouseLocation({
                x: e.layerX,
                y: e.layerY
            });
        } else {
            update.setMouseLocation({
                x: e.offsetX,
                y: e.offsetY
            });
        }
    });

    setInterval(function () {
        update.mainLoop(canvas, ctx)
    }, 1000 / 30);
    console.log('initialised');
}

window.onload = init;