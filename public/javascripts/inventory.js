function createInventory(items) {
    var items = items;
    return {
        add: function (item) {
            var existing = _.find(items, {
                name: item.name
            });
            if (existing) {
                existing.quantity += item.quantity;
            } else {
                items.push(item);
            }
        },
        remove: function (item) {
            add({
                name: item.name,
                quantity: 0 - item.quantity
            });
        },
        allItems: items,
        serialise: function () {
            return items;
        }
    }
}