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

    var grid = {
        cellWidth: Math.floor(rightPanelDimensions.middlePanel.width / 6),
        cellHeight: Math.floor(rightPanelDimensions.middlePanel.height / 8),
        margin: 10
    }

    function setupGrid() {
        var lines = [];
        for (var y = 5; y >= 1; y--) {
            lines.push({
                x: Math.floor(rightPanelDimensions.middlePanel.x + grid.cellWidth * y),
                y: rightPanelDimensions.middlePanel.inventory.y,
                width: 1,
                height: rightPanelDimensions.middlePanel.height
            });
            for (var x = 7; x >= 1; x--) {
                lines.push({
                    x: rightPanelDimensions.middlePanel.x,
                    y: Math.floor(rightPanelDimensions.middlePanel.inventory.y + grid.cellHeight * x),
                    width: rightPanelDimensions.middlePanel.width,
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
            x: rightPanelDimensions.middlePanel.x,
            y: rightPanelDimensions.middlePanel.inventory.y
        };
        _.forEach(inventory.allItems, function (item) {
            var image = _.find(images, {
                name: item.name
            }).image;
            ctx.drawImage(image, topRightCurrentCell.x + grid.margin, topRightCurrentCell.y + grid.margin, grid.cellWidth - grid.margin - grid.margin, grid.cellHeight - grid.margin - grid.margin);
            ctx.font = rightPanelDimensions.middlePanel.items.fontSize + "px sans-serif";
            ctx.fillText('x' + item.quantity, topRightCurrentCell.x + Math.floor(grid.cellWidth / 3), topRightCurrentCell.y + Math.floor(grid.cellHeight / 4 * 3))
            topRightCurrentCell.x += grid.cellWidth;
            if (topRightCurrentCell.x >= grid.cellWidth * 4 + rightPanelDimensions.middlePanel.x) {
                topRightCurrentCell.x = 0;
                topRightCurrentCell.y += grid.cellHeight;
            }
        });
    }

    return {
        draw: function (ctx) {
            ctx.fillStyle = "rgb(255,255,255)";
            draw(ctx, {
                x: rightPanelDimensions.middlePanel.x,
                y: rightPanelDimensions.middlePanel.y,
                width: rightPanelDimensions.middlePanel.width,
                height: 10
            });
            ctx.fillStyle = "rgb(40,40,40)";
            draw(ctx, {
                x: rightPanelDimensions.middlePanel.x,
                y: rightPanelDimensions.middlePanel.inventory.y,
                width: rightPanelDimensions.middlePanel.width,
                height: rightPanelDimensions.middlePanel.height
            });
            drawGrid(ctx);
            ctx.fillStyle = "rgb(255,255,255)";
            draw(ctx, {
                x: rightPanelDimensions.middlePanel.x,
                y: rightPanelDimensions.middlePanel.inventory.y - 5,
                width: rightPanelDimensions.middlePanel.width,
                height: 5
            });
            ctx.font = rightPanelDimensions.middlePanel.fontSize + "px sans-serif";
            ctx.fillText("Inventory", rightPanelDimensions.middlePanel.title.x, rightPanelDimensions.middlePanel.title.y);
            drawItems(ctx)
        }
    }
}