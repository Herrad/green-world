function createControls(player, collisionDetection, screenDimensions) {
    var directionMap = [];

    function handleMovement(direction, players, screenCoordinates, callback) {
        moveUnits = 16;

        var playerCoordinates = orientAndMovePlayer(direction, moveUnits)
        var newCoordinates = moveScreenIfOutsideBounds(screenCoordinates, playerCoordinates, moveUnits);

        if (collisionDetection.detected(players, playerCoordinates, player)) {
            return;
        } else {
            callback(newCoordinates);
            player.coordinateChange(playerCoordinates);
        }
    }

    function orientAndMovePlayer(direction, moveUnits) {
        var playerCoordinates = {
            x: player.coordinates.x,
            y: player.coordinates.y
        };

        if (direction === 'left') { //left
            playerCoordinates.x -= moveUnits;
            player.faceLeft();
        }
        if (direction === 'up') { //up
            playerCoordinates.y -= moveUnits;
            player.faceUp();
        }
        if (direction === 'right') { //right
            playerCoordinates.x += moveUnits;
            player.faceRight();
        }
        if (direction === 'down') { //down
            playerCoordinates.y += moveUnits;
            player.faceDown();
        }

        return playerCoordinates;
    }

    function moveScreenIfOutsideBounds(screenCoordinates, playerCoordinates, moveUnits) {
        var newCoordinates = {
            x: screenCoordinates.x,
            y: screenCoordinates.y
        };
        if (playerCoordinates.x < newCoordinates.x + screenDimensions.width / 5) {
            newCoordinates.x -= moveUnits;
        }
        if (playerCoordinates.y < newCoordinates.y + screenDimensions.height / 5) {
            newCoordinates.y -= moveUnits;
        }
        if (playerCoordinates.x > newCoordinates.x + screenDimensions.width - 128 - screenDimensions.width / 5) {
            newCoordinates.x += moveUnits;
        }
        if (playerCoordinates.y > newCoordinates.y + screenDimensions.height - 128 - screenDimensions.height / 5) {
            newCoordinates.y += moveUnits;
        }
        return newCoordinates;
    }

    return {
        keyDown: function (keyCode) {

            if (keyCode == 37 || keyCode == 65) { //left
                directionMap.push('left');
            }
            if (keyCode == 38 || keyCode == 87) { //up
                directionMap.push('up');
            }
            if (keyCode == 39 || keyCode == 68) { //right
                directionMap.push('right');
            }
            if (keyCode == 40 || keyCode == 83) { //down
                directionMap.push('down');
            }
            directionMap = _.uniq(directionMap);
        },
        keyUp: function (keyCode) {
            var removal = '';
            if (keyCode == 37 || keyCode == 65) { //left
                removal = 'left';
            } else if (keyCode == 38 || keyCode == 87) { //up
                removal = 'up';
            } else if (keyCode == 39 || keyCode == 68) { //right
                removal = 'right';
            } else if (keyCode == 40 || keyCode == 83) { //down
                removal = 'down';
            }
            _.remove(directionMap, function (direction) {
                return direction === removal
            });

        },
        controlIteration: function (players, screenCoordinates, callback) {
            _.forEach(directionMap, function (direction) {
                handleMovement(direction, players, screenCoordinates, callback)
            });
        }
    }
}