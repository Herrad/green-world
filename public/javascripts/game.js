function init() {
    var gameSeed = 0;
    var canvas = document.getElementById('gameScreen');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    var ctx = canvas.getContext('2d');

    var gameScreenSize = {
        gameWindowWidth: canvas.width - Math.floor(canvas.width / 4),
        realWidth: canvas.width,
        height: canvas.height
    };
    var warnings = createWarningLayer(gameScreenSize);
    setInterval(function () {
        warnings.add("Hello!", 1000);
    }, 2000)

    var collisionDetection = createCollisionDetection();

    var buildingSpecs = createBuildingSpecs();

    var buildingFactory = createBuildingFactory(buildingSpecs);

    var chunkCache = createCache();

    var buildingCache = createCache(buildingFactory.deserialise);

    var outgoingEvents = createOutgoingEvents(gameScreenSize, chunkCache, buildingCache);

    var inventory = createInventory([{
        name: 'stone',
        quantity: 64
    }, {
        name: 'wood',
        quantity: 64
    }]);
    var player = createPlayer($.cookie('character-name'), inventory);
    player.coordinateChange({
        x: Math.floor(gameScreenSize.gameWindowWidth / 2) + 32,
        y: Math.floor(gameScreenSize.height / 2) + 32
    });
    player.inventory = inventory;

    var buildingInterface = createBuildingInterface(buildingSpecs, collisionDetection, buildingFactory, player, buildingCache);

    var controls = createControls(player, collisionDetection, gameScreenSize, buildingCache);

    var rightPanelInternalX = gameScreenSize.realWidth - Math.floor(gameScreenSize.realWidth / 4.19) < 600 ? 600 : gameScreenSize.realWidth - Math.floor(gameScreenSize.realWidth / 4.19);
    var rightPanelDimensions = {
        internal: {
            x: rightPanelInternalX,
            y: Math.floor(gameScreenSize.realWidth / 160),
            width: Math.floor(gameScreenSize.realWidth / 4.19),
            height: gameScreenSize.height - Math.floor(gameScreenSize.realWidth / 160)
        },
        external: {
            x: gameScreenSize.realWidth - Math.floor(gameScreenSize.realWidth / 4),
            y: 0,
            width: Math.floor(gameScreenSize.realWidth / 3.84),
            height: gameScreenSize.height
        },
        textX: rightPanelInternalX + 8,
        info: {
            nameY: Math.floor(gameScreenSize.height / 21.6),
            coordinatesY: Math.floor(gameScreenSize.height / 10.8),
            fontSize: Math.floor(gameScreenSize.realWidth / 48)
        },
        collapsedMap: {
            x: rightPanelInternalX,
            y: gameScreenSize.height - Math.floor(gameScreenSize.height / 7.7),
            width: Math.floor(gameScreenSize.realWidth / 4),
            text: {
                fontSize: Math.floor(gameScreenSize.realWidth / 64),
                x: gameScreenSize.realWidth - Math.floor(gameScreenSize.realWidth / 5.35),
                y: gameScreenSize.height - Math.floor(gameScreenSize.realWidth / 64) - Math.floor(gameScreenSize.height / 32)
            }
        },
        map: {
            x: rightPanelInternalX,
            y: gameScreenSize.height - Math.floor(gameScreenSize.realWidth / 4),
            width: Math.floor(gameScreenSize.realWidth / 4),
            height: Math.floor(gameScreenSize.realWidth / 4)
        },
        middlePanel: {
            x: rightPanelInternalX,
            y: Math.floor(gameScreenSize.height / 8.1),
            width: Math.floor(gameScreenSize.realWidth / 4.2),
            height: gameScreenSize.height - (Math.floor(gameScreenSize.height / 8.1) + Math.floor(gameScreenSize.height / 14)) - Math.floor(gameScreenSize.height / 7.7),
            title: {
                x: rightPanelInternalX + 8,
                y: Math.floor(gameScreenSize.height / 5.8)
            },
            inventory: {
                y: Math.floor(gameScreenSize.height / 8.1) + Math.floor(gameScreenSize.height / 14)
            },
            items: {
                fontSize: Math.floor(gameScreenSize.height / 49)
            },
            fontSize: Math.floor(gameScreenSize.height / 24.5)
        }
    }
    var map = createMap({
        x: Math.floor(gameScreenSize.realWidth / 9.6),
        y: Math.floor(gameScreenSize.realWidth / 9.6)
    }, rightPanelDimensions);

    var inventoryArtist = createInventoryArtist(gameScreenSize, inventory, rightPanelDimensions);

    var draw = createDraw(gameScreenSize, player, map, collisionDetection, chunkCache, inventoryArtist, rightPanelDimensions);

    var incomingEvents = createIncomingEventHandler(buildingCache, chunkCache);

    var chunkInterpreter = createChunkInterpreter(chunkCache, collisionDetection);

    var update = createUpdate(player, outgoingEvents, draw, controls, buildingInterface, chunkInterpreter, warnings);

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