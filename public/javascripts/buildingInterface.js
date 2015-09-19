function createBuildingInterface(buildingList) {
    var selectedBuilding = "chapel"

    function drawBuildings(ctx, building, screenCoordinates) {
        var image = buildingList.findImage(building.name);
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
            var blueprint = buildingList.findBlueprint(selectedBuilding);
            ctx.drawImage(blueprint, selectedBlip.x - screenCoordinates.x, selectedBlip.y - screenCoordinates.y);
        },
        buildFrom: function (spec, coordinates) {
            var image = buildingList.findImage(spec.name)
            return {
                name: spec.name,
                image: image,
                dimensions: spec.dimensions,
                coordinates: coordinates,
                serialise: function () {
                    return {
                        name: this.name,
                        dimensions: this.dimensions,
                        coordinates: this.coordinates,
                        hash: '[x:' + coordinates.x + ', y:' + coordinates.y + ']'
                    }
                }
            }
        }
    }
}