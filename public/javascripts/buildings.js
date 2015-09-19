function createBuildings() {

    var chapel = new Image;
    chapel.src = '/images/buildings/chapel.png';

    var buildings = [{
        name: 'chapel',
        imageSrc: '/images/buildings/chapel.png',
        image: chapel,
        hasBlueprint: false,
        dimensions: {
            width: 10,
            height: 15
        }
    }];

    return {
        getBuilding: function (buildingName) {
            var building = _.find(buildings, {
                name: buildingName
            });

            return building;
        },
    }
}