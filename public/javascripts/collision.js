function createCollisionDetection() {
    return {
        detect: function (players, coordinates, collisionee) {
            var playerBox = {
                x1: coordinates.x,
                x2: coordinates.x + 64,
                y1: coordinates.y,
                y2: coordinates.y + 64
            }
            for (var i = players.length - 1; i >= 0; i--) {
                var player = players[i];
                if (player.id === collisionee.id) {
                    continue;
                }
                var otherBox = {
                    x1: player.coordinates.x,
                    x2: player.coordinates.x + 64,
                    y1: player.coordinates.y,
                    y2: player.coordinates.y + 64
                }
                var rightSideBiggerThanLeft = playerBox.x2 > otherBox.x1;
                var leftSideSmallerThanRight = playerBox.x1 < otherBox.x2;
                var topSideHigherThanBottom = playerBox.y1 < otherBox.y2;
                var bottomSideLowerThanTop = playerBox.y2 > otherBox.y1;

                if (rightSideBiggerThanLeft && leftSideSmallerThanRight && topSideHigherThanBottom && bottomSideLowerThanTop) {
                    return true;
                }
            };
            return false;
        },
        pointingAt: function (pointCoordinates, rectangle) {
            return pointCoordinates.x > rectangle.x && pointCoordinates.x < rectangle.width &&
                pointCoordinates.y > rectangle.y && pointCoordinates.y < rectangle.height;
        }
    }
}