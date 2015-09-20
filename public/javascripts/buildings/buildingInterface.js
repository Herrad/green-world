function createBuildingInterface(buildingSpecs, collision, buildingFactory) {
    var selectedBuilding = "chapel"

    function drawBuildings(ctx, building, screenCoordinates) {
        ctx.drawImage(building.image, building.coordinates.x - screenCoordinates.x, building.coordinates.y - screenCoordinates.y);
    }

    function collidesWithAnyRectangles(rectangle1, rectangles) {
        var collisionDetected = false;
        _.forEach(rectangles, function (rectangle) {
            if (collisionDetected) {
                return;
            };
            var rectangle2 = {
                x1: rectangle.coordinates.x,
                x2: rectangle.coordinates.x + 64,
                y1: rectangle.coordinates.y,
                y2: rectangle.coordinates.y + 64
            }
            collisionDetected = collision.rectanglesOverlap(rectangle1, rectangle2)
        });
        return collisionDetected;
    }

    return {
        drawBuildings: function (ctx, buildings, screenCoordinates) {
            _.forEach(buildings, function (building) {
                drawBuildings(ctx, building, screenCoordinates);
            });
        },
        drawBlueprint: function (ctx, building, selectedBlip, screenCoordinates) {
            var selectedBuilding = building;
            var blueprint = buildingSpecs.findBlueprint(selectedBuilding);
            ctx.drawImage(blueprint, selectedBlip.x - screenCoordinates.x, selectedBlip.y - screenCoordinates.y);
        },
        buildFrom: function (buildingName, coordinates, existingBuildings, players) {
            var spec = buildingSpecs.getBuilding(buildingName);
            var collisionDetected = false;
            var rectangle1 = {
                x1: coordinates.x,
                x2: coordinates.x + spec.dimensions.width,
                y1: coordinates.y,
                y2: coordinates.y + spec.dimensions.height
            }
            if (collidesWithAnyRectangles(rectangle1, players)) {
                return;
            } else if (collidesWithAnyRectangles(rectangle1, existingBuildings)) {
                return
            }
            return buildingFactory.createBuilding(coordinates, spec);
        }
    }
}