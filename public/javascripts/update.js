function createUpdate(player, outgoingEvents, collisionDetection, draw, controls, buildingInterface, chunkCache) {
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
        var serialsedPlayer = player.serialise(chunkCache.hash, buildingCache.hash)
        outgoingEvents.locationUpdate(serialsedPlayer)

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
        draw.drawChunks(ctx, chunkCache.data, screenCoordinates, mousePosition, setBlipLocation);
        buildingInterface.drawBuildings(ctx, screenCoordinates);
        if (controls.buildingMode) {
            buildingInterface.drawBlueprint(ctx, buildAt, screenCoordinates);
        }
        draw.drawPlayers(ctx, screenCoordinates, players)
        draw.drawInventory(ctx)
        draw.drawMap(ctx, chunkCache.data, player.coordinates, screenCoordinates, controls)
    }

    function findBlipCoordinatesOfClick(clickLocationInWorld) {

        var coordinates;
        _.forEach(chunkCache.data, function (chunk) {
            var chunkRectangle = {
                x: chunk.coordinates.x,
                y: chunk.coordinates.y,
                width: chunk.coordinates.x + chunk.dimensions.width,
                height: chunk.coordinates.y + chunk.dimensions.height
            }
            if (collisionDetection.pointingAt(clickLocationInWorld, chunkRectangle)) {
                _.forEach(chunk.blips, function (blip) {
                    var blipRectangle = {
                        x: chunk.coordinates.x + blip.x,
                        y: chunk.coordinates.y + blip.y,
                        width: chunk.coordinates.x + blip.x + blip.width,
                        height: chunk.coordinates.y + blip.y + blip.height
                    };
                    if (collisionDetection.pointingAt(clickLocationInWorld, blipRectangle)) {
                        coordinates = {
                            x: chunk.coordinates.x + blip.x,
                            y: chunk.coordinates.y + blip.y
                        };
                    }
                });
            }
        });

        return coordinates;
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
            var blipCoordinates = findBlipCoordinatesOfClick(worldClickLocation);
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