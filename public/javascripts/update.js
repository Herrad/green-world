function createUpdate() {
    var draw = createDraw();
    var chunkCache = [];
    var chunkIds = [];
    var worldCoordinates = {x:0, y:0}
    var chunkToDraw;

    function cacheChunk(chunk) {
        chunkToDraw = chunk;
    }

    $('body').on('keydown', function(e) {
        if(e.keyCode == 37){
            worldCoordinates.x ++;
        }
    })

    return {
        mainLoop: function () {
            draw.draw(ctx, chunkToDraw, worldCoordinates);
        },
        updateChunk: function (chunk) {
            cacheChunk(chunk);
        }
    }
}