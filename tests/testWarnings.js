var expect = chai.expect;

describe('test warnings', function () {
    describe('adding a warning', function () {

        describe('with a long time to live', function () {
            it('should be rendered', function (done) {
                var warnings = createWarningLayer({});

                warnings.add("Joe message", 100);

                warnings.draw({
                    fillText: function (text) {
                        expect(text).to.equal("Joe message");
                        done();
                    }
                })
            });
        });
    });
});