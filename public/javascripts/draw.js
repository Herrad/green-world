function createDraw() {

    function drawChunk(chunk) {
        for (var i = chunk.blips.length - 1; i >= 0; i--) {
            var blip = chunk.blips[i];
            ctx.fillStyle = blip.rgb
            ctx.beginPath()
            ctx.moveTo(blip.x, blip.y)
            ctx.lineTo(blip.x + blip.width, blip.y);
            ctx.lineTo(blip.x + blip.width, blip.y + blip.height);
            ctx.lineTo(blip.x, blip.y + blip.height);
            ctx.fill();
        };
    }

    return {
        draw: function (ctx, chunkCache) {

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "rgb(100, 100, 240)"
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            for (var i = chunkCache.length - 1; i >= 0; i--) {
                drawChunk(chunkCache[i]);
            };
        }
    }
}