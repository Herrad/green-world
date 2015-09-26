function createChunkInterpreter(chunkCache, collisionDetection) {

    function findBlipCoordinatesOfClick(clickLocationInWorld) {

        var coordinates;
        _.forEach(chunkCache.data, function (chunk) {
            var chunkRectangle = {
                x: chunk.coordinates.x,
                y: chunk.coordinates.y,
                width: chunk.coordinates.x + chunk.dimensions.width,
                height: chunk.coordinates.y + chunk.dimensions.height
            }
            if (collisionDetection.pointingAt(clickLocationInWorld, chunkRectangle)) {
                _.forEach(chunk.blips, function (blip) {
                    var blipRectangle = {
                        x: chunk.coordinates.x + blip.x,
                        y: chunk.coordinates.y + blip.y,
                        width: chunk.coordinates.x + blip.x + blip.width,
                        height: chunk.coordinates.y + blip.y + blip.height
                    };
                    if (collisionDetection.pointingAt(clickLocationInWorld, blipRectangle)) {
                        coordinates = {
                            x: chunk.coordinates.x + blip.x,
                            y: chunk.coordinates.y + blip.y
                        };
                    }
                });
            }
        });

        return coordinates;
    }
    return {
        getBlipClicked: function (clickLocationInWorld) {
            return findBlipCoordinatesOfClick(clickLocationInWorld)
        }
    }
}