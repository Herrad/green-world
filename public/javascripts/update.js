function createUpdate(player, outgoingEvents) {
    var draw = createDraw();
    var chunkCache = [];
    var chunkIds = [];
    var screenCoordinates = {
        x: 0,
        y: 0
    }
    var chunkToDraw;

    function cacheChunk(chunk) {
        chunkToDraw = chunk;
    }

    $('body').on('keydown', function (e) {
        moveUnits = 5;
        if (e.keyCode == 37 || e.keyCode == 65) { //left
            screenCoordinates.x += moveUnits;
            player.faceLeft();
        } else if (e.keyCode == 38 || e.keyCode == 87) { //up
            screenCoordinates.y += moveUnits;
            player.faceUp();
        } else if (e.keyCode == 39 || e.keyCode == 68) { //right
            screenCoordinates.x -= moveUnits;
            player.faceRight();
        } else if (e.keyCode == 40 || e.keyCode == 83) { //down
            screenCoordinates.y -= moveUnits;
            player.faceDown();
        } else {
            return;
        }
        player.coordinateChange({
            x: 480 - screenCoordinates.x,
            y: 328 - screenCoordinates.y
        });
    });

    var players = [player];

    setInterval(function () {
        outgoingEvents.locationUpdate(player.serialise())
    }, 1000 / 5);

    return {
        mainLoop: function () {
            draw.draw(ctx, chunkToDraw, screenCoordinates);
            _.forEach(players, function (player, key) {
                player.draw(ctx, screenCoordinates);
            });
        },
        updateChunk: function (chunk) {
            cacheChunk(chunk);
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
        }
    }
}