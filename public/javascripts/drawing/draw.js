function createDraw(screenDimensions, player, map, chunkCache, middlePanelArtist, rightPanelDimensions) {

    var BLIP_SIZE = 0;

    function drawChunk(ctx, chunk, offset) {
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

    function drawPlayer(ctx, genericPlayer, screenCoordinates) {
        var xToDraw = genericPlayer.coordinates.x - screenCoordinates.x;
        var yToDraw = genericPlayer.coordinates.y - screenCoordinates.y;
        ctx.drawImage(genericPlayer.imageToDraw, xToDraw, yToDraw);
        ctx.fillStyle = "rgb(0,0,0)";
        ctx.font = "30px sans-serif";
        var xToDrawText = xToDraw + BLIP_SIZE / 2 - (genericPlayer.name.length / 2) * 15
        ctx.fillText(genericPlayer.name, xToDrawText, yToDraw - 20);
    }

    function drawRightPanelOutline(ctx, debugInfo) {
        ctx.fillStyle = "rgb(255,255,255)";
        draw(ctx, rightPanelDimensions.external);
        ctx.fillStyle = "rgb(0,0,0)";
        draw(ctx, rightPanelDimensions.internal);

        ctx.fillStyle = "rgb(255,255,255)";
        ctx.font = rightPanelDimensions.info.fontSize + "px sans-serif";
        ctx.fillText(player.name, rightPanelDimensions.textX, rightPanelDimensions.info.nameY);
        ctx.fillText("[x:" + player.coordinates.x + ",y:" + player.coordinates.y + "]" + ' fps: ' + debugInfo.fps, rightPanelDimensions.textX, rightPanelDimensions.info.coordinatesY);

    }

    return {
        clearCanvas: function (canvas, ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "rgb(100, 100, 240)"
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        },
        drawChunks: function (ctx, screenCoordinates) {
            _.forEach(chunkCache.getData(), function (chunk) {
                drawChunk(ctx, chunk, screenCoordinates);
            });
        },
        drawPlayers: function (ctx, screenCoordinates, players) {
            _.forEach(players, function (genericPlayer) {
                drawPlayer(ctx, genericPlayer, screenCoordinates);
            });
        },
        drawRightPanel: function (ctx, controls, debugInfo) {
            drawRightPanelOutline(ctx, debugInfo);
            middlePanelArtist.draw(ctx, controls);
        },
        drawMap: function (ctx, playerCoordinates, screenCoordinates) {
            map.draw(ctx, chunkCache.getData(), playerCoordinates, screenCoordinates);
        }
    }
}