function createUpdate(player, outgoingEvents, collisionDetection, draw, controls, buildingInterface, buildingFactory) {
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

    function acceptHashable(newHashable, oldHashable, deserialise) {
        if (!newHashable) return;
        if (oldHashable.length + newHashable.length > 100) {
            oldHashable = _.takeRight(oldHashable, 100);
        }
        for (var i = newHashable.length - 1; i >= 0; i--) {
            _.remove(oldHashable, {
                hash: newHashable[i].hash
            });
            if (deserialise) {
                oldHashable.push(deserialise(newHashable[i]));
            } else {
                oldHashable.push(newHashable[i]);
            }
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

    function findBlipCoordinatesOfClick(clickLocationInWorld) {

        var coordinates;
        _.forEach(chunksToDraw, function (chunk) {
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
        mainLoop: function (canvas, ctx) {
            runDraw(canvas, ctx);
            controls.controlIteration(players, screenCoordinates, moveScreenTo, buildingsToDraw);

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
            buildingsToDraw = acceptHashable(buildings, buildingsToDraw, buildingFactory.deserialise);
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
        tryToBuildAt: function (clickLocation) {
            var worldClickLocation = {
                x: clickLocation.x + screenCoordinates.x,
                y: clickLocation.y + screenCoordinates.y
            };
            var blipCoordinates = findBlipCoordinatesOfClick(worldClickLocation);
            var building = buildingInterface.buildFrom('chapel', blipCoordinates, buildingsToDraw, players)
            if (building) {
                outgoingEvents.sendBuildingUpdate(building);
                controls.buildingMode = false;
            }
        }
    }
}