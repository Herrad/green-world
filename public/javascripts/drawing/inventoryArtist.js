function createInventoryArtist(screenDimensions) {

    var inventoryInternalX = screenDimensions.realWidth - 458;
    var middleSegmentDimensions = {
        x: inventoryInternalX,
        y: 120,
        width: 458,
        height: screenDimensions.height - 139 - 180,
        textX: inventoryInternalX + 8
    }
    return {
        draw: function (ctx) {
            ctx.fillStyle = "rgb(255,255,255)";
            draw(ctx, {
                x: middleSegmentDimensions.x,
                y: middleSegmentDimensions.y,
                width: middleSegmentDimensions.width,
                height: 10
            });
            ctx.fillStyle = "rgb(70,70,70)";
            draw(ctx, {
                x: middleSegmentDimensions.x,
                y: 190,
                width: middleSegmentDimensions.width,
                height: middleSegmentDimensions.height
            });
            ctx.fillStyle = "rgb(255,255,255)";
            draw(ctx, {
                x: middleSegmentDimensions.x,
                y: 185,
                width: middleSegmentDimensions.width,
                height: 5
            });
            ctx.fillText("Inventory", middleSegmentDimensions.textX, 170);

        }
    }
}