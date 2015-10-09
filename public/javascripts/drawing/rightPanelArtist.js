function createRightPanelArtist(ctx, rightPanelDimensions, middlePanelArtist, map) {

    function drawRightPanelOutline(game) {
        var player = game.players[0];
        var debugInfo = game.debugInfo;
        ctx.fillStyle = "rgb(255,255,255)";
        draw(ctx, rightPanelDimensions.external);
        ctx.fillStyle = "rgb(0,0,0)";
        draw(ctx, rightPanelDimensions.internal);

        ctx.fillStyle = "rgb(255,255,255)";
        ctx.font = rightPanelDimensions.info.fontSize + "px sans-serif";
        ctx.fillText(player.name, rightPanelDimensions.textX, rightPanelDimensions.info.nameY);
        ctx.fillText("[x:" + player.coordinates.x + ",y:" + player.coordinates.y + "]" + ' fps: ' + debugInfo.fps, rightPanelDimensions.textX, rightPanelDimensions.info.coordinatesY);
    }

    return {
        draw: function (game, screenCoordinates) {
            drawRightPanelOutline(game);
            middlePanelArtist.draw(ctx, game.controls);

            map.draw(ctx, game.players[0].coordinates, screenCoordinates);
        }
    }
}
