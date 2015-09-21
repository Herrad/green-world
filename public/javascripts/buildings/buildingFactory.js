function createBuildingFactory(buildingSpecs) {

    return {
        deserialise: function (building) {
            var spec = buildingSpecs.getBuilding(building.name)
            var border = {
                x1: building.coordinates.x - spec.buildBorder.x1,
                x2: building.coordinates.x + spec.dimensions.width + spec.buildBorder.x2,
                y1: building.coordinates.y - spec.buildBorder.y1,
                y2: building.coordinates.y + spec.dimensions.height + spec.buildBorder.y2
            }
            return {
                name: building.name,
                dimensions: building.dimensions,
                coordinates: building.coordinates,
                hash: '[x:' + building.coordinates.x + ', y:' + building.coordinates.y + ']',
                image: buildingSpecs.findImages(building.name).image,
                impassables: spec.impassables,
                border: border,
                serialise: function () {
                    return {
                        name: this.name,
                        dimensions: this.dimensions,
                        coordinates: this.coordinates,
                        hash: '[x:' + coordinates.x + ', y:' + coordinates.y + ']'
                    }
                }
            }
        },
        createBuilding: function (coordinates, spec) {
            return {
                name: spec.name,
                dimensions: spec.dimensions,
                coordinates: coordinates,
                hash: '[x:' + coordinates.x + ', y:' + coordinates.y + ']'
            }
        }
    }
}