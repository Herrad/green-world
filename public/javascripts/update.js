function createUpdate(player, outgoingEvents) {
    var draw = createDraw();
    var chunkCache = [];
    var chunkIds = [];
    var worldCoordinates = {
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
            worldCoordinates.x += moveUnits;
            player.faceLeft();
        } else if (e.keyCode == 38 || e.keyCode == 87) { //up
            worldCoordinates.y += moveUnits;
            player.faceUp();
        } else if (e.keyCode == 39 || e.keyCode == 68) { //right
            worldCoordinates.x -= moveUnits;
            player.faceRight();
        } else if (e.keyCode == 40 || e.keyCode == 83) { //down
            worldCoordinates.y -= moveUnits;
            player.faceDown();
        } else {
            return;
        }
        player.coordinateChange(worldCoordinates);
    });

    var players = [player];

    return {
        mainLoop: function () {
            draw.draw(ctx, chunkToDraw, worldCoordinates);
            _.forEach(players, function (player, key) {
                player.draw(ctx, worldCoordinates);
            });
        },
        updateChunk: function (chunk) {
            cacheChunk(chunk);
        },
        drawPlayerAt: function () {
            otherPlayers.push(data);
        },
        registerNewPlayer: function (player) {
            var hasPlayer = _.some(players, {
                id: player.id
            });
            // console.log('new player')
            // console.log(player.id)
            // console.log('has player ' + hasPlayer)
            if (!hasPlayer) {
                players.push(createPlayer(outgoingEvents, player.id, player.coordinates));
            }
        }
    }
}