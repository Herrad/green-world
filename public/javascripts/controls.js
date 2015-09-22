function createControls(player, collisionDetection, screenDimensions) {
    var directionMap = [];
    var moveUnits;
    var buildingMode = false;

    function collidesWithBuildings(playerCoordinates, buildings) {
        var collisionDetected = false
        var rectangle1 = {
            x1: playerCoordinates.x,
            y1: playerCoordinates.y,
            x2: playerCoordinates.x + 64,
            y2: playerCoordinates.y + 64
        }
        _.forEach(buildings, function (building) {
            _.forEach(building.impassables, function (impassable) {
                if (collisionDetected) return;
                var rectangle2 = translateBy(impassable, building.coordinates)
                collisionDetected = collisionDetection.rectanglesOverlap(rectangle1, rectangle2);
            });
        });
        return collisionDetected;
    }

    function handleMovement(direction, players, screenCoordinates, moveScreenTo, buildings) {
        var playerCoordinates = orientAndMovePlayer(direction, moveUnits)
        var newCoordinates = moveScreenIfOutsideBounds(screenCoordinates, playerCoordinates, moveUnits);

        if (collisionDetection.detect(players, playerCoordinates, player) ||
            collidesWithBuildings(playerCoordinates, buildings)) {
            return;
        } else {
            moveScreenTo(newCoordinates);
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
        if (playerCoordinates.x < newCoordinates.x + screenDimensions.gameWindowWidth / 8) {
            newCoordinates.x -= moveUnits;
        }
        if (playerCoordinates.y < newCoordinates.y + screenDimensions.height / 8) {
            newCoordinates.y -= moveUnits;
        }
        if (playerCoordinates.x > newCoordinates.x + screenDimensions.gameWindowWidth - 64 - screenDimensions.gameWindowWidth / 8) {
            newCoordinates.x += moveUnits;
        }
        if (playerCoordinates.y > newCoordinates.y + screenDimensions.height - 64 - screenDimensions.height / 8) {
            newCoordinates.y += moveUnits;
        }
        return newCoordinates;
    }

    function detectControl(keyCode, action) {
        switch (keyCode) {
        case 37:
        case 65:
            action('left');
            break;
        case 38:
        case 87:
            action('up');
            break;
        case 39:
        case 68:
            action('right');
            break;
        case 40:
        case 83:
            action('down');
            break;
        }
    }

    return {
        keyDown: function (keyCode) {
            var push = function (direction) {
                directionMap.push(direction);
            }
            detectControl(keyCode, push);
            directionMap = _.uniq(directionMap);
            directionMap.length > 1 ? moveUnits = 8 : moveUnits = 12
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
            if (keyCode == 66) { //b
                this.buildingMode = !this.buildingMode;
            }
            if (keyCode == 77) { //m
                this.drawMap = !this.drawMap;
            }
            _.remove(directionMap, function (direction) {
                return direction === removal
            });

            directionMap.length > 1 ? moveUnits = 8 : moveUnits = 12
        },
        controlIteration: function (players, screenCoordinates, moveScreenTo, buildings) {
            _.forEach(directionMap, function (direction) {
                handleMovement(direction, players, screenCoordinates, moveScreenTo, buildings)
            });
        },
        drawMap: false,
        buildingMode: false
    }
}