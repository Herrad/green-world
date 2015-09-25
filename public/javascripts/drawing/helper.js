function draw(ctx, rectangle) {
    if (!rectangle || rectangle.x === undefined || rectangle.y === undefined || rectangle.width === undefined || rectangle.height === undefined) {
        return;
    }
    ctx.fillRect(rectangle.x, rectangle.y, rectangle.width, rectangle.height);
}