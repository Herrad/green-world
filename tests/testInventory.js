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

                expect(inventory.getItems()).to.deep.equal([{
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

                expect(inventory.getItems()).to.deep.equal([{
                    name: 'Joe',
                    quantity: 15
                }]);
            });

            it('should create a new stack with quantity of difference when total would be more than 64', function () {

                var inventory = createInventory([{
                    name: 'Joe',
                    quantity: 63
                }]);

                inventory.add({
                    name: 'Joe',
                    quantity: 2
                });

                expect(inventory.getItems()).to.deep.equal([{
                    name: 'Joe',
                    quantity: 64
                }, {
                    name: 'Joe',
                    quantity: 1
                }]);
            });

            it('should create several new stacks with quantity of 64 each when new item is more than 64', function () {
                var inventory = createInventory([{
                    name: 'Joe',
                    quantity: 1
                }]);

                inventory.add({
                    name: 'Joe',
                    quantity: 128
                });

                expect(inventory.getItems()).to.deep.equal([{
                    name: 'Joe',
                    quantity: 64
                }, {
                    name: 'Joe',
                    quantity: 64
                }, {
                    name: 'Joe',
                    quantity: 1
                }]);
            });
        });

        describe('removing items', function () {
            describe('removing item from stack', function () {

                it('should reduce quantity from stack', function () {
                    var inventory = createInventory([{
                        name: 'Joe',
                        quantity: 10
                    }]);

                    inventory.remove({
                        name: 'Joe',
                        quantity: 5
                    });

                    expect(inventory.getItems()).to.deep.equal([{
                        name: 'Joe',
                        quantity: 5
                    }]);
                });

                it('should reduce quantity from smallest stack', function () {
                    var inventory = createInventory([{
                        name: 'Joe',
                        quantity: 64
                    }, {
                        name: 'Joe',
                        quantity: 10
                    }]);

                    inventory.remove({
                        name: 'Joe',
                        quantity: 5
                    });

                    expect(inventory.getItems()).to.deep.equal([{
                        name: 'Joe',
                        quantity: 64
                    }, {
                        name: 'Joe',
                        quantity: 5
                    }]);
                });
            });

            describe('removing item spanning multiple stacks', function () {

                it('should remove stacks of zero quantity', function () {
                    var inventory = createInventory([{
                        name: 'Joe',
                        quantity: 64
                    }, {
                        name: 'Joe',
                        quantity: 10
                    }]);

                    inventory.remove({
                        name: 'Joe',
                        quantity: 10
                    });

                    expect(inventory.getItems()).to.deep.equal([{
                        name: 'Joe',
                        quantity: 64
                    }]);
                });
            })
        });

    });
});