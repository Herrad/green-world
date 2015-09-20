function createUpdate(player, outgoingEvents, collisionDetection, draw, controls, buildings, buildingInterface) {
    var screenCoordinates = {
        x: 0,
        y: 0
    }
    var chunksToDraw = [];
    var chunkHash = '';
    var buildAt = {
        x: 0,
        y: 0
    };

    var buildingsToDraw = []
    var buildingHash = ''

    function moveScreenTo(newCoordinates) {
        screenCoordinates = newCoordinates;
    }

    function acceptHashable(newHashable, oldHashable) {
        if (!newHashable) return;
        if (oldHashable.length + newHashable.length > 100) {
            oldHashable = _.takeRight(oldHashable, 100);
        }
        for (var i = newHashable.length - 1; i >= 0; i--) {
            _.remove(oldHashable, {
                hash: newHashable[i].hash
            });
            oldHashable.push(newHashable[i]);
        };
        return oldHashable;
    }

    function buildHash(hashable) {
        var hash = ''
        _.chain(hashable)
            .sortByAll(['coordinates.x', 'coordinates.y'])
            .forEach(function (hasher) {
                hash += hasher.hash;
            }).value();
        return hash
    }

    var players = [player];

    setInterval(function () {
        var serialsedPlayer = player.serialise(chunkHash, buildingHash)
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
        draw.drawChunks(ctx, chunksToDraw, screenCoordinates, mousePosition, setBlipLocation);
        buildingInterface.drawBuildings(ctx, buildingsToDraw, screenCoordinates);
        if (controls.buildingMode) {
            buildingInterface.drawBlueprint(ctx, "chapel", buildAt, screenCoordinates);
        }
        draw.drawPlayers(ctx, screenCoordinates, players)
        draw.drawInventory(ctx)
        draw.drawMap(ctx, chunksToDraw, player.coordinates, screenCoordinates, controls)
    }

    return {
        mainLoop: function (canvas, ctx) {
            runDraw(canvas, ctx);
            controls.controlIteration(players, screenCoordinates, moveScreenTo);

        },
        flush: function () {
            chunksToDraw = [];
            buildingsToDraw = []
        },
        chunksArrived: function (chunks) {
            chunksToDraw = acceptHashable(chunks, chunksToDraw);
            chunkHash = buildHash(chunks);
        },
        buildingsArrived: function (buildings) {
            buildingsToDraw = acceptHashable(buildings, buildingsToDraw);
            buildingHash = buildHash(buildings);
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
        build: function (clickLocation) {
            var blipToBuild = {};
            var worldClickLocation = {
                x: clickLocation.x + screenCoordinates.x,
                y: clickLocation.y + screenCoordinates.y
            };
            var coordinatesToBuildAtm
            _.forEach(chunksToDraw, function (chunk) {
                if (worldClickLocation.x > chunk.coordinates.x &&
                    worldClickLocation.x < chunk.coordinates.x + chunk.dimensions.width &&
                    worldClickLocation.y > chunk.coordinates.y &&
                    worldClickLocation.y < chunk.coordinates.y + chunk.dimensions.height) {

                    _.forEach(chunk.blips, function (blip) {
                        if (worldClickLocation.x > blip.x + chunk.coordinates.x &&
                            worldClickLocation.x < blip.x + chunk.coordinates.x + blip.width &&
                            worldClickLocation.y > blip.y + chunk.coordinates.y &&
                            worldClickLocation.y < blip.y + chunk.coordinates.y + blip.height) {
                            coordinatesToBuildAt = {
                                x: chunk.coordinates.x + blip.x,
                                y: chunk.coordinates.y + blip.y
                            };
                        }

                    });
                }
            })
            var buildingSpec = buildings.getBuilding('chapel');
            var building = buildingInterface.buildFrom(buildingSpec, coordinatesToBuildAt)
            outgoingEvents.sendBuildingUpdate(building.serialise());
            controls.buildingMode = false;
        }
    }
}