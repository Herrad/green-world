function init() {
    var gameSeed = 0;
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

    var buildingSpecs = createBuildingSpecs();

    var buildingFactory = createBuildingFactory(buildingSpecs);

    var buildingCache = createCache(buildingFactory.deserialise);

    var buildingInterface = createBuildingInterface(buildingSpecs, collisionDetection, buildingFactory, buildingCache);

    var player = createPlayer(outgoingEvents, $.cookie('character-name'));
    player.coordinateChange({
        x: Math.floor(gameScreenSize.gameWindowWidth / 2) + 32,
        y: Math.floor(gameScreenSize.height / 2) + 32
    })

    var controls = createControls(player, collisionDetection, gameScreenSize, buildingCache);

    var map = createMap(gameScreenSize, {
        x: 200,
        y: 200
    });
    var draw = createDraw(gameScreenSize, player, map, collisionDetection);

    var chunkCache = createCache();

    var incomingEvents = createIncomingEventHandler(buildingCache, chunkCache);

    var update = createUpdate(player, outgoingEvents, collisionDetection, draw, controls, buildingInterface, chunkCache);

    incomingEvents.registerEventHandlers(update, function (seed) {
        console.log("new seed: " + seed)
        gameSeed = seed
    });

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

    $('#gameScreen').on('click', function (e) {
        if (controls.buildingMode) {
            update.tryToBuildAt({
                x: e.offsetX,
                y: e.offsetY
            });
        }
    });

    setInterval(function () {
        if (!gameSeed) return;
        update.mainLoop(canvas, ctx, gameSeed)
    }, 1000 / 30);
    console.log('initialised');
}

window.onload = init;