function createDraw(screenDimensions) {

    function drawChunk(ctx, chunk, offset) {
        for (var i = chunk.blips.length - 1; i >= 0; i--) {
            var blip = chunk.blips[i];
            if (chunk.coordinates.x + blip.x - offset.x > screenDimensions.width + 128 ||
                chunk.coordinates.x + blip.x + blip.width - offset.x < -128 ||
                chunk.coordinates.y + blip.y + blip.height - offset.y < -128 ||
                chunk.coordinates.y + blip.y - offset.y > screenDimensions.height + 128) {
                continue
            }
            ctx.fillStyle = blip.rgb
            ctx.beginPath()
            ctx.moveTo(chunk.coordinates.x + blip.x - offset.x, chunk.coordinates.y + blip.y - offset.y)
            ctx.lineTo(chunk.coordinates.x + blip.x + blip.width - offset.x, chunk.coordinates.y + blip.y - offset.y);
            ctx.lineTo(chunk.coordinates.x + blip.x + blip.width - offset.x, chunk.coordinates.y + blip.y + blip.height - offset.y);
            ctx.lineTo(chunk.coordinates.x + blip.x - offset.x, chunk.coordinates.y + blip.y + blip.height - offset.y);
            ctx.fill();
        };
    }

    return {
        draw: function (ctx, chunk, offset) {

            drawChunk(ctx, chunk, offset);

        }
    }
}