function createUpdate(player) {
    var draw = createDraw();
    var chunkCache = [];
    var chunkIds = [];
    var worldCoordinates = {x:0, y:0}
    var chunkToDraw;

    function cacheChunk(chunk) {
        chunkToDraw = chunk;
    }

    $('body').on('keydown', function(e) {
        moveUnits = 5;
        if(e.keyCode == 37 || e.keyCode == 65){ //left
            worldCoordinates.x += moveUnits;
            player.faceLeft();
        }
        if(e.keyCode == 38 || e.keyCode == 87){ //up
            worldCoordinates.y += moveUnits;
            player.faceUp();
        }
        if(e.keyCode == 39 || e.keyCode == 68){ //right
            worldCoordinates.x -= moveUnits;
            player.faceRight();
        }
        if(e.keyCode == 40 || e.keyCode == 83){ //down
            worldCoordinates.y -= moveUnits;
            player.faceDown();
        }
    })

    return {
        mainLoop: function () {
            draw.draw(ctx, chunkToDraw, worldCoordinates);
            player.draw(ctx);
        },
        updateChunk: function (chunk) {
            cacheChunk(chunk);
        }
    }
}