function createUpdate(player, outgoingEvents, draw, controls, buildingInterface, chunkInterpreter) {
    var screenCoordinates = {
        x: 0,
        y: 0
    }
    var buildAt = {
        x: 0,
        y: 0
    };

    function moveScreenTo(newCoordinates) {
        screenCoordinates = newCoordinates;
    }

    var players = [player];

    setInterval(function () {
        outgoingEvents.locationUpdate(player)

    }, 1000 / 10);

    var mousePosition = {
        x: 0,
        y: 0
    };

    function setBlipLocation(blipCoordinates) {
        buildAt = blipCoordinates;
    }

    function runDraw(canvas, ctx) {
        draw.clearCanvas(canvas, ctx);
        draw.drawChunks(ctx, screenCoordinates, mousePosition, setBlipLocation);
        buildingInterface.drawBuildings(ctx, screenCoordinates);
        if (controls.buildingMode) {
            buildingInterface.drawBlueprint(ctx, buildAt, screenCoordinates);
        }
        draw.drawPlayers(ctx, screenCoordinates, players)
        draw.drawMiddleSection(ctx, controls)
        draw.drawMap(ctx, player.coordinates, screenCoordinates, controls)
    }

    return {
        mainLoop: function (canvas, ctx, seed) {
            runDraw(canvas, ctx);
            controls.controlIteration(players, screenCoordinates, moveScreenTo);

        },
        playerList: function (newList) {
            players = [player];
            _.forEach(newList, function (newPlayer) {
                if (player.id === newPlayer.id) {
                    return;
                }
                var fullPlayer = createPlayer(outgoingEvents, newPlayer.name, newPlayer.id, newPlayer.coordinates, newPlayer.facing);
                players.push(fullPlayer)
            });
        },
        movePlayer: function (newLocation) {
            player.coordinateChange(newLocation);
        },
        setMouseLocation: function (newPosition) {
            mousePosition = newPosition
        },
        tryToBuildAt: function (clickLocation) {
            var worldClickLocation = {
                x: clickLocation.x + screenCoordinates.x,
                y: clickLocation.y + screenCoordinates.y
            };
            var blipCoordinates = chunkInterpreter.getBlipClicked(worldClickLocation);
            var building = buildingInterface.buildFrom('chapel', blipCoordinates, players)
            if (building) {
                outgoingEvents.sendBuildingUpdate(building);
                controls.buildingMode = false;
            }
        },
        setSeed: function (newSeed) {
            seed = newSeed;
        }
    }
}