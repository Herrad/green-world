var expect = chai.expect;

describe('test collision detection', function () {
    describe('point within rectangle', function () {
        it('should return true when a given point is in a rectangle', function () {
            var collisionDetection = createCollisionDetection();
            var result = collisionDetection.pointingAt({
                x: 5,
                y: 5
            }, {
                x: 0,
                y: 0,
                width: 10,
                height: 10
            });
            expect(result).to.equal(true);
        });

        it('should return false when a given point is outside the bounds of a rectangle', function () {
            var collisionDetection = createCollisionDetection();
            var result = collisionDetection.pointingAt({
                x: 15,
                y: 15
            }, {
                x: 0,
                y: 0,
                width: 10,
                height: 10
            });
            expect(result).to.equal(false);
        });
    });
    describe('rectangles intersecting', function () {
        it('should return true when two rectangles overlap', function () {
            var collisionDetection = createCollisionDetection();
            var result = collisionDetection.rectanglesOverlap({
                x1: 5,
                y1: 5,
                x2: 10,
                y2: 10
            }, {
                x1: 7,
                y1: 7,
                x2: 17,
                y2: 17
            });
            expect(result).to.equal(true);
        });
        it('should return false when two rectangles do not overlap', function () {
            var collisionDetection = createCollisionDetection();
            var result = collisionDetection.rectanglesOverlap({
                x1: 5,
                y1: 5,
                x2: 10,
                y2: 10
            }, {
                x1: 17,
                y1: 17,
                x2: 27,
                y2: 27
            });
            expect(result).to.equal(false);
        });
    });
});