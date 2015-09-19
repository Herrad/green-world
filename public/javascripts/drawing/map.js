function createMap(screenDimensions, offset) {
    function drawMapChunk(ctx, chunk, mapTopLeft, playerCoordinates, screenCoordinates) {
        var chunkWidth = 64 * 20
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
            Math.round(64 / reductionFactor),
            Math.round(64 / reductionFactor));
        ctx.fillStyle = "rgb(240, 100, 100)"
        ctx.font = "12px sans-serif";
        if (xLocation + sizeOfChunk / 2 - chunk.name.length * 5 > mapTopLeft.x &&
            xLocation + sizeOfChunk / 2 + chunk.name.length * 5 < mapTopLeft.x + 457 &&
            yLocation + sizeOfChunk / 2 - 30 > mapTopLeft.y &&
            yLocation + sizeOfChunk / 2 + 30 < mapTopLeft.y + 477) {
            ctx.fillText(chunk.name, xLocation + sizeOfChunk / 2 - chunk.name.length * 3, yLocation + sizeOfChunk / 2);
        }
    }

    return {
        draw: function (ctx, chunks, playerCoordinates, screenCoordinates) {
            ctx.fillStyle = "rgb(100, 100, 240)"
            ctx.fillRect(screenDimensions.realWidth - 458, screenDimensions.height - 477, 477, 489);

            ctx.fillStyle = "rgb(255, 255, 255)"
            ctx.fillRect(screenDimensions.realWidth - 458, screenDimensions.height - 489, 477, 12);

            var mapTopLeft = {
                x: screenDimensions.realWidth - 458,
                y: screenDimensions.height - 478
            }
            _.forEach(chunks, function (chunk) {
                drawMapChunk(ctx, chunk, mapTopLeft, playerCoordinates, screenCoordinates);
            });
        }
    }
}