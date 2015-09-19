function createBuildingInterface(buildingList) {
    var selectedBuilding = "chapel"

    function drawBuildingsIn(ctx, chunk, screenCoordinates) {
        _.forEach(chunk.buildings, function (building) {
            var image = buildingList.findImage(building.name);
            ctx.drawImage(image, building.drawAt.x - screenCoordinates.x, building.drawAt.y - screenCoordinates.y);
        })
    }

    return {
        drawBuildings: function (ctx, chunks, screenCoordinates) {
            _.forEach(chunks, function (chunk) {
                drawBuildingsIn(ctx, chunk, screenCoordinates);
            });
        },
        drawBlueprint: function (ctx, building, selectedBlip, chunkCoordinates, screenCoordinates) {
            var selectedBuilding = building;
            var blueprint = buildingList.findBlueprint(selectedBuilding);
            ctx.drawImage(blueprint, chunkCoordinates.x + selectedBlip.x - screenCoordinates.x, chunkCoordinates.y + selectedBlip.y - screenCoordinates.y);
        }
    }
}