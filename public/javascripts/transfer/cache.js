function createCache(deserialise) {
    var hash = '';
    var data = [];

    function acceptHashable(newHashable, oldHashable) {
        if (!newHashable) return;
        for (var i = newHashable.length - 1; i >= 0; i--) {
            _.remove(oldHashable, {
                hash: newHashable[i].hash
            });
            if (deserialise) {
                oldHashable.push(deserialise(newHashable[i]));
            } else {
                oldHashable.push(newHashable[i]);
            }
        };
        return oldHashable;
    }

    function buildHash(hashable) {
        var hash = ''
        _.chain(hashable)
            .sortByAll(['coordinates.x', 'coordinates.y'])
            .forEach(function (hasher) {
                hash += hasher.hash;
            }).value();
        return hash
    }
    return {
        flush: function () {
            this.data = []
        },
        incoming: function (hashable) {
            this.data = acceptHashable(hashable, data);
            this.hash = buildHash(hashable);
        },
        evict: function (location) {
            if (data && data.length < 50) return;
            data = _.filter(data, function (hashable) {
                return hashable.coordinates.x < location.x + 10000 &&
                    hashable.coordinates.x > location.x - 10000 &&
                    hashable.coordinates.y < location.y + 10000 &&
                    hashable.coordinates.y > location.y - 10000;
            });
        },
        getData: function () {
            return data;
        },
        hash: hash
    }
}