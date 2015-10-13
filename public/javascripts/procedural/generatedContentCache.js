(function (exports) {
    exports.createGeneratedContentCache = function (numberOfItems, optionalDebugName) {
        var items = {};
        var lastAccessOfKeys = {};
        var accessCounter = 0;
        var cacheTrimSchedulled;

        function trimCache() {
            cacheTrimSchedulled = undefined;
            var targetSize = Math.round(numberOfItems * 0.75);
            var numberOfItemsToTrim = Object.keys(items).length - targetSize;
            var oldestItems = Object.keys(lastAccessOfKeys).sort(function (a, b) {
                return lastAccessOfKeys[b] - lastAccessOfKeys[a]
            }).slice(0, numberOfItemsToTrim);
            oldestItems.forEach(function (key) {
                console.log('dropped', key, 'from cache');
                delete items[key];
                delete lastAccessOfKeys[key];
            });
        }

        function updateUseageTracking(key) {
            lastAccessOfKeys[key] = lastAccessOfKeys[key] || accessCounter++;
            if (!cacheTrimSchedulled && Object.keys(items).length > numberOfItems) {
                cacheTrimSchedulled = setTimeout(trimCache, 0);
            }
        }

        return {
            get: function (key, create) {
                updateUseageTracking(key);
                var cachedEntry = items[key];
                if (cachedEntry) {
                    return cachedEntry;
                }
                var createdEntry = create();
                items[key] = createdEntry;
                console.log('add item', key, 'to cache');
                return createdEntry;
            }
        };
    }
})(window);