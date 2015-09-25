function createMap(screenDimensions, offset) {
    var mapDimensions = {
        x: screenDimensions.realWidth - 458,
        y: screenDimensions.height - 478,
        width: 477,
        height: 489
    }

    function drawMapChunk(ctx, chunk, playerCoordinates, screenCoordinates) {
        var chunkWidth = 64 * 20;
        var reductionFactor = 16;
        var sizeOfChunk = Math.round(chunkWidth / reductionFactor);
        ctx.fillStyle = chunk.fillStyle || "rgb(200,200,0)";
        var xLocation = Math.round(chunk.coordinates.x / reductionFactor - screenCoordinates.x / reductionFactor + mapDimensions.x + offset.x);
        var yLocation = Math.round(chunk.coordinates.y / reductionFactor - screenCoordinates.y / reductionFactor + mapDimensions.y + offset.y);
        var offScreen = xLocation + sizeOfChunk <= mapDimensions.x ||
            xLocation >= mapDimensions.x + mapDimensions.width ||
            yLocation + sizeOfChunk <= mapDimensions.y ||
            yLocation >= mapDimensions.y + mapDimensions.height;
        if (offScreen) {
            return;
        }

        var toTheLeft = xLocation < mapDimensions.x;
        var toTheRight = xLocation + sizeOfChunk > mapDimensions.x + mapDimensions.width;
        var toTheTop = yLocation < mapDimensions.y;
        var toTheBottom = yLocation + sizeOfChunk > mapDimensions.y + mapDimensions.height;
        var xToDraw = width = 0;
        var yToDraw = height = 0;
        if (toTheLeft) {
            xToDraw = mapDimensions.x
            width = sizeOfChunk + xLocation - xToDraw;
        }
        if (toTheRight) {
            xToDraw = xToDraw || xLocation
            width = mapDimensions.x + mapDimensions.width - xToDraw;
        }
        xToDraw = xToDraw || xLocation;
        width = width || sizeOfChunk;

        if (toTheTop) {
            yToDraw = mapDimensions.y
            height = sizeOfChunk + yLocation - yToDraw;
        }
        if (toTheBottom) {
            yToDraw = yToDraw || yLocation
            height = height || mapDimensions.y + mapDimensions.height - yToDraw;
        }
        yToDraw = yToDraw || yLocation;
        height = height || sizeOfChunk;

        ctx.fillRect(xToDraw, yToDraw, width, height);
        ctx.fillStyle = "rgb(255,255,255)"
        ctx.fillRect(
            Math.round(playerCoordinates.x / reductionFactor + mapDimensions.x - screenCoordinates.x / reductionFactor + offset.x),
            Math.round(playerCoordinates.y / reductionFactor + mapDimensions.y - screenCoordinates.y / reductionFactor + offset.y),
            Math.round(64 / reductionFactor),
            Math.round(64 / reductionFactor));
        ctx.fillStyle = "rgb(240, 100, 100)"
        ctx.font = "12px sans-serif";
        if (xLocation + sizeOfChunk / 2 - chunk.name.length * 5 > mapDimensions.x &&
            xLocation + sizeOfChunk / 2 + chunk.name.length * 5 < mapDimensions.x + 457 &&
            yLocation + sizeOfChunk / 2 - 30 > mapDimensions.y &&
            yLocation + sizeOfChunk / 2 + 30 < mapDimensions.y + mapDimensions.height) {
            ctx.fillText(chunk.name, xLocation + sizeOfChunk / 2 - chunk.name.length * 3, yLocation + sizeOfChunk / 2);
        }
    }

    return {
        draw: function (ctx, chunks, playerCoordinates, screenCoordinates) {
            ctx.fillStyle = "rgb(100, 100, 240)"
            ctx.fillRect(mapDimensions.x, mapDimensions.y, mapDimensions.width, mapDimensions.height);

            ctx.fillStyle = "rgb(255, 255, 255)"
            ctx.fillRect(mapDimensions.x, mapDimensions.y - 12, mapDimensions.width, 12);

            _.forEach(chunks, function (chunk) {
                drawMapChunk(ctx, chunk, playerCoordinates, screenCoordinates);
            });
        }
    }
}