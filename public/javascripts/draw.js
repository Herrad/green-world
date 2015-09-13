function createDraw(screenDimensions) {

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

    function drawPlayer(ctx, player, screenCoordinates) {
        var xToDraw = player.coordinates.x - screenCoordinates.x;
        var yToDraw = player.coordinates.y - screenCoordinates.y;
        ctx.drawImage(player.imageToDraw, xToDraw, yToDraw);
        ctx.fillStyle = "rgb(0,0,0)";
        ctx.font = "30px serif";
        var xToDrawText = xToDraw + 128 / 2 - (player.name.length / 2) * 15
        ctx.fillText(player.name, xToDrawText, yToDraw - 20);
    }

    return {
        drawLoopIteration: function (canvas, ctx, chunks, screenCoordinates, players) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "rgb(100, 100, 240)"
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            _.forEach(chunks, function (chunk) {
                drawChunk(ctx, chunk, screenCoordinates);
            });
            _.forEach(players, function (player) {
                drawPlayer(ctx, player, screenCoordinates);
            });
        }
    }
}