function createDraw(screenDimensions, player, map) {

    var inventoryImage = new Image;
    inventoryImage.src = "/images/player/inventory.png"

    function drawChunk(ctx, chunk, offset) {
        for (var i = chunk.blips.length - 1; i >= 0; i--) {
            var blip = chunk.blips[i];
            if (chunk.coordinates.x + blip.x - offset.x > screenDimensions.gameWindowWidth + 64 ||
                chunk.coordinates.x + blip.x + blip.width - offset.x < -64 ||
                chunk.coordinates.y + blip.y + blip.height - offset.y < -64 ||
                chunk.coordinates.y + blip.y - offset.y > screenDimensions.height + 64) {
                continue
            }
            ctx.fillStyle = blip.rgb
            ctx.beginPath()
            ctx.moveTo(chunk.coordinates.x + blip.x - offset.x, chunk.coordinates.y + blip.y - offset.y)
            ctx.lineTo(chunk.coordinates.x + blip.x + blip.width - offset.x, chunk.coordinates.y + blip.y - offset.y);
            ctx.lineTo(chunk.coordinates.x + blip.x + blip.width - offset.x, chunk.coordinates.y + blip.y + blip.height - offset.y);
            ctx.lineTo(chunk.coordinates.x + blip.x - offset.x, chunk.coordinates.y + blip.y + blip.height - offset.y);
            ctx.fill();
        };
    }

    function drawPlayer(ctx, genericPlayer, screenCoordinates) {
        var xToDraw = genericPlayer.coordinates.x - screenCoordinates.x;
        var yToDraw = genericPlayer.coordinates.y - screenCoordinates.y;
        ctx.drawImage(genericPlayer.imageToDraw, xToDraw, yToDraw);
        ctx.fillStyle = "rgb(0,0,0)";
        ctx.font = "30px sans-serif";
        var xToDrawText = xToDraw + 64 / 2 - (genericPlayer.name.length / 2) * 15
        ctx.fillText(genericPlayer.name, xToDrawText, yToDraw - 20);
    }

    function drawInventory(ctx) {
        ctx.fillStyle = "rgb(255,255,255)";
        ctx.fillRect(screenDimensions.realWidth - 470, 0, 510, 624);

        ctx.fillStyle = "rgb(255,0,0)";
        ctx.fillRect(screenDimensions.realWidth - 445, 64, 450, 25);
        ctx.drawImage(inventoryImage, screenDimensions.realWidth - 470, 0);

        ctx.fillStyle = "rgb(255,255,255)";
        ctx.font = "40px sans-serif";
        var xToDrawText = screenDimensions.realWidth - 450
        ctx.fillText(player.name, xToDrawText, 50);
        ctx.fillText("[x:" + player.coordinates.x + ",y:" + player.coordinates.y + "]", xToDrawText, 100);
    }

    function drawMapControl(ctx, screenCoordinates) {
        ctx.fillStyle = "rgb(255, 255, 255)"
        ctx.fillRect(screenDimensions.realWidth - 458, screenDimensions.height - 139, 477, 12);
        ctx.font = "30px sans-serif";
        ctx.fillText("Press 'M' for the map", screenDimensions.realWidth - 358, screenDimensions.height - 59);
    }

    return {
        drawLoopIteration: function (canvas, ctx, chunks, screenCoordinates, players, playerCoordinates, shouldDrawMap) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "rgb(100, 100, 240)"
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            _.forEach(chunks, function (chunk) {
                drawChunk(ctx, chunk, screenCoordinates);
            });
            _.forEach(players, function (genericPlayer) {
                drawPlayer(ctx, genericPlayer, screenCoordinates);
            });
            drawInventory(ctx);
            if (shouldDrawMap) {
                map.draw(ctx, chunks, playerCoordinates, screenCoordinates);
            } else {
                drawMapControl(ctx, screenCoordinates)
            }
        }
    }
}