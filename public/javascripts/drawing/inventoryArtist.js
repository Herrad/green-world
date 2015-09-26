function createInventoryArtist(screenDimensions, inventory, rightPanelDimensions) {
    function getImage(name) {
        var image = new Image
        image.src = '/images/inventory/' + name + '.png'
        return image;
    }

    var images = [{
        name: 'stone',
        image: getImage('stone')
    }, {
        name: 'wood',
        image: getImage('wood')
    }]

    var inventoryInternalX = screenDimensions.realWidth - 458;
    var middleSegmentDimensions = rightPanelDimensions.middlePanel
    var grid = {
        cellWidth: Math.floor(middleSegmentDimensions.width / 4),
        cellHeight: Math.floor(middleSegmentDimensions.height / 6),
        margin: 10
    }

    function setupGrid() {
        var lines = [];
        for (var y = 4; y >= 1; y--) {
            lines.push({
                x: Math.floor(middleSegmentDimensions.x + grid.cellWidth * y),
                y: middleSegmentDimensions.inventory.y,
                width: 1,
                height: middleSegmentDimensions.height
            });
            for (var x = 6; x >= 0; x--) {
                lines.push({
                    x: middleSegmentDimensions.x,
                    y: Math.floor(middleSegmentDimensions.inventory.y + grid.cellHeight * x),
                    width: middleSegmentDimensions.width,
                    height: 1
                });
            };
        };
        return lines;
    }
    var gridLines = setupGrid();

    function drawGrid(ctx) {
        ctx.fillStyle = "rgb(70,70,70)";
        _.forEach(gridLines, function (line) {
            draw(ctx, line);
        });
    }

    function drawItems(ctx) {
        var topRightCurrentCell = {
            x: middleSegmentDimensions.x,
            y: middleSegmentDimensions.inventory.y
        };
        _.forEach(inventory.allItems, function (item) {
            var image = _.find(images, {
                name: item.name
            }).image;
            ctx.drawImage(image, topRightCurrentCell.x + grid.margin, topRightCurrentCell.y + grid.margin, grid.cellWidth - grid.margin - grid.margin, grid.cellHeight - grid.margin - grid.margin);
            ctx.font = middleSegmentDimensions.items.fontSize + "px sans-serif";
            ctx.fillText('x' + item.quantity, topRightCurrentCell.x + Math.floor(grid.cellWidth / 2), topRightCurrentCell.y + Math.floor(grid.cellHeight / 4 * 3))
            topRightCurrentCell.x += grid.cellWidth;
            if (topRightCurrentCell.x >= grid.cellWidth * 4 + middleSegmentDimensions.x) {
                topRightCurrentCell.x = 0;
                topRightCurrentCell.y += grid.cellHeight;
            }
        });
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
            ctx.fillStyle = "rgb(40,40,40)";
            draw(ctx, {
                x: middleSegmentDimensions.x,
                y: middleSegmentDimensions.inventory.y,
                width: middleSegmentDimensions.width,
                height: middleSegmentDimensions.height
            });
            drawGrid(ctx);
            ctx.fillStyle = "rgb(255,255,255)";
            draw(ctx, {
                x: middleSegmentDimensions.x,
                y: middleSegmentDimensions.inventory.y - 5,
                width: middleSegmentDimensions.width,
                height: 5
            });
            ctx.font = middleSegmentDimensions.fontSize + "px sans-serif";
            ctx.fillText("Inventory", middleSegmentDimensions.title.x, middleSegmentDimensions.title.y);
            drawItems(ctx)
        }
    }
}