function createDraw(screenDimensions, player) {

    var inventoryImage = new Image;
    inventoryImage.src = "/images/player/inventory.png"

    function drawChunk(ctx, chunk, offset) {
        for (var i = chunk.blips.length - 1; i >= 0; i--) {
            var blip = chunk.blips[i];
            if (chunk.coordinates.x + blip.x - offset.x > screenDimensions.gameWindowWidth + 128 ||
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
        ctx.fillRect(screenDimensions.realWidth - 490, 0, 510, 624);

        ctx.fillStyle = "rgb(255,0,0)";
        ctx.fillRect(screenDimensions.realWidth - 465, 128, 450, 25);
        ctx.drawImage(inventoryImage, screenDimensions.realWidth - 490, 0);

        ctx.fillStyle = "rgb(255,255,255)";
        ctx.font = "40px sans-serif";
        var xToDrawText = screenDimensions.realWidth - 470
        ctx.fillText(player.name, xToDrawText, 50);
        ctx.fillText("[x:" + player.coordinates.x + ",y:" + player.coordinates.y + "]", xToDrawText, 100);
    }

    function drawMapChunk(ctx, chunk, mapTopLeft, screenCoordinates) {
        var chunkWidth = 128 * 20
        var reductionFactor = 8;
        ctx.fillStyle = "rgb(200, 200, 0)"
        var xLocation = chunk.coordinates.x / reductionFactor - screenCoordinates.x / reductionFactor + mapTopLeft.x;
        var yLocation = chunk.coordinates.y / reductionFactor - screenCoordinates.y / reductionFactor;
        var offScreen = xLocation + chunkWidth / reductionFactor < mapTopLeft.x || xLocation > mapTopLeft.x + 477;
        if (offScreen) {
            return;
        }

        var toTheLeft = xLocation < mapTopLeft.x;
        var toTheRight = xLocation + chunkWidth / reductionFactor > mapTopLeft.x + 477;
        var toTheTop = yLocation < mapTopLeft.y;
        var toTheBottom = yLocation > mapTopLeft.y + 477;
        var xToDraw = width = 0;
        var yToDraw = mapTopLeft.y
        var height = 0;
        // if (toTheLeft) {
        //     xToDraw = mapTopLeft.x
        //     width = chunkWidth / reductionFactor + xLocation - xToDraw;
        //     height = 100
        // }
        // else
        if (toTheRight) {
            xToDraw = xLocation
            width = mapTopLeft.x + 477 - xToDraw;
            height = 100
        }
        // else {
        //     xToDraw = xLocation;
        //     width = chunkWidth / reductionFactor;
        //     height = 100
        // }
        // if (xToDraw + width > 477) {
        //     width = 477 - xToDraw
        // }
        // if (toTheTop) {
        //     yToDraw = mapTopLeft.y
        //     height = yToDraw - yLocation + chunkWidth / reductionFactor;
        // } else if (toTheBottom) {
        //     return
        // } else {
        //     yToDraw = yLocation;
        //     height = chunkWidth / reductionFactor
        // }
        // if (yToDraw + height > 477) {
        //     height = 477 - yToDraw
        // }
        ctx.fillRect(xToDraw, yToDraw, width, height);
        // ctx.fillStyle = "rgb(240, 100, 240)"
        // ctx.fillRect(playerCoordinates.x / reductionFactor + mapTopLeft.x - screenCoordinates.x / reductionFactor, playerCoordinates.y / reductionFactor + mapTopLeft.y - screenCoordinates.y / reductionFactor, 10, 10);

    }

    function drawMap(ctx, chunks, playerCoordinates, screenCoordinates) {
        ctx.fillStyle = "rgb(200, 100, 240)"
        ctx.fillRect(screenDimensions.realWidth - 478, screenDimensions.height - 12 - 400, 477, screenDimensions.height - 12);

        var mapTopLeft = {
            x: screenDimensions.realWidth - 478,
            y: screenDimensions.height - 12 - 400
        }
        _.forEach(chunks, function (chunk) {
            drawMapChunk(ctx, chunk, mapTopLeft, screenCoordinates);
        });
    }

    return {
        drawLoopIteration: function (canvas, ctx, chunks, screenCoordinates, players, playerCoordinates) {
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
            //drawMap(ctx, chunks, playerCoordinates, screenCoordinates);
        }
    }
}