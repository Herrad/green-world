var chunker = {
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
}



function drawFlowerChunk(drawFlower, position, chunkSize, ctx) {
    function generateInitialState(position, chunkSize) {
        var state = {};

        var numberOfFlowers = Math.round(hashRandom(position.x, position.y, 'numberOfFlowers') * 3);
        state.flowers = [];
        for (var i = 0; i < numberOfFlowers; i++) {
            state.flowers.push(i);
        }
        state.flowers = state.flowers.map(function (flowerNumber) {
            var flower = {};
            var flowerSize = hashRandom(position.x, position.y, flowerNumber, 'flower size') * 10 + 5;

            var radius = flowerSize / 3;
            var baseFlowerColor = hashRandom(position.x, position.y, flowerNumber, 'flower color') > 0.98 ? '#FFFF00' : '#FF0000';
            // var colorOp = hashRandom(position.x, position.y, flowerNumber, 'lighten or darken') > 0.5 ? 'lighten' : 'darken';
            // var flowerColor = tinycolor(baseFlowerColor)[colorOp](hashRandom(position.x, position.y, flowerNumber, 'flower darken') * 30).toHexString();
            flowerColor = baseFlowerColor;

            flower.color = flowerColor;
            flower.radius = radius;
            flower.position = {
                x: hashRandom(position.x, position.y, flowerNumber, 'flower-x') * chunkSize,
                y: hashRandom(position.x, position.y, flowerNumber, 'flower-y') * chunkSize
            }
            return flower;
        });

        return state;
    }
    ctx.save();
    ctx.fillStyle = 'white';
    ctx.strokeRect(0, 0, chunkSize, chunkSize);
    // ctx.translate(-chunkSize/2,-chunkSize/2)
    ctx.fillText('chunk: ' +  position.x + ',' + position.y, chunkSize/2, chunkSize/2);
    ctx.restore();
    generateInitialState(position, chunkSize).flowers.forEach(function(flower){
      drawFlower(ctx, flower);
    })
}

function createDraw(canvas, screenDimensions, map, chunkCache, middlePanelArtist, rightPanelArtist, rightPanelDimensions, drawFlower) {
    var ctx = canvas.getContext('2d');
    var BLIP_SIZE = 0;

    function drawChunk(chunk, offset) {
        BLIP_SIZE = BLIP_SIZE || chunk.blipSize;
        for (var i = chunk.blips.length - 1; i >= 0; i--) {
            var blip = chunk.blips[i];
            var blipBox = {
                x: chunk.coordinates.x + blip.x - offset.x,
                y: chunk.coordinates.y + blip.y - offset.y,
                width: chunk.coordinates.x + blip.x + blip.width - offset.x,
                height: chunk.coordinates.y + blip.y + blip.height - offset.y
            }
            if (blipBox.x > screenDimensions.gameWindowWidth + BLIP_SIZE ||
                blipBox.width < -BLIP_SIZE ||
                blipBox.height < -BLIP_SIZE ||
                blipBox.y > screenDimensions.height + BLIP_SIZE) {
                continue
            }
            ctx.fillStyle = blip.rgb
            ctx.beginPath()
            ctx.moveTo(blipBox.x, blipBox.y)
            ctx.lineTo(blipBox.width, blipBox.y);
            ctx.lineTo(blipBox.width, blipBox.height);
            ctx.lineTo(blipBox.x, blipBox.height);
            ctx.fill();
        }

    }

    function drawPlayer(genericPlayer, screenCoordinates) {
        var xToDraw = genericPlayer.coordinates.x - screenCoordinates.x;
        var yToDraw = genericPlayer.coordinates.y - screenCoordinates.y;
        ctx.drawImage(genericPlayer.imageToDraw, xToDraw, yToDraw);
        ctx.fillStyle = "rgb(0,0,0)";
        ctx.font = "30px sans-serif";
        var xToDrawText = xToDraw + BLIP_SIZE / 2 - (genericPlayer.name.length / 2) * 15
        ctx.fillText(genericPlayer.name, xToDrawText, yToDraw - 20);
    }


    function drawChunks(screenCoordinates) {
        _.forEach(chunkCache.getData(), function (chunk) {
            drawChunk(chunk, screenCoordinates);
        });
    }

    function clearCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "rgb(100, 100, 240)"
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    function drawFlowers(drawFlower, screenCoordinates) {
        var viewPort = {
            centre: {
                x: screenCoordinates.x + screenDimensions.gameWindowWidth / 2,
                y: screenCoordinates.y + screenDimensions.height / 2,
            },
            size: {
                height: screenDimensions.height,
                width: screenDimensions.gameWindowWidth
            }
        };

        function makeFlowerChunk(position, chunkSize) {
            return {
                position: position,
                draw: drawFlowerChunk.bind(null, drawFlower, position, chunkSize)
            }
        }
        var chunks = chunker.getVisibleChunks(viewPort, makeFlowerChunk, 400);
        ctx.save();
        ctx.translate(-screenCoordinates.x, -screenCoordinates.y);
        chunks.forEach(function(chunk){
          ctx.save();
          ctx.translate(chunk.position.x, chunk.position.y);
          chunk.draw(ctx);
          ctx.restore();
        })
        ctx.restore();
    }

    function drawWorld(game, screenCoordinates, buildingInterface, drawFlower) {
        drawChunks(screenCoordinates);
        drawFlowers(drawFlower, screenCoordinates);
        buildingInterface.drawBuildings(ctx, screenCoordinates);
        if (game.controls.buildingMode) {
            console.log('buildAt:', buildingInterface.buildAt);
            buildingInterface.drawBlueprint(ctx, buildingInterface.buildAt, screenCoordinates);
        }

        drawPlayers(screenCoordinates, game.players)
    }

    function drawPlayers(screenCoordinates, players) {
        _.forEach(players, function (genericPlayer) {
            drawPlayer(genericPlayer, screenCoordinates);
        });
    }

    return {
        drawAll: function (screenCoordinates, buildingInterface, warnings, game) {
            clearCanvas();
            drawWorld(game, screenCoordinates, buildingInterface, drawFlower);
            rightPanelArtist.draw(game, screenCoordinates);
            warnings.draw(ctx);
        }
    }
}
