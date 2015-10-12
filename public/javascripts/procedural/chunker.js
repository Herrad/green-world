(function (exports) {
    exports.createChunker = function () {
        return {
            getVisibleChunks: function getVisibleChunks(viewPort, makeChunk, chunkSize) {
                var chunkSize = chunkSize || 80;
                var minX = Math.floor((viewPort.centre.x - viewPort.size.width / 2) / chunkSize) * chunkSize;
                var maxX = Math.floor((viewPort.centre.x + viewPort.size.width / 2) / chunkSize) * chunkSize;
                var minY = Math.floor((viewPort.centre.y - viewPort.size.height / 2) / chunkSize) * chunkSize;
                var maxY = Math.floor((viewPort.centre.y + viewPort.size.height / 2) / chunkSize) * chunkSize;

                var visibleChunks = [];
                for (var x = minX; x <= maxX; x += chunkSize) {
                    for (var y = minY; y <= maxY; y += chunkSize) {
                        (function () {
                            var position = {
                                x: x,
                                y: y
                            };

                            visibleChunks.push(makeChunk(position, chunkSize));
                        })();
                    }
                }
                return visibleChunks;
            }
        };
    }
})(this)
