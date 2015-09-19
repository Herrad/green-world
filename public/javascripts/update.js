function createUpdate(player, outgoingEvents, collisionDetection, draw, controls, buildings, buildingInterface) {
    var chunkCache = [];
    var chunkIds = [];
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
    var chunkToBuildIn = {};

    function moveScreenTo(newCoordinates) {
        screenCoordinates = newCoordinates;
    }

    function acceptChunks(chunks) {
        if (chunksToDraw.length + chunks.length > 100) {
            chunksToDraw = _.takeRight(chunksToDraw, 100);
        }
        for (var i = chunks.length - 1; i >= 0; i--) {
            _.remove(chunksToDraw, {
                coordinates: chunks[i].coordinates
            });
            chunksToDraw.push(chunks[i]);
        };
    }

    var players = [player];

    setInterval(function () {
        var serialsedPlayer = player.serialise(chunkHash)
        outgoingEvents.locationUpdate(serialsedPlayer)

    }, 1000 / 10);

    var mousePosition = {
        x: 0,
        y: 0
    };

    function setBlipLocation(blipCoordinates, chunk) {
        buildAt = blipCoordinates;
        chunkToBuildIn = chunk;
    }

    function runDraw(canvas, ctx) {
        draw.clearCanvas(canvas, ctx);
        draw.drawChunks(ctx, chunksToDraw, screenCoordinates, mousePosition, setBlipLocation);
        buildingInterface.drawBuildings(ctx, chunksToDraw, screenCoordinates);
        if (controls.buildingMode) {
            buildingInterface.drawBlueprint(ctx, "chapel", buildAt, chunkToBuildIn.coordinates, screenCoordinates);
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
        chunksArrived: function (chunks) {
            acceptChunks(chunks);
            chunkHash = '';
            for (var i = chunks.length - 1; i >= 0; i--) {
                chunkHash += chunks[i].hash;
            };
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
        build: function () {
            var chunk = _.find(chunksToDraw, {
                hash: chunkToBuildIn.hash
            });
            var buildingSpec = buildings.getBuilding('chapel');
            var building = buildings.buildFrom(buildingSpec, buildAt, chunk.coordinates)
            chunk.buildings.push(building.serialise())
            outgoingEvents.sendChunkUpdate(chunk);
            controls.buildingMode = false;
        }
    }
}