var expect = chai.expect;

describe('test adding and removing items in the inventory', function () {
    describe('adding items', function () {

        describe('adding new item', function () {

            it('should create a new stack when no item exists', function () {

                var inventory = createInventory([]);

                inventory.add({
                    name: 'Joe',
                    quantity: 10
                });

                expect(inventory.allItems).to.deep.equal([{
                    name: 'Joe',
                    quantity: 10
                }]);
            });
        });

        describe('adding item to existing stack', function () {

            it('should increment the quantity of the existing item stack when total is equal to or less than 64', function () {

                var inventory = createInventory([{
                    name: 'Joe',
                    quantity: 5
                }]);

                inventory.add({
                    name: 'Joe',
                    quantity: 10
                });

                expect(inventory.allItems).to.deep.equal([{
                    name: 'Joe',
                    quantity: 15
                }]);
            });
        });

    });
});