var _ = require('lodash')

module.exports = function createBuildingList() {
    var buildings = [];
    return {
        buildings: buildings,
        writeBuilding: function (newBuilding) {
            _.remove(buildings, {
                hash: newBuilding.hash
            });
            buildings.push(newBuilding)
        },
        needsUpdate: function (box, hash) {
            var buildings = this.getBuildingsIn(box)
            var myHash = ''
            _.chain(buildings)
                .sortByAll(['coordinates.x', 'coordinates.y'])
                .forEach(function (building) {
                    myHash += building.hash;
}).value();        if (myHash !== hash) {

            console.log(myHash)
            console.log(hash)
        }
            return myHash !== hash;
        },
        getBuildingsIn: function (box) {
            return _.filter(buildings, function (building) {
                return box.minX < building.coordinates.x &&
                    box.minY < building.coordinates.y &&
                    box.maxX > building.coordinates.x &&
                    box.maxY > building.coordinates.y;
            })
        }
    }
}