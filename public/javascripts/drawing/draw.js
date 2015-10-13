function createDraw(canvas, screenDimensions, map, chunkCache, middlePanelArtist, rightPanelArtist, rightPanelDimensions, renderLayers) {
    var ctx = canvas.getContext('2d');
    var BLIP_SIZE = 0;

    function drawChunk(chunk, offset) {
        BLIP_SIZE = BLIP_SIZE || chunk.blipSize;
        for (var i = chunk.blips.length - 1; i >= 0; i--) {
            var blip = chunk.blips[i];
            var blipBox = {
                x: chunk.coordinates.x + blip.x - offset.x,
                y: chunk.coordinates.y + blip.y - offset.y,
                width: chunk.coordinates.x + blip.x + blip.width - offset.x,
                height: chunk.coordinates.y + blip.y + blip.height - offset.y
            }
            if (blipBox.x > screenDimensions.gameWindowWidth + BLIP_SIZE ||
                blipBox.width < -BLIP_SIZE ||
                blipBox.height < -BLIP_SIZE ||
                blipBox.y > screenDimensions.height + BLIP_SIZE) {
                continue
            }
            ctx.fillStyle = blip.rgb
            ctx.beginPath()
            ctx.moveTo(blipBox.x, blipBox.y)
            ctx.lineTo(blipBox.width, blipBox.y);
            ctx.lineTo(blipBox.width, blipBox.height);
            ctx.lineTo(blipBox.x, blipBox.height);
            ctx.fill();
        }

    }

    function drawPlayer(genericPlayer, screenCoordinates) {
        var xToDraw = genericPlayer.coordinates.x - screenCoordinates.x;
        var yToDraw = genericPlayer.coordinates.y - screenCoordinates.y;
        ctx.drawImage(genericPlayer.imageToDraw, xToDraw, yToDraw);
        ctx.fillStyle = "rgb(0,0,0)";
        ctx.font = "30px sans-serif";
        var xToDrawText = xToDraw + BLIP_SIZE / 2 - (genericPlayer.name.length / 2) * 15
        ctx.fillText(genericPlayer.name, xToDrawText, yToDraw - 20);
    }

    function drawChunks(screenCoordinates) {
        _.forEach(chunkCache.getData(), function (chunk) {
            drawChunk(chunk, screenCoordinates);
        });
    }

    function clearCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "rgb(100, 100, 240)"
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    function drawWorld(game, screenCoordinates, buildingInterface) {
        var debug = false;
        drawChunks(screenCoordinates);
        renderLayers.forEach(function (layer) {
            layer.draw(ctx, screenCoordinates, debug);
        });
        buildingInterface.drawBuildings(ctx, screenCoordinates);
        if (game.controls.buildingMode) {
            buildingInterface.drawBlueprint(ctx, screenCoordinates);
        }

        drawPlayers(screenCoordinates, game.players)
    }

    function drawPlayers(screenCoordinates, players) {
        _.forEach(players, function (genericPlayer) {
            drawPlayer(genericPlayer, screenCoordinates);
        });
    }

    return {
        drawAll: function (screenCoordinates, buildingInterface, warnings, game) {
            clearCanvas();
            drawWorld(game, screenCoordinates, buildingInterface);
            rightPanelArtist.draw(game, screenCoordinates);
            warnings.draw(ctx);
        }
    }
}