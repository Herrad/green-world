function createUpdate() {
    var draw = createDraw();
    var chunkCache = [];
    var chunkIds = [];
    var worldCoordinates = {x:-256, y:-256}
    var chunkToDraw;

    function cacheChunk(chunk) {
        chunkToDraw = chunk;
    }

    $('body').on('keydown', function(e) {
        moveUnits = 5;
        if(e.keyCode == 37 || e.keyCode == 65){ //left
            worldCoordinates.x += moveUnits;
        }
        if(e.keyCode == 38 || e.keyCode == 87){ //up
            worldCoordinates.y += moveUnits;
        }
        if(e.keyCode == 39 || e.keyCode == 68){ //right
            worldCoordinates.x -= moveUnits;
        }
        if(e.keyCode == 40 || e.keyCode == 83){ //down
            worldCoordinates.y -= moveUnits;
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