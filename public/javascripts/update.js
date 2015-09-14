function createUpdate(player, outgoingEvents, collisionDetection, draw, movement) {
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
    }, 1000 / 15);

    return {
        mainLoop: function (canvas, ctx) {
            draw.drawLoopIteration(canvas, ctx, chunksToDraw, screenCoordinates, players)
            movement.move(players, screenCoordinates, moveScreenTo)
        },
        chunksArrived: function (chunks) {
            chunksToDraw = chunks;
        },
        playerList: function (newList) {
            players = [player];
            _.forEach(newList, function (newPlayer) {
                if (newPlayer.id === player.id) {
                    return;
                }
                var fullPlayer = createPlayer(outgoingEvents, newPlayer.name, newPlayer.id, newPlayer.coordinates, newPlayer.facing);
                players.push(fullPlayer)
            });

            players = players.reverse();
            while (collisionDetection.detected(players, player.coordinates, player)) {
                player.coordinateChange({
                    x: player.coordinates.x + Math.floor(Math.random() * 512),
                    y: player.coordinates.y + Math.floor(Math.random() * 512)
                });
            }
        }
    }
}