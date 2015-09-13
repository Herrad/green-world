function createPlayer(outgoingEvents, id, coordinates, facing, defaultCoordinates) {
    var imageToDraw;
    if (facing) {
        imageToDraw = new Image
        imageToDraw.src = facing
    } else {
        var up = new Image;
        up.src = "/images/player/up.png"
        var down = new Image;
        down.src = "/images/player/down.png"
        var left = new Image;
        left.src = "/images/player/left.png"
        var right = new Image;
        right.src = "/images/player/right.png"
        imageToDraw = down;
    }

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

    var coordinatesToUse = coordinates || defaultCoordinates || {
        x: 1920 / 2 - 32,
        y: 1080 / 2 - 32
    }

    var idToUse = id || generateGuid();

    var player = {
        id: idToUse,
        coordinates: coordinatesToUse,
        facing: imageToDraw.src,
        draw: function (ctx, screenCoordinates) {
            var xToDraw = this.coordinates.x - screenCoordinates.x;
            var yToDraw = this.coordinates.y - screenCoordinates.y;
            ctx.drawImage(imageToDraw, xToDraw, yToDraw);
        },
        faceLeft: function () {
            imageToDraw = left
            this.facing = imageToDraw.src
        },
        faceUp: function () {
            imageToDraw = up
            this.facing = imageToDraw.src
        },
        faceRight: function () {
            imageToDraw = right
            this.facing = imageToDraw.src
        },
        faceDown: function () {
            imageToDraw = down
            this.facing = imageToDraw.src
        },
        coordinateChange: function (newCoordinates) {
            this.coordinates = {
                x: newCoordinates.x,
                y: newCoordinates.y
            };
        },
        serialise: function () {
            return {
                id: this.id,
                coordinates: this.coordinates,
                facing: this.facing
            };
        }
    };

    return player;
}