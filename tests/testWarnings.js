var expect = chai.expect;

describe('test warnings', function () {
    describe('adding a warning', function () {

        describe('with a long time to live', function () {
            var warnings = createWarningLayer({});

            warnings.add("Joe message", 100000);
            it('should be rendered', function (done) {

                warnings.draw({
                    fillText: function (text) {
                        expect(text).to.equal("Joe message");
                        done();
                    }
                })
            });
        });

        describe('with a short time to live', function () {
            var warnings = createWarningLayer({});

            warnings.add("Joe message", 100);
            it('should be rendered', function (done) {

                warnings.draw({
                    fillText: function (text) {
                        expect(text).to.equal("Joe message");
                        done();
                    }
                })
            });
            it('should not be rendered after time has passed', function (done) {
                var calls = 0;
                setTimeout(function () {
                    warnings.draw({
                        fillText: function () {
                            calls++;
                        }
                    });
                    setTimeout(function () {
                        expect(calls).to.equal(0);
                        done();
                    }, 500);
                }, 500);

            });
        });
    });
});