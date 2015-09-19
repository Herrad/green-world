function createDraw(screenDimensions, player, map) {
    var inventoryImage = new Image;
    inventoryImage.src = "/images/player/inventory.png"

    var inventoryInternalX = screenDimensions.realWidth - 458;
    var inventoryDimensions = {
        internalX: inventoryInternalX,
        externalX: screenDimensions.realWidth - 470,
        healthBar: {
            x: inventoryInternalX + 13,
            y: 128,
            width: 450,
            height: 25
        },
        textX: inventoryInternalX + 8,
        mapWidth: 477
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
        ctx.fillStyle = "rgb(255,0,0)";
        ctx.fillRect(inventoryDimensions.healthBar.x, inventoryDimensions.healthBar.y, inventoryDimensions.healthBar.width, inventoryDimensions.healthBar.height);
        ctx.drawImage(inventoryImage, inventoryDimensions.externalX, 0);

        ctx.fillStyle = "rgb(255,255,255)";
        ctx.font = "40px sans-serif";
        ctx.fillText(player.name, inventoryDimensions.textX, 50);
        ctx.fillText("[x:" + player.coordinates.x + ",y:" + player.coordinates.y + "]", inventoryDimensions.textX, 100);
    }

    function drawMapControl(ctx, screenCoordinates) {
        ctx.fillStyle = "rgb(255, 255, 255)"
        ctx.fillRect(inventoryDimensions.internalX, screenDimensions.height - 139, inventoryDimensions.mapWidth, 12);
        ctx.font = "30px sans-serif";
        ctx.fillText("Press 'M' for the map", screenDimensions.realWidth - 358, screenDimensions.height - 59);
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