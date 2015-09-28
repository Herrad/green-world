var expect = chai.expect;

describe('test building placement', function () {
    describe('interfering with other objects', function () {
        var specToReturn = {
            buildBorder: {},
            dimensions: {
                width: 10,
                height: 10
            }
        }
        var buildingSpecs = {
            getBuilding: function () {
                return specToReturn;
            }
        };
        var expectedBuilding = {
            identifier: 'hello'
        }
        var buildingFactory = {
            createBuilding: function () {
                return expectedBuilding;
            }
        }
        it('should be possible to place a building when clear of all obsticles', function () {
            var cache = createCache();

            var buildingInterface = createBuildingInterface(buildingSpecs, createCollisionDetection(), buildingFactory, {}, cache, {
                warning: function () {}
            });

            var result = buildingInterface.buildFrom('house', {
                x: 0,
                y: 0
            }, {});

            expect(expectedBuilding.identifier).to.equal(result.identifier)
        });
        it('should not be possible to place a building when another building is in the way', function () {
            var cache = createCache();
            var buildingInterface = createBuildingInterface(buildingSpecs, createCollisionDetection(), buildingFactory, {}, cache, {
                warning: function () {}
            });
            var otherBuildings = [{
                border: {
                    x1: 5,
                    y1: 5,
                    x2: 15,
                    y2: 15
                }
            }];
            cache.incoming(otherBuildings);

            var result = buildingInterface.buildFrom('house', {
                x: 0,
                y: 0
            }, {});

            expect(result).to.equal(undefined)
        });
        it('should not be possible to place a building when a player is in the way', function () {
            var cache = createCache();

            var buildingInterface = createBuildingInterface(buildingSpecs, createCollisionDetection(), buildingFactory, {}, cache, {
                warning: function () {}
            });
            var otherBuildings = [];

            var players = [{
                coordinates: {
                    x: 5,
                    y: 5
                },
                dimensions: {
                    width: 1,
                    height: 1
                }
            }]

            var result = buildingInterface.buildFrom('house', {
                x: 0,
                y: 0
            }, players);

            expect(result).to.equal(undefined)
        });
    });
});