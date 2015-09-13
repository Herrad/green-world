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
    }, 1000);

    return {
        mainLoop: function (canvas, ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "rgb(100, 100, 240)"
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            for (var i = chunksToDraw.length - 1; i >= 0; i--) {
                var chunkToDraw = chunksToDraw[i];
                draw.draw(ctx, chunkToDraw, screenCoordinates);
            };
            _.forEach(players, function (player, key) {
                player.draw(ctx, screenCoordinates);
            });
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
                var fullPlayer = createPlayer(outgoingEvents, newPlayer.id, newPlayer.coordinates, newPlayer.facing);
                players.push(fullPlayer)
            });
            players = players.reverse();
            if (collisionDetection.detected(players, {
                    x: 480 - screenCoordinates.x,
                    y: 328 - screenCoordinates.y
                }, player)) {
                player.coordinateChange({
                    x: 480 - screenCoordinates.x + 128,
                    y: 328 - screenCoordinates.y + 128
                });

            }
        }
    }
}