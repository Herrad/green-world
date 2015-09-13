var _ = require('lodash');

module.exports = function createChunkList() {
    var chunks = [];
    var blipSize = 128;
    var numberOfXBlips = 20;
    var numberOfYBlips = 20;

    var chunkWidth = blipSize * numberOfXBlips;
    var chunkHeight = blipSize * numberOfYBlips;

    function generateChunkAt(coordinates) {
        var chunk = {
            blips: [],
            coordinates: coordinates
        };
        var r, g, b;
        var redFactor = Math.random()
        var redBase = redFactor < 0.8 ? 10 : 60;
        var redMulti = redFactor < 0.8 ? 20 : 50;
        var blueBase = 20;
        var blueMulti = 0;
        for (var x = 0; x < numberOfXBlips; x++) {
            for (var y = 0; y < numberOfYBlips; y++) {
                r = Math.floor(Math.random() * redMulti + redBase);
                g = Math.floor(Math.random() * 80 + 100);
                b = Math.floor(Math.random() * blueMulti + blueBase);
                chunk.blips.push({
                    rgb: "rgb(" + r + "," + g + "," + b + ")",
                    x: x * blipSize,
                    y: y * blipSize,
                    width: blipSize,
                    height: blipSize
                })
            };
        };
        return chunk;
    };

    function generateChunkNear(coordinates) {
        var specificX = chunkWidth * Math.floor(coordinates.x / chunkWidth)
        var specificY = chunkHeight * Math.floor(coordinates.y / chunkHeight)
        var specificCoordinates = {
            x: specificX,
            y: specificY
        }
        return generateChunkAt(specificCoordinates);
    }

    function getChunkRelativeCoordinates(coordinates) {

        var chunkRelativeX = coordinates.x;
        while (chunkRelativeX > chunkWidth) {
            chunkRelativeX -= chunkWidth;
        }
        var chunkRelativeY = coordinates.y;
        while (chunkRelativeY > chunkHeight) {
            chunkRelativeY -= chunkHeight;
        }
        while (chunkRelativeX < 0) {
            chunkRelativeX += chunkWidth;
        }
        while (chunkRelativeY < 0) {
            chunkRelativeY += chunkHeight;
        }
        return {
            x: chunkRelativeX,
            y: chunkRelativeY
        };
    }

    function findChunkAt(xRegion, yRegion) {
        var chunkToReturn = 0;
        _.forEach(chunks, function (chunk) {
            if (xRegion >= chunk.coordinates.x && xRegion < chunk.coordinates.x + chunkWidth &&
                yRegion >= chunk.coordinates.y && yRegion < chunk.coordinates.y + chunkHeight) {
                chunkToReturn = chunk;
            }
        });
        if (chunkToReturn === 0) {
            var chunk = generateChunkNear({
                x: xRegion,
                y: yRegion
            });
            chunks.push(chunk);
            return chunk;
        }
        return chunkToReturn;
    }

    return {
        getChunksNearby: function (coordinates) {
            var chunksNearby = [findChunkAt(coordinates.x, coordinates.y)];
            var chunkRelativeCoordinates = getChunkRelativeCoordinates(coordinates);
            var isInEast = chunkRelativeCoordinates.x < chunkWidth / 2
            var isInNorth = chunkRelativeCoordinates.y < chunkHeight / 2
            if (isInNorth) {
                chunksNearby.push(findChunkAt(coordinates.x, coordinates.y - chunkHeight))
                chunksNearby.push(findChunkAt(coordinates.x - chunkWidth, coordinates.y - chunkHeight))
                chunksNearby.push(findChunkAt(coordinates.x + chunkWidth, coordinates.y - chunkHeight))
            } else {
                chunksNearby.push(findChunkAt(coordinates.x, coordinates.y + chunkHeight))
                chunksNearby.push(findChunkAt(coordinates.x - chunkWidth, coordinates.y + chunkHeight))
                chunksNearby.push(findChunkAt(coordinates.x + chunkWidth, coordinates.y + chunkHeight))
            }
            if (isInEast) {
                chunksNearby.push(findChunkAt(coordinates.x - chunkWidth, coordinates.y))
                chunksNearby.push(findChunkAt(coordinates.x - chunkWidth, coordinates.y + chunkHeight))
                chunksNearby.push(findChunkAt(coordinates.x - chunkWidth, coordinates.y - chunkHeight))
            } else {
                chunksNearby.push(findChunkAt(coordinates.x + chunkWidth, coordinates.y))
                chunksNearby.push(findChunkAt(coordinates.x + chunkWidth, coordinates.y + chunkHeight))
                chunksNearby.push(findChunkAt(coordinates.x + chunkWidth, coordinates.y - chunkHeight))
            }
            return chunksNearby;
        },
        findChunkAt: function (coordinates) {
            return findChunkAt(coordinates.x, coordinates.y)
        }
    }
}