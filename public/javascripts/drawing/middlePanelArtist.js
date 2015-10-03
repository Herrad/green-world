function createMiddlePanelArtist(inventoryArtist, controls) {
    return {
        draw: function (ctx) {
            if (!controls.buildingMode)
                inventoryArtist.draw(ctx)
        }
    }
}