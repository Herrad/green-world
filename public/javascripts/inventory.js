function createInventory(items) {
    var items = items || [];

    function addItemToStack(item) {
        var existing = _.find(items, {
            name: item.name
        })
        if (existing) {
            if (existing.quantity + item.quantity > 64) {
                var newItem = {
                    name: item.name,
                    quantity: existing.quantity + item.quantity - 64
                };
                items.push(newItem);
                existing.quantity = 64;
            } else {
                existing.quantity += item.quantity;
            }
        } else {
            items.push(item)
        }
    }

    function splitIncomingItemsIntoStacks(incoming) {
        var incomingItems = []
        while (incoming.quantity > 64) {
            incomingItems.push({
                name: incoming.name,
                quantity: 64
            });
            incoming.quantity -= 64
        }
        incomingItems.push(incoming);
        return incomingItems;
    }
    return {
        add: function (incoming) {
            var incomingItems = splitIncomingItemsIntoStacks(incoming);
            _.forEach(incomingItems, addItemToStack);
            items = _.sortByOrder(items, ['name', 'quantity'], ['asc', 'desc']);

        },
        remove: function (item) {},
        hasEnough: function (itemName, amount) {},
        getItems: function () {
            items = _.sortByOrder(items, ['name', 'quantity'], ['asc', 'desc']);
            return items
        },
        serialise: function () {
            return items;
        }
    }
}