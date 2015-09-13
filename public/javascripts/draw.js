function createDraw(screenDimensions) {

    function drawChunk(ctx, chunk, offset) {
        for (var i = chunk.blips.length - 1; i >= 0; i--) {
            var blip = chunk.blips[i];
            if (chunk.coordinates.x + offset.x + blip.x > screenDimensions.width ||
                chunk.coordinates.x + offset.x + blip.x + blip.width < 0 ||
                chunk.coordinates.y + offset.y + blip.y + blip.height < 0 ||
                chunk.coordinates.y + offset.y + blip.y > screenDimensions.height) {
                continue
            }
            ctx.fillStyle = blip.rgb
            ctx.beginPath()
            ctx.moveTo(chunk.coordinates.x + offset.x + blip.x, chunk.coordinates.y + offset.y + blip.y)
            ctx.lineTo(chunk.coordinates.x + offset.x + blip.x + blip.width, chunk.coordinates.y + offset.y + blip.y);
            ctx.lineTo(chunk.coordinates.x + offset.x + blip.x + blip.width, chunk.coordinates.y + offset.y + blip.y + blip.height);
            ctx.lineTo(chunk.coordinates.x + offset.x + blip.x, chunk.coordinates.y + offset.y + blip.y + blip.height);
            ctx.fill();
        };
    }

    return {
        draw: function (ctx, chunk, offset) {

            drawChunk(ctx, chunk, offset);

        }
    }
}