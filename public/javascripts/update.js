function createUpdate(player, outgoingEvents, collisionDetection) {
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
        console.log(e);
        moveUnits = 10;
        var newCoordinates = {
            x: screenCoordinates.x,
            y: screenCoordinates.y
        };

        if (e.keyCode == 37 || e.keyCode == 65) { //left
            newCoordinates.x += moveUnits;
            player.faceLeft();
        }
        if (e.keyCode == 38 || e.keyCode == 87) { //up
            newCoordinates.y += moveUnits;
            player.faceUp();
        }
        if (e.keyCode == 39 || e.keyCode == 68) { //right
            newCoordinates.x -= moveUnits;
            player.faceRight();
        }
        if (e.keyCode == 40 || e.keyCode == 83) { //down
            newCoordinates.y -= moveUnits;
            player.faceDown();
        }

        if (collisionDetection.detected(players, {
                x: 480 - newCoordinates.x,
                y: 328 - newCoordinates.y
            }, player)) {
            return;
        } else {
            screenCoordinates = newCoordinates;
        }
        player.coordinateChange({
            x: 480 - screenCoordinates.x,
            y: 328 - screenCoordinates.y
        });
    });

    var players = [player];

    setInterval(function () {
        outgoingEvents.locationUpdate(player.serialise())
    }, 1000 / 10);

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
            if (collisionDetection.detected(players, {
                    x: 480 - screenCoordinates.x,
                    y: 328 - screenCoordinates.y
                }, player)) {
                player.coordinateChange({
                    x: 480 - screenCoordinates.x + 64,
                    y: 328 - screenCoordinates.y + 64
                });

            }
        }
    }
}