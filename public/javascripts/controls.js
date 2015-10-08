function createControls(player, collisionDetection, screenDimensions, buildingCache) {
    var directionMap = [];
    var moveUnits;
    var buildingMode = false;
    var oldGamepad;
    var currentGamepad;

    function collidesWithBuildings(playerCoordinates) {
        var collisionDetected = false
        var rectangle1 = {
            x1: playerCoordinates.x,
            y1: playerCoordinates.y,
            x2: playerCoordinates.x + 64,
            y2: playerCoordinates.y + 64
        }
        _.forEach(buildingCache.getData(), function (building) {
            _.forEach(building.impassables, function (impassable) {
                if (collisionDetected) return;
                var rectangle2 = translateBy(impassable, building.coordinates)
                collisionDetected = collisionDetection.rectanglesOverlap(rectangle1, rectangle2);
            });
        });
        return collisionDetected;
    }

    function handleMovement(direction, players, screenCoordinates, moveScreenTo) {
        var playerCoordinates = orientAndMovePlayer(direction, moveUnits)
        var newCoordinates = moveScreenIfOutsideBounds(screenCoordinates, playerCoordinates, moveUnits);

        if (collisionDetection.detect(players, playerCoordinates, player) ||
            collidesWithBuildings(playerCoordinates)) {
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
        var direction = '';
        switch (keyCode) {
        case 37:
        case 65:
            direction = 'left'
            break;
        case 38:
        case 87:
            direction = 'up';
            break;
        case 39:
        case 68:
            direction = 'right';
            break;
        case 40:
        case 83:
            direction = 'down';
            break;
        }
        action(direction);
    }

    function mapGamepadChanges() {
        var currentGamepad = navigator.getGamepads()[0]
        if (!currentGamepad) return;
        var normalisedAxis = [
            currentGamepad.axes[0] > 0 ? Math.floor(currentGamepad.axes[0] * 10) / 10 : Math.ceil(currentGamepad.axes[0] * 10) / 10,
            currentGamepad.axes[1] > 0 ? Math.floor(currentGamepad.axes[1] * 10) / 10 : Math.ceil(currentGamepad.axes[1] * 10) / 10
        ]
        if (normalisedAxis[0] < -0.5) {
            push('left')
        }
        if (normalisedAxis[0] > 0.5) {
            push('right')
        }
        if (normalisedAxis[1] < -0.5) {
            push('up')
        }
        if (normalisedAxis[1] > 0.5) {
            push('down')
        }
        if (normalisedAxis[0] > -0.5 && normalisedAxis[0] < -0.1) {
            remove('left')
        }
        if (normalisedAxis[0] < 0.5 && normalisedAxis[0] > 0.1) {
            remove('right')
        }
        if (normalisedAxis[1] > -0.5 && normalisedAxis[1] < -0.1) {
            remove('up')
        }
        if (normalisedAxis[1] < 0.5 && normalisedAxis[1] > 0.1) {
            remove('down')
        }
    }

    function remove(directionToRemove) {
        _.remove(directionMap, function (direction) {
            return direction === directionToRemove;
        });
        normaliseDirectionMap();
    }

    function push(direction) {
        directionMap.push(direction);
        normaliseDirectionMap();
    }

    function normaliseDirectionMap() {
        directionMap = _.uniq(directionMap);
        directionMap.length > 1 ? moveUnits = 8 : moveUnits = 12
    }

    return {
        keyDown: function (keyCode) {
            detectControl(keyCode, push);
        },
        keyUp: function (keyCode) {
            detectControl(keyCode, remove);
            if (keyCode == 66) { //b
                this.buildingMode = !this.buildingMode;
            }
            if (keyCode == 77) { //m
                this.drawMap = !this.drawMap;
            }

            directionMap.length > 1 ? moveUnits = 8 : moveUnits = 12
        },
        controlIteration: function (players, screenCoordinates, moveScreenTo) {
            mapGamepadChanges();
            _.forEach(directionMap, function (direction) {
                handleMovement(direction, players, screenCoordinates, moveScreenTo)
            });
        },
        drawMap: false,
        buildingMode: false
    }
}