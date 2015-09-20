function createDraw(screenDimensions, player, map, collision) {

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

    function drawChunk(ctx, chunk, offset, mouseLocation, setBuildLocation) {
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

            if (collision.pointingAt(mouseLocation, blipBox)) {
                setBuildLocation({
                    x: blip.x + chunk.coordinates.x,
                    y: blip.y + chunk.coordinates.y
                });
            }
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
        clearCanvas: function (canvas, ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "rgb(100, 100, 240)"
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        },
        drawChunks: function (ctx, chunks, screenCoordinates, mouseLocation, setBlipLocation) {
            _.forEach(chunks, function (chunk) {
                drawChunk(ctx, chunk, screenCoordinates, mouseLocation, setBlipLocation);
            });
        },
        drawPlayers: function (ctx, screenCoordinates, players) {
            _.forEach(players, function (genericPlayer) {
                drawPlayer(ctx, genericPlayer, screenCoordinates);
            });
        },
        drawInventory: drawInventory,
        drawMap: function (ctx, chunks, playerCoordinates, screenCoordinates, controls) {
            if (controls.drawMap) {
                map.draw(ctx, chunks, playerCoordinates, screenCoordinates);
            } else {
                drawMapControl(ctx, screenCoordinates)
            }
        }
    }
}