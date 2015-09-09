function createDraw() {

    function drawChunk(chunk, offset) {
        for (var i = chunk.blips.length - 1; i >= 0; i--) {
            var blip = chunk.blips[i];
            ctx.fillStyle = blip.rgb
            ctx.beginPath()
            ctx.moveTo(offset.x + blip.x, offset.y + blip.y)
            ctx.lineTo(offset.x + blip.x + blip.width, offset.y + blip.y);
            ctx.lineTo(offset.x + blip.x + blip.width, offset.y + blip.y + blip.height);
            ctx.lineTo(offset.x + blip.x, offset.y + blip.y + blip.height);
            ctx.fill();
        };
    }

    return {
        draw: function (ctx, chunk, offset) {

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "rgb(100, 100, 240)"
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            if(chunk){
                
            drawChunk(chunk, offset);
            }
            
        }
    }
}