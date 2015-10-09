function createUpdate(player, outgoingEvents, draw, controls, buildingInterface, chunkInterpreter, warnings) {
    var screenCoordinates = {
        x: 0,
        y: 0
    }
    var buildAt = {
        x: 0,
        y: 0
    };

    function moveScreenTo(newCoordinates) {
        screenCoordinates = newCoordinates;
    }

    var players = [player];

    setInterval(function () {
        outgoingEvents.locationUpdate(player)

    }, 1000 / 10);

    var mousePosition = {
        x: 0,
        y: 0
    };

    function runDraw(canvas, ctx, elapsedTime) {
        var game = {
            debugInfo: {
              fps: Math.round(100000/elapsedTime)/100
          },
          players:players,
          controls:controls
        };
        buildingInterface.buildAt = buildAt;
        draw.drawAll(screenCoordinates, buildingInterface, warnings, game);
    }

    return {
        mainLoop: function (canvas, ctx, seed, elapsedTime) {
            runDraw(canvas, ctx, elapsedTime);
            controls.controlIteration(players, screenCoordinates, moveScreenTo);
            chunkInterpreter.evict(player.coordinates);
        },
        playerList: function (newList) {
            players = [player];
            _.forEach(newList, function (newPlayer) {
                if (player.id === newPlayer.id) {
                    return;
                }
                var fullPlayer = createPlayer(newPlayer.name, newPlayer.inventory, newPlayer.id, newPlayer.coordinates, newPlayer.facing);
                players.push(fullPlayer)
            });
        },
        removePlayer: function (id) {
            _.remove(players, {
                id: id
            });
        },
        movePlayer: function (newLocation) {
            player.coordinateChange(newLocation);
        },
        setMouseLocation: function (newPosition) {
            var worldClickLocation = {
                x: newPosition.x + screenCoordinates.x,
                y: newPosition.y + screenCoordinates.y
            }
            buildAt = chunkInterpreter.getBlipAt(worldClickLocation);
        },
        tryToBuildAt: function (clickLocation) {
            var worldClickLocation = {
                x: clickLocation.x + screenCoordinates.x,
                y: clickLocation.y + screenCoordinates.y
            };
            var blipCoordinates = chunkInterpreter.getBlipAt(worldClickLocation);
            var building = buildingInterface.buildFrom('chapel', blipCoordinates, players)
            if (building) {
                outgoingEvents.sendBuildingUpdate(building);
                controls.buildingMode = false;
            }
        },
        setSeed: function (newSeed) {
            seed = newSeed;
        }
    }
}
