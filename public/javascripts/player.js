function createPlayer(outgoingEvents, id, coordinates, facing) {
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

    var coordinatesToUse = coordinates || {
        x: 1920 / 2 - 32,
        y: 1080 / 2 - 32
    }

    var idToUse = id || generateGuid();

    var player = {
        id: idToUse,
        coordinates: coordinatesToUse,
        facing: imageToDraw.src,
        imageToDraw: imageToDraw,
        faceLeft: function () {
            this.imageToDraw = left
            this.facing = this.imageToDraw.src
        },
        faceUp: function () {
            this.imageToDraw = up
            this.facing = this.imageToDraw.src
        },
        faceRight: function () {
            this.imageToDraw = right
            this.facing = this.imageToDraw.src
        },
        faceDown: function () {
            this.imageToDraw = down
            this.facing = this.imageToDraw.src
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