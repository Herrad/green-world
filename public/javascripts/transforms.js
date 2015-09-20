function translateBy(rectangle, point) {
    return {
        x1: rectangle.x1 + point.x,
        y1: rectangle.y1 + point.y,
        x2: rectangle.x2 + point.x,
        y2: rectangle.y2 + point.y
    }
}