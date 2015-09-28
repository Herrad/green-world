function createWarningLayer(screenDimensions, warnings) {
    var warnings = warnings || [];

    var drawDimensions = {
        x: 0,
        y: Math.floor(screenDimensions.height - screenDimensions.height / 3),
        width: screenDimensions.gameWindowWidth,
        height: Math.floor(screenDimensions.height / 3),
        textX: Math.floor(screenDimensions.gameWindowWidth / 2),
        fontSize: Math.floor(screenDimensions.height / 24.5)
    };

    function trimWarnings() {}

    return {
        draw: function (ctx) {
            trimWarnings();
            if (!warnings.length) return;
            ctx.font = drawDimensions.fontSize + "px sans-serif";
            ctx.fillStyle = "rgba(0,0,0,0.5)";
            draw(ctx, drawDimensions);
            _.forEach(warnings, function (warning, i) {
                i = i + 1
                ctx.fillStyle = "rgb(255,255,255)";
                ctx.fillText(warning.message, drawDimensions.textX - Math.floor(warning.message.length * drawDimensions.fontSize / 2), drawDimensions.y + screenDimensions.height * i / 20)
            });
        },
        add: function (text, milliseconds) {
            var now = new Date()
            var warning = {
                message: text,
                created: now
            }
            warnings.push(warning)
            setTimeout(function () {
                _.remove(warnings, {
                    created: now
                });
            }, milliseconds);
        }
    }
}