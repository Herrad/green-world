function createEventLogLayer(screenDimensions, events) {
    var events = events || [];

    var drawDimensions = {
        x: 0,
        y: Math.floor(screenDimensions.height - screenDimensions.height / 3),
        width: screenDimensions.gameWindowWidth,
        height: Math.floor(screenDimensions.height / 3),
        textX: Math.floor(screenDimensions.gameWindowWidth / 2),
        fontSize: Math.floor(screenDimensions.height / 24.5)
    };

    function addEvent(text, milliseconds, fillStyle) {

        var now = new Date()
        var event = {
            message: text,
            created: now,
            fillStyle: fillStyle
        }
        events.push(event)
        _.sortBy(events, 'created');
        if (events.length > 6) {
            events.pop();
        }
        setTimeout(function () {
            _.remove(events, {
                created: now
            });
        }, milliseconds);
    }

    return {
        draw: function (ctx) {
            if (!events.length) return;
            ctx.font = drawDimensions.fontSize + "px sans-serif";
            ctx.fillStyle = "rgba(0,0,0,0.5)";
            draw(ctx, drawDimensions);
            _.forEach(events, function (event, i) {
                i = i + 1
                ctx.fillStyle = event.fillStyle;
                ctx.fillText(event.message, drawDimensions.textX - Math.floor((event.message.length / 2) * drawDimensions.fontSize / 2), drawDimensions.y + screenDimensions.height * i / 20)
            });
        },
        info: function (text, milliseconds) {
            addEvent(text, milliseconds, "rgb(255,255,255)")
        },
        warning: function (text, milliseconds) {
            addEvent(text, milliseconds, "rgb(255,120,0)")
        },
        error: function (text, milliseconds) {
            addEvent(text, milliseconds, "rgb(255,0,0)")
        }
    }
}