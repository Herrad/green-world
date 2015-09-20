function createBuilding(coordinates, spec) {
    return {
        name: spec.name,
        image: spec.image,
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