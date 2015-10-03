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

            it('should only modify the stack with the same name', function () {

                var inventory = createInventory([{
                    name: 'Joe',
                    quantity: 5
                }, {
                    name: 'asd',
                    quantity: 5
                }]);

                inventory.add({
                    name: 'Joe',
                    quantity: 10
                });

                expect(inventory.getItems()).to.deep.equal([{
                    name: 'Joe',
                    quantity: 15
                }, {
                    name: 'asd',
                    quantity: 5
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

            it('should not modify argument', function () {
                var inventory = createInventory([{
                    name: 'Joe',
                    quantity: 64
                }, {
                    name: 'Joe',
                    quantity: 10
                }]);

                var passedIn = {
                    name: 'Joe',
                    quantity: 5
                }

                inventory.remove(passedIn);

                expect(passedIn).to.deep.equal({
                    name: 'Joe',
                    quantity: 5
                });
            });

            it('should only modify stacks of same name', function () {
                var inventory = createInventory([{
                    name: 'Joe',
                    quantity: 64
                }, {
                    name: 'Joe',
                    quantity: 10
                }, {
                    name: 'ssdsdasd',
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
                }, {
                    name: 'ssdsdasd',
                    quantity: 10
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
            it('should not remove duplicate stacks', function () {
                var inventory = createInventory([{
                    name: 'Joe',
                    quantity: 64
                }, {
                    name: 'Joe',
                    quantity: 10
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
                }, {
                    name: 'Joe',
                    quantity: 10
                }]);
            });
            it('should reduce quantity of other stack if quantity removed is greater than initial stack', function () {
                var inventory = createInventory([{
                    name: 'Joe',
                    quantity: 64
                }, {
                    name: 'Joe',
                    quantity: 10
                }]);

                inventory.remove({
                    name: 'Joe',
                    quantity: 14
                });

                expect(inventory.getItems()).to.deep.equal([{
                    name: 'Joe',
                    quantity: 60
                }]);
            });
        });

        describe('removing item spanning multiple stacks', function () {
            it('should not change the items if trying to remove more than is present', function () {
                var inventory = createInventory([{
                    name: 'Joe',
                    quantity: 64
                }]);

                inventory.remove({
                    name: 'Joe',
                    quantity: 80
                });

                expect(inventory.getItems()).to.deep.equal([{
                    name: 'Joe',
                    quantity: 64
                }]);
            });
        });

    });
    describe('checking whether inventory has enough items', function () {
        it('should return true when requested amount is less than total', function () {
            var inventory = createInventory([{
                name: 'Joe',
                quantity: 64
            }]);

            var result = inventory.hasEnough({
                name: 'Joe',
                quantity: 63
            });

            expect(result).to.equal(true);
        });
        it('should return false when requested amount is more than total', function () {
            var inventory = createInventory([{
                name: 'Joe',
                quantity: 64
            }, {
                name: 'Joe',
                quantity: 64
            }, {
                name: 'Joe',
                quantity: 64
            }, {
                name: 'Joe',
                quantity: 64
            }]);

            var result = inventory.hasEnough({
                name: 'Joe',
                quantity: 512
            });

            expect(result).to.equal(false);
        });
        it('should return false when requested amount is more than total but total number of items is higher than requested amount', function () {
            var inventory = createInventory([{
                name: 'Joe',
                quantity: 64
            }, {
                name: 'Joe',
                quantity: 64
            }, {
                name: 'Joe',
                quantity: 64
            }, {
                name: 'Joes',
                quantity: 64
            }]);

            var result = inventory.hasEnough({
                name: 'Joe',
                quantity: 256
            });

            expect(result).to.equal(false);
        });
    });
});