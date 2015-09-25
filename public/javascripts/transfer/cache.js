function createCache(deserialise) {
    var hash = '';
    var data = [];

    function acceptHashable(newHashable, oldHashable) {
        if (!newHashable) return;
        if (oldHashable.length + newHashable.length > 100) {
            oldHashable = _.takeRight(oldHashable, 100);
        }
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
        hash: hash,
        data: data
    }
}