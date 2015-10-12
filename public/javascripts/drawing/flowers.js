(function (exports) {
    function drawFlower(context, options) {
        context.save();
        var radius = options.radius;
        var flowerColor = options.color;
        context.translate(options.position.x, options.position.y);
        context.beginPath();

        context.arc(0, 0 + radius, radius, 0, 2 * Math.PI, false);
        context.fillStyle = flowerColor;
        context.fill();

        context.beginPath();

        context.arc(0, 0 - radius, radius, 0, 2 * Math.PI, false);
        context.fillStyle = flowerColor;
        context.fill();

        context.beginPath();

        context.arc(0 + radius, 0, radius, 0, 2 * Math.PI, false);
        context.fillStyle = flowerColor;
        context.fill();

        context.beginPath();

        context.arc(0 - radius, 0, radius, 0, 2 * Math.PI, false);
        context.fillStyle = flowerColor;
        context.fill();

        context.beginPath();
        context.arc(0, 0, radius / 1.8, 0, 2 * Math.PI, false);
        context.fillStyle = 'white';
        context.fill();
        context.restore();
    }
    exports.drawFlower = drawFlower;
})(this);
