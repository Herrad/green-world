function translateBy(rectangle, point) {
    return {
        x: rectangle.x + point.x,
        y: rectangle.y + point.y,
        width: rectangle.width + point.x,
        height: rectangle.height + point.y
    }
}