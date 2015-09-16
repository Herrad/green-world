function createDraw(screenDimensions, player) {

    var inventoryImage = new Image;
    inventoryImage.src = "/images/player/inventory.png"

    function drawChunk(ctx, chunk, offset) {
        for (var i = chunk.blips.length - 1; i >= 0; i--) {
            var blip = chunk.blips[i];
            if (chunk.coordinates.x + blip.x - offset.x > screenDimensions.width + 128 ||
                chunk.coordinates.x + blip.x + blip.width - offset.x < -128 ||
                chunk.coordinates.y + blip.y + blip.height - offset.y < -128 ||
                chunk.coordinates.y + blip.y - offset.y > screenDimensions.height + 128) {
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
        var xToDrawText = xToDraw + 128 / 2 - (genericPlayer.name.length / 2) * 15
        ctx.fillText(genericPlayer.name, xToDrawText, yToDraw - 20);
    }

    function drawInventory(ctx) {
        ctx.fillStyle = "rgb(255,255,255)";
        ctx.fillRect(screenDimensions.width - 490, 0, 510, screenDimensions.height + 10);
        ctx.fillStyle = "rgb(255,0,0)";
        ctx.font = "80px sans-serif";
        ctx.fillRect(screenDimensions.width - 439, 128, 400, 25);
        ctx.drawImage(inventoryImage, screenDimensions.width - 490, 0);
        ctx.fillStyle = "rgb(255,255,255)";
        var xToDrawText = screenDimensions.width - 365 - (player.name.length / 2)
        ctx.fillText(player.name, xToDrawText, 96);
    }

    return {
        drawLoopIteration: function (canvas, ctx, chunks, screenCoordinates, players) {
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
        }
    }
}