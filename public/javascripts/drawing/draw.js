function createDraw(screenDimensions, player, map) {

    var inventoryInternalX = screenDimensions.realWidth - 458;
    var inventoryDimensions = {
        internal: {
            x: inventoryInternalX,
            y: 12,
            width: 458,
            height: screenDimensions.height - 12
        },
        external: {
            x: screenDimensions.realWidth - 470,
            y: 0,
            width: 500,
            height: screenDimensions.height
        },
        textX: inventoryInternalX + 8,
        mapWidth: 477
    }

    var healthBar = {
        x: inventoryDimensions.internal.x + 12,
        y: Math.floor(inventoryDimensions.external.height / 8),
        width: inventoryDimensions.internal.width - 24,
        height: 30
    }

    var BLIP_SIZE = 0;

    function drawChunk(ctx, chunk, offset) {
        BLIP_SIZE = BLIP_SIZE || chunk.blipSize;
        for (var i = chunk.blips.length - 1; i >= 0; i--) {
            var blip = chunk.blips[i];
            if (chunk.coordinates.x + blip.x - offset.x > screenDimensions.gameWindowWidth + BLIP_SIZE ||
                chunk.coordinates.x + blip.x + blip.width - offset.x < -BLIP_SIZE ||
                chunk.coordinates.y + blip.y + blip.height - offset.y < -BLIP_SIZE ||
                chunk.coordinates.y + blip.y - offset.y > screenDimensions.height + BLIP_SIZE) {
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
        var xToDrawText = xToDraw + BLIP_SIZE / 2 - (genericPlayer.name.length / 2) * 15
        ctx.fillText(genericPlayer.name, xToDrawText, yToDraw - 20);
    }

    function drawInventory(ctx) {
        ctx.fillStyle = "rgb(255,255,255)";
        draw(ctx, inventoryDimensions.external);
        ctx.fillStyle = "rgb(0,0,0)";
        draw(ctx, inventoryDimensions.internal);

        ctx.fillStyle = "rgb(255,255,255)";
        ctx.font = "40px sans-serif";
        ctx.fillText(player.name, inventoryDimensions.textX, 50);
        ctx.fillText("[x:" + player.coordinates.x + ",y:" + player.coordinates.y + "]", inventoryDimensions.textX, 100);
    }

    function drawMapControl(ctx, screenCoordinates) {
        ctx.fillStyle = "rgb(255, 255, 255)"
        ctx.fillRect(inventoryDimensions.internal.x, screenDimensions.height - 139, inventoryDimensions.mapWidth, 12);
        ctx.font = "30px sans-serif";
        ctx.fillText("Press 'M' for the map", screenDimensions.realWidth - 358, screenDimensions.height - 59);
    }

    function draw(ctx, rectangle) {
        if (!rectangle || rectangle.x === undefined || rectangle.y === undefined || rectangle.width === undefined || rectangle.height === undefined) {
            return;
        }
        ctx.fillRect(rectangle.x, rectangle.y, rectangle.width, rectangle.height);
    }

    return {
        drawLoopIteration: function (canvas, ctx, chunks, screenCoordinates, players, playerCoordinates, controls) {
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
            if (controls.drawMap) {
                map.draw(ctx, chunks, playerCoordinates, screenCoordinates);
            } else {
                drawMapControl(ctx, screenCoordinates)
            }
        }
    }
}