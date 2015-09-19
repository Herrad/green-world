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
        ctx.fillRect(screenDimensions.realWidth - 470, 0, 510, 624);

        ctx.fillStyle = "rgb(255,0,0)";
        ctx.fillRect(screenDimensions.realWidth - 445, 128, 450, 25);
        ctx.drawImage(inventoryImage, screenDimensions.realWidth - 470, 0);

        ctx.fillStyle = "rgb(255,255,255)";
        ctx.font = "40px sans-serif";
        var xToDrawText = screenDimensions.realWidth - 450
        ctx.fillText(player.name, xToDrawText, 50);
        ctx.fillText("[x:" + player.coordinates.x + ",y:" + player.coordinates.y + "]", xToDrawText, 100);
    }

    function drawMapChunk(ctx, chunk, mapTopLeft, screenCoordinates, playerCoordinates, offset) {
        var chunkWidth = 128 * 20
        var reductionFactor = 16;
        var sizeOfChunk = Math.round(chunkWidth / reductionFactor);
        ctx.fillStyle = chunk.fillStyle || "rgb(200,200,0)";
        var xLocation = Math.round(chunk.coordinates.x / reductionFactor - screenCoordinates.x / reductionFactor + mapTopLeft.x + offset.x);
        var yLocation = Math.round(chunk.coordinates.y / reductionFactor - screenCoordinates.y / reductionFactor + mapTopLeft.y + offset.y);
        var offScreen = xLocation + sizeOfChunk <= mapTopLeft.x ||
            xLocation >= mapTopLeft.x + 477 ||
            yLocation + sizeOfChunk <= mapTopLeft.y ||
            yLocation >= mapTopLeft.y + 477 + 12;
        if (offScreen) {
            return;
        }

        var toTheLeft = xLocation < mapTopLeft.x;
        var toTheRight = xLocation + sizeOfChunk > mapTopLeft.x + 477;
        var toTheTop = yLocation < mapTopLeft.y;
        var toTheBottom = yLocation + sizeOfChunk > mapTopLeft.y + 477 + 12;
        var xToDraw = width = 0;
        var yToDraw = height = 0;
        if (toTheLeft) {
            xToDraw = mapTopLeft.x
            width = sizeOfChunk + xLocation - xToDraw;
        }
        if (toTheRight) {
            xToDraw = xToDraw || xLocation
            width = mapTopLeft.x + 477 - xToDraw;
        }
        xToDraw = xToDraw || xLocation;
        width = width || sizeOfChunk;

        if (toTheTop) {
            yToDraw = mapTopLeft.y
            height = sizeOfChunk + yLocation - yToDraw;
        }
        if (toTheBottom) {
            yToDraw = yToDraw || yLocation
            height = height || mapTopLeft.y + 499 - yToDraw;
        }
        yToDraw = yToDraw || yLocation;
        height = height || sizeOfChunk;

        ctx.fillRect(xToDraw, yToDraw, width, height);
        ctx.fillStyle = "rgb(81,93,255)"
        ctx.fillRect(
            Math.round(playerCoordinates.x / reductionFactor + mapTopLeft.x - screenCoordinates.x / reductionFactor + offset.x),
            Math.round(playerCoordinates.y / reductionFactor + mapTopLeft.y - screenCoordinates.y / reductionFactor + offset.y),
            Math.round(128 / reductionFactor),
            Math.round(128 / reductionFactor));
        ctx.fillStyle = "rgb(240, 100, 100)"
        ctx.font = "20px sans-serif";
        if (xLocation + sizeOfChunk / 2 - chunk.name.length * 5 > mapTopLeft.x &&
            xLocation + sizeOfChunk / 2 + chunk.name.length * 5 < mapTopLeft.x + 457 &&
            yLocation + sizeOfChunk / 2 - 30 > mapTopLeft.y &&
            yLocation + sizeOfChunk / 2 + 30 < mapTopLeft.y + 477) {
            ctx.fillText(chunk.name, xLocation + sizeOfChunk / 2 - chunk.name.length * 5, yLocation + sizeOfChunk / 2);
        }
    }

    function drawMap(ctx, chunks, playerCoordinates, screenCoordinates, playerCoordinates, offset) {
        ctx.fillStyle = "rgb(100, 100, 240)"
        ctx.fillRect(screenDimensions.realWidth - 458, screenDimensions.height - 477, 477, 489);

        ctx.fillStyle = "rgb(255, 255, 255)"
        ctx.fillRect(screenDimensions.realWidth - 458, screenDimensions.height - 489, 477, 12);

        var mapTopLeft = {
            x: screenDimensions.realWidth - 458,
            y: screenDimensions.height - 478
        }
        _.forEach(chunks, function (chunk) {
            drawMapChunk(ctx, chunk, mapTopLeft, screenCoordinates, playerCoordinates, offset);
        });
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
                drawMap(ctx, chunks, playerCoordinates, screenCoordinates, playerCoordinates, {
                    x: 160,
                    y: 165
                });
            } else {
                drawMapControl(ctx, screenCoordinates)
            }
        }
    }
}