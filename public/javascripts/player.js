function createPlayer(outgoingEvents, id, coordinates) {
    var up = new Image;
    up.src = "/images/player/up.png"
    var down = new Image;
    down.src = "/images/player/down.png"
    var left = new Image;
    left.src = "/images/player/left.png"
    var right = new Image;
    right.src = "/images/player/right.png"
    imageToDraw = down;

    function generateGuid() {
        var result, i, j;
        result = '';
        for (j = 0; j < 32; j++) {
            if (j == 8 || j == 12 || j == 16 || j == 20)
                result = result + '-';
            i = Math.floor(Math.random() * 16).toString(16).toUpperCase();
            result = result + i;
        }
        return result
    }

    var coordinatesToUse = coordinates || {
        x: 480,
        y: 328
    }

    var idToUse = id || generateGuid();

    var player = {
        id: idToUse,
        coordinates: coordinatesToUse,
        draw: function (ctx, worldCoordinates) {
            ctx.drawImage(imageToDraw, this.coordinates.x - worldCoordinates.x, this.coordinates.y - worldCoordinates.y);
        },
        faceLeft: function () {
            imageToDraw = left
        },
        faceUp: function () {
            imageToDraw = up
        },
        faceRight: function () {
            imageToDraw = right
        },
        faceDown: function () {
            imageToDraw = down
        },
        coordinateChange: function (worldCoordinates) {
            this.coordinates = {
                x: worldCoordinates.x + 480,
                y: worldCoordinates.y + 328
            };
        }
    };

    return player;
}