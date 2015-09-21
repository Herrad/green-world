function createBuildingSpecs() {

    var chapel = new Image;
    chapel.src = '/images/buildings/chapel.png';

    var chapelBluerint = new Image;
    chapelBluerint.src = '/images/buildings/blueprints/chapel.png';

    var images = [{
        name: 'chapel',
        image: chapel,
        blueprint: chapelBluerint
    }]

    var chapelSpec = {
        name: 'chapel',
        dimensions: {
            width: 10 * 64,
            height: 15 * 64
        },
        buildBorder: {
            x1: 64,
            x2: 64,
            y1: 64,
            y2: 64
        }
    };
    chapelSpec.impassables = [{
        x1: 0,
        y1: 0,
        x2: chapelSpec.dimensions.width,
        y2: 64
    }, {
        x1: 0,
        y1: 0,
        x2: 64,
        y2: chapelSpec.dimensions.height
    }, {
        x1: 9 * 64,
        y1: 0,
        x2: chapelSpec.dimensions.width,
        y2: chapelSpec.dimensions.height
    }, {
        x1: 0,
        y1: 14 * 64,
        x2: Math.floor(chapelSpec.dimensions.width / 2) - 64,
        y2: chapelSpec.dimensions.height
    }, {
        x1: Math.floor(chapelSpec.dimensions.width / 2) + 64,
        y1: 14 * 64,
        x2: chapelSpec.dimensions.width,
        y2: chapelSpec.dimensions.height
    }]

    var buildingSpecs = [chapelSpec];

    return {
        getBuilding: function (buildingName) {
            return _.find(buildingSpecs, {
                name: buildingName
            });
        },
        findImages: function (name) {
            return _.find(images, {
                name: name
            });
        }
    }
}