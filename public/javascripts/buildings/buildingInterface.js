function createBuildingInterface(buildingSpecs, collision, buildingFactory, player) {
    var selectedBuilding = "chapel"

    function drawBuildings(ctx, building, screenCoordinates) {
        var image = building.image;
        ctx.drawImage(image, building.coordinates.x - screenCoordinates.x, building.coordinates.y - screenCoordinates.y);
    }

    function collidesWithAnyRectangles(rectangle1, rectangles) {
        var collisionDetected = false;
        _.forEach(rectangles, function (rectangle) {
            if (collisionDetected) {
                return;
            };
            var rectangle2 = rectangle;
            if (!rectangle.x1 && !rectangle.x2 && !rectangle.y1 && !rectangle.y2) {
                rectangle2 = {
                    x1: rectangle.coordinates.x,
                    x2: rectangle.coordinates.x + rectangle.dimensions.width,
                    y1: rectangle.coordinates.y,
                    y2: rectangle.coordinates.y + rectangle.dimensions.height
                }
            }
            collisionDetected = collision.rectanglesOverlap(rectangle1, rectangle2)
        });
        return collisionDetected;
    }

    return {
        drawBuildings: function (ctx, buildings, screenCoordinates, player) {
            _.forEach(buildings, function (building) {
                drawBuildings(ctx, building, screenCoordinates, player);
            });
        },
        drawBlueprint: function (ctx, building, selectedBlip, screenCoordinates) {
            var selectedBuilding = building;
            var blueprint = buildingSpecs.findImages(selectedBuilding).blueprint;
            ctx.drawImage(blueprint, selectedBlip.x - screenCoordinates.x, selectedBlip.y - screenCoordinates.y);
        },
        buildFrom: function (buildingName, coordinates, existingBuildings, players) {
            var spec = buildingSpecs.getBuilding(buildingName);
            var collisionDetected = false;
            var rectangle1 = {
                x1: coordinates.x - spec.buildBorder.x1,
                x2: coordinates.x + spec.dimensions.width + spec.buildBorder.x2,
                y1: coordinates.y - spec.buildBorder.y1,
                y2: coordinates.y + spec.dimensions.height + spec.buildBorder.y2
            }
            if (collidesWithAnyRectangles(rectangle1, players)) {
                return;
            } else if (collidesWithAnyRectangles(rectangle1, _.pluck(existingBuildings, 'border'))) {
                return
            }
            return buildingFactory.createBuilding(coordinates, spec);
        }
    }
}