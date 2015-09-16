function createUpdate(player, outgoingEvents, collisionDetection, draw, controls) {
    var chunkCache = [];
    var chunkIds = [];
    var screenCoordinates = {
        x: 0,
        y: 0
    }
    var chunksToDraw;

    function moveScreenTo(newCoordinates) {
        screenCoordinates = newCoordinates;
    }

    var players = [player];

    setInterval(function () {
        outgoingEvents.locationUpdate(player.serialise())
    }, 1000 / 5);

    return {
        mainLoop: function (canvas, ctx) {
            draw.drawLoopIteration(canvas, ctx, chunksToDraw, screenCoordinates, players)
            controls.controlIteration(players, screenCoordinates, moveScreenTo)
        },
        chunksArrived: function (chunks) {
            chunksToDraw = chunks;
        },
        playerList: function (newList) {
            _.forEach(newList, function (newPlayer) {
                var alreadyHasPlayer = _.some(players, function (existingPlayer) {
                    return existingPlayer.id !== newPlayer.id
                });
                if (newPlayer.id === player.id || alreadyHasPlayer) {
                    return;
                }
                var fullPlayer = createPlayer(outgoingEvents, newPlayer.name, newPlayer.id, newPlayer.coordinates, newPlayer.facing);
                players.push(fullPlayer)
            });

            players = players.reverse();
            while (collisionDetection.detected(players, player.coordinates, player)) {
                player.coordinateChange({
                    x: player.coordinates.x - 20,
                    y: player.coordinates.y
                });
            }
        }
    }
}