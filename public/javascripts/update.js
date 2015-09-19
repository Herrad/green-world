function createUpdate(player, outgoingEvents, collisionDetection, draw, controls) {
    var chunkCache = [];
    var chunkIds = [];
    var screenCoordinates = {
        x: 0,
        y: 0
    }
    var chunksToDraw = [];
    var chunkHash = '';

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

    return {
        mainLoop: function (canvas, ctx) {
            draw.drawLoopIteration(canvas, ctx, chunksToDraw, screenCoordinates, players, player.coordinates)
            controls.controlIteration(players, screenCoordinates, moveScreenTo)
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
        }
    }
}