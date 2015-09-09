function createUpdate() {
    var draw = createDraw();
    var chunkCache = [];
    var chunkIds = [];

    function cacheChunk(chunk) {
        if (chunkCache.length > 10) {
            chunkCache.shift(chunk)
        }
        chunkCache.push(chunk)
    }

    function refreshChunk(chunk) {
        chunkCache.push(chunk)
    }

    return {
        mainLoop: function () {
            draw.draw(ctx, chunkCache);
        },
        updateChunk: function (chunk) {
            cacheChunk(chunk);
        }
    }
}