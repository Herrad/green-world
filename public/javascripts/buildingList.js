function createBuildingList() {

    var chapel = new Image;
    chapel.src = '/images/buildings/chapel.png';

    var chapelBluerint = new Image;
    chapelBluerint.src = '/images/buildings/blueprints/chapel.png';

    var images = [{
        name: 'chapel',
        image: chapel
    }]

    var blueprints = [{
        name: 'chapel',
        image: chapelBluerint
    }]

    var buildingSpecs = [{
        name: 'chapel',
        dimensions: {
            width: 10,
            height: 15
        }
    }];

    return {
        getBuilding: function (buildingName) {
            var building = _.find(buildingSpecs, {
                name: buildingName
            });

            return building;
        },
        buildFrom: function (spec, location, chunkCoordinates) {
            var image = _.find(images, {
                name: spec.name
            });
            return {
                name: spec.name,
                image: image,
                dimensions: spec.dimensions,
                location: location,
                serialise: function () {
                    return {
                        name: this.name,
                        dimensions: this.dimensions,
                        location: this.location,
                        drawAt: {
                            x: this.location.x + chunkCoordinates.x,
                            y: this.location.y + chunkCoordinates.y
                        }
                    }
                }
            }
        },
        findImage: function (name) {
            return _.find(images, {
                name: name
            }).image;
        },
        findBlueprint: function (name) {
            return _.find(blueprints, {
                name: name
            }).image;
        }
    }
}