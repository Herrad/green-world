function createInventory(items) {
    var items = items || [];
    return {
        add: function (item) {
            console.log('in add')
            var existing = _.find(items, {
                name: item.name
            })
            if (existing) {
                existing.quantity += item.quantity;
            } else {
                items.push(item)
            }

            console.log('end add')
        },
        remove: function (item) {},
        hasEnough: function (itemName, amount) {},
        allItems: items,
        serialise: function () {
            return items;
        }
    }
}