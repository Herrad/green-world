function createBuildingFactory(buildingSpecs) {

    return {
        deserialise: function (building) {
            var spec = buildingSpecs.getBuilding(building.name)
            return {
                name: building.name,
                dimensions: building.dimensions,
                coordinates: building.coordinates,
                hash: '[x:' + building.coordinates.x + ', y:' + building.coordinates.y + ']',
                image: buildingSpecs.findImage(building.name),
                impassables: spec.impassables,
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