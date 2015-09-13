function createPlayerMovement(player, collisionDetection, screenDimensions) {
    var keyMap = [];

    function handleMovement(direction, players, screenCoordinates, callback) {

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
            callback(newCoordinates);
            player.coordinateChange(playerCoordinates);
        }
    }

    return {
        keyDown: function (keyCode) {

            if (!$.inArray('left') && keyCode == 37 || keyCode == 65) { //left
                keyMap.push('left');
            }
            if (!$.inArray('up') && keyCode == 38 || keyCode == 87) { //up
                keyMap.push('up');
            }
            if (!$.inArray('right') && keyCode == 39 || keyCode == 68) { //right
                keyMap.push('right');
            }
            if (!$.inArray('down') && keyCode == 40 || keyCode == 83) { //down
                keyMap.push('down');
            }
            keyMap = _.uniq(keyMap);
        },
        keyUp: function (keyCode) {

            if (keyCode == 37 || keyCode == 65) { //left
                keyMap.splice('left');
            }
            if (keyCode == 38 || keyCode == 87) { //up
                keyMap.splice('up');
            }
            if (keyCode == 39 || keyCode == 68) { //right
                keyMap.splice('right');
            }
            if (keyCode == 40 || keyCode == 83) { //down
                keyMap.splice('down');
            }
        },
        move: function (players, screenCoordinates, callback) {
            _.forEach(keyMap, function (direction) {
                handleMovement(direction, players, screenCoordinates, callback)
            });
        }
    }
}