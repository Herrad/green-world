var _ = require('lodash');

module.exports = function createChunkList(biomeGenerator, nameGenerator) {
    var chunks = [];
    var blipSize = 64;
    var numberOfXBlips = 20;
    var numberOfYBlips = 20;

    var chunkWidth = blipSize * numberOfXBlips;
    var chunkHeight = blipSize * numberOfYBlips;

    var rTotal = gTotal = bTotal = 0;

    function randomiseColour(colour) {
        return Math.floor(Math.random() * colour.multiplier + colour.base);
    }

    function useUniform(biome) {
        return biome.uniform && Math.floor(Math.random() * 100) > 20;
    }

    function randomise(biome) {
        if (useUniform(biome)) {
            var uniform = biome.uniform();
            rTotal = gTotal = bTotal += uniform;
            return {
                r: uniform,
                g: uniform,
                b: uniform
            }
        }
        var r = randomiseColour(biome.r)
        rTotal += r;
        var g = randomiseColour(biome.g)
        gTotal += g;
        var b = randomiseColour(biome.b)
        bTotal += b;
        return {
            r: r,
            g: g,
            b: b
        }
    }

    function generateChunkAt(coordinates) {
        rTotal = gTotal = bTotal = 0
        var chunk = {
            blips: [],
            coordinates: coordinates,
            dimensions: {
                width: numberOfXBlips * blipSize,
                height: blipSize * numberOfYBlips
            }
        };
        var neighbours = [
            getCachedChunkAt(coordinates.x, coordinates.y - chunk.dimensions.height),
            getCachedChunkAt(coordinates.x - chunk.dimensions.width, coordinates.y),
            getCachedChunkAt(coordinates.x, coordinates.y + chunk.dimensions.height),
            getCachedChunkAt(coordinates.x + chunk.dimensions.width, coordinates.y)
        ];
        var biome = biomeGenerator.generate(neighbours);
        chunk.biome = biome.name;
        for (var x = 0; x < numberOfXBlips; x++) {
            for (var y = 0; y < numberOfYBlips; y++) {
                var colours = randomise(biome);
                chunk.blips.push({
                    rgb: "rgb(" + colours.r + "," + colours.g + "," + colours.b + ")",
                    x: x * blipSize,
                    y: y * blipSize,
                    width: blipSize,
                    height: blipSize
                })
            };
        };
        var chunkR = Math.floor(rTotal / (numberOfXBlips * numberOfYBlips));
        var chunkG = Math.floor(gTotal / (numberOfXBlips * numberOfYBlips));
        var chunkB = Math.floor(bTotal / (numberOfXBlips * numberOfYBlips));
        chunk.fillStyle = "rgb(" + chunkR + "," + chunkG + "," + chunkB + ")";
        chunk.locationHash = '[x:' + chunk.coordinates.x + ',y:' + chunk.coordinates.y + ']';
        chunk.hash = chunk.locationHash;
        chunk.name = nameGenerator.buildName();
        chunk.blipSize = blipSize;
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

    function getCachedChunkAt(xRegion, yRegion) {
        var chunkToReturn = 0;
        _.forEach(chunks, function (chunk) {
            if (xRegion >= chunk.coordinates.x && xRegion < chunk.coordinates.x + chunkWidth &&
                yRegion >= chunk.coordinates.y && yRegion < chunk.coordinates.y + chunkHeight) {
                chunkToReturn = chunk;
            }
        });
        return chunkToReturn;
    }

    function findOrGenerateChunkAt(xRegion, yRegion) {
        var chunkToReturn = getCachedChunkAt(xRegion, yRegion);
        if (chunkToReturn) return chunkToReturn;

        var chunk = generateChunkNear({
            x: xRegion,
            y: yRegion
        });
        chunks.push(chunk);
        return chunk;
    }

    function hashChunks(chunks) {
        var hash = '';
        _.chain(chunks)
            .sortByAll(['coordinates.x', 'coordinates.y'])
            .forEach(function (chunk) {
                hash += chunk.hash;
            }).value();
        return hash;
    }

    return {
        getChunksNearby: function (coordinates) {
            var chunksNearby = [findOrGenerateChunkAt(coordinates.x, coordinates.y)];
            var chunkRelativeCoordinates = getChunkRelativeCoordinates(coordinates);
            chunksNearby.push(findOrGenerateChunkAt(coordinates.x, coordinates.y - chunkHeight))
            chunksNearby.push(findOrGenerateChunkAt(coordinates.x + chunkWidth, coordinates.y - chunkHeight))
            chunksNearby.push(findOrGenerateChunkAt(coordinates.x - chunkWidth, coordinates.y))
            chunksNearby.push(findOrGenerateChunkAt(coordinates.x - chunkWidth, coordinates.y + chunkHeight))
            chunksNearby.push(findOrGenerateChunkAt(coordinates.x, coordinates.y + chunkHeight))
            chunksNearby.push(findOrGenerateChunkAt(coordinates.x + chunkWidth, coordinates.y + chunkHeight))
            chunksNearby.push(findOrGenerateChunkAt(coordinates.x + chunkWidth, coordinates.y))
            chunksNearby.push(findOrGenerateChunkAt(coordinates.x - chunkWidth, coordinates.y - chunkHeight))

            return chunksNearby;
        },
        findChunkAt: function (coordinates) {
            return findOrGenerateChunkAt(coordinates.x, coordinates.y)
        },
        needsChunks: function (coordinates, chunkHash) {
            var wouldGet = hashChunks(this.getChunksNearby(coordinates));
            if (wouldGet !== chunkHash) {
                console.log('returning chunks: ')
            }
            return wouldGet !== chunkHash;
        },
        writeChunk: function (chunk) {
            _.remove(chunks, {
                locationHash: chunk.locationHash
            });
            chunks.push(chunk);
        }
    }
}