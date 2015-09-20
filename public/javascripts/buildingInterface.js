function createBuildingInterface(buildingSpecs, collision) {
    var selectedBuilding = "chapel"

    function drawBuildings(ctx, building, screenCoordinates) {
        var image = buildingSpecs.findImage(building.name);
        ctx.drawImage(image, building.coordinates.x - screenCoordinates.x, building.coordinates.y - screenCoordinates.y);
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
        buildFrom: function (buildingName, coordinates, existingBuildings) {
            var spec = buildingSpecs.getBuilding(buildingName);
            var collisionDetected = false;
            _.forEach(existingBuildings, function (existingBuilding) {
                if (collisionDetected) {
                    return;
                }
                var rectangle1 = {
                    x1: coordinates.x,
                    x2: coordinates.x + spec.dimensions.width,
                    y1: coordinates.y,
                    y2: coordinates.y + spec.dimensions.height
                };
                var rectangle2 = {
                    x1: existingBuilding.coordinates.x,
                    x2: existingBuilding.coordinates.x + existingBuilding.dimensions.width,
                    y1: existingBuilding.coordinates.y,
                    y2: existingBuilding.coordinates.y + existingBuilding.dimensions.height
                }
                if (collision.rectanglesOverlap(rectangle1, rectangle2)) {
                    collisionDetected = true;
                }
            });

            if (collisionDetected) {
                return undefined;
            }
            return createBuilding(coordinates, spec);
        }
    }
}