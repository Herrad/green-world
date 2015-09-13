function createUpdate(player, outgoingEvents, collisionDetection, draw, screenDimensions) {
    var chunkCache = [];
    var chunkIds = [];
    var screenCoordinates = {
        x: 0,
        y: 0
    }
    var chunkToDraw;
    var chunksToDraw;

    function cacheChunk(chunk) {
        chunksToDraw = [chunk];
    }

    var keyMap = [];

    $('body').on('keydown', function (e) {

        if (!$.inArray('left') && e.keyCode == 37 || e.keyCode == 65) { //left
            keyMap.push('left');
        }
        if (!$.inArray('up') && e.keyCode == 38 || e.keyCode == 87) { //up
            keyMap.push('up');
        }
        if (!$.inArray('right') && e.keyCode == 39 || e.keyCode == 68) { //right
            keyMap.push('right');
        }
        if (!$.inArray('down') && e.keyCode == 40 || e.keyCode == 83) { //down
            keyMap.push('down');
        }
        keyMap = _.uniq(keyMap);
    });

    $('body').on('keyup', function (e) {

        if (e.keyCode == 37 || e.keyCode == 65) { //left
            keyMap.splice('left');
        }
        if (e.keyCode == 38 || e.keyCode == 87) { //up
            keyMap.splice('up');
        }
        if (e.keyCode == 39 || e.keyCode == 68) { //right
            keyMap.splice('right');
        }
        if (e.keyCode == 40 || e.keyCode == 83) { //down
            keyMap.splice('down');
        }
    });

    function handleMovement(direction) {
        moveUnits = 16;
        var newCoordinates = {
            x: screenCoordinates.x,
            y: screenCoordinates.y
        };
        var playerCoordinates = {
            x: player.coordinates.x,
            y: player.coordinates.y
        };
        if (direction === 'left') { //left
            playerCoordinates.x -= moveUnits;
            if (playerCoordinates.x < newCoordinates.x + screenDimensions.width / 5) {
                newCoordinates.x -= moveUnits;
            }
            player.faceLeft();
        }
        if (direction === 'up') { //up
            playerCoordinates.y -= moveUnits;
            if (playerCoordinates.y < newCoordinates.y + screenDimensions.height / 5) {
                newCoordinates.y -= moveUnits;
            }
            player.faceUp();
        }
        if (direction === 'right') { //right
            playerCoordinates.x += moveUnits;
            if (playerCoordinates.x > newCoordinates.x + screenDimensions.width - 128 - screenDimensions.width / 5) {
                newCoordinates.x += moveUnits;
            }
            player.faceRight();
        }
        if (direction === 'down') { //down
            playerCoordinates.y += moveUnits;
            if (playerCoordinates.y > newCoordinates.y + screenDimensions.height - 128 - screenDimensions.height / 5) {
                newCoordinates.y += moveUnits;
            }
            player.faceDown();
        }

        if (collisionDetection.detected(players, playerCoordinates, player)) {
            return;
        } else {
            screenCoordinates = newCoordinates;
            player.coordinateChange(playerCoordinates);
        }
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
            _.forEach(keyMap, handleMovement);
        },
        updateChunk: function (chunks) {
            cacheChunk(chunks);
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