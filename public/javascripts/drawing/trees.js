(function (exports) {
    exports.createTreeArtist = function (chunker, screenDimensions, createCache) {
        function drawTree(context, options) {

            context.save();
            context.drawImage(treeImage, options.position.x, options.position.y)
            context.restore();
        }

        function generateStateForChunk(position, chunkSize) {
            var state = {};

            var numberOfTrees = Math.round(hashRandom(position.x, position.y, 'numberOfTrees') * 3);
            state.trees = [];
            for (var i = 0; i < numberOfTrees; i++) {
                state.trees.push(i);
            }
            state.trees = state.trees.map(function (treeNumber) {
                var tree = {};

                tree.position = {
                    x: hashRandom(position.x, position.y, treeNumber, 'tree-x') * chunkSize,
                    y: hashRandom(position.x, position.y, treeNumber, 'tree-y') * chunkSize
                }
                return tree;
            });

            return state;
        }

        function drawTreeChunk(drawTree, position, chunkSize, chunkState, ctx, debug) {
            if (debug) {
                ctx.save();
                ctx.fillStyle = 'white';
                ctx.strokeRect(0, 0, chunkSize, chunkSize);
                ctx.fillText('chunk: ' + position.x + ',' + position.y, chunkSize / 2, chunkSize / 2);
                ctx.restore();
            }
            chunkState.trees.forEach(function (tree) {
                drawTree(ctx, tree);
            })
        }

        function makeTreeChunk(position, chunkSize) {
            var chunkState = generateStateForChunk(position, chunkSize);
            return {
                position: position,
                draw: drawTreeChunk.bind(null, drawTree, position, chunkSize, chunkState)
            }
        }

        var cache = createCache(50);
        var treeImage = new Image()
        treeImage.src = '/images/tree.png'

        return {
            draw: function (ctx, screenCoordinates, debug) {
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

                var chunks = chunker.getVisibleChunks(viewPort, function (position, chunkSize) {
                    var cacheKey = 'trees:' + position.x + ',' + position.y;
                    return cache.get(cacheKey, makeTreeChunk.bind(null, position, chunkSize));
                }, 400);

                ctx.save();
                ctx.translate(-screenCoordinates.x, -screenCoordinates.y);
                chunks.forEach(function (chunk) {
                    ctx.save();
                    ctx.translate(chunk.position.x, chunk.position.y);
                    chunk.draw(ctx, debug);
                    ctx.restore();
                })
                ctx.restore();
            }
        }
    }
})(this);