var _ = require('lodash');

module.exports = function createPlayerList() {
    var playerList = [];

    function hasPlayer(player) {
        return _.some(playerList, {
            id: player.id
        });
    }

    return {
        add: function (player) {
            this.remove(player);
            playerList.push(player);
        },
        remove: function (player) {
            if (hasPlayer(player)) {
                _.remove(playerList, {
                    id: player.id
                });
            }
        },
        removeByConnection: function (reference) {
            _.remove(playerList, {
                connectionReference: reference
            });
        },
        update: function (player) {
            this.remove(player);
            this.add(player);
        },
        within: function (box) {
            return _.filter(playerList, function (player) {
                return player.coordinates.x > box.minX &&
                    player.coordinates.x < box.maxX &&
                    player.coordinates.y > box.minY &&
                    player.coordinates.y < box.maxY
            });
        },
        list: playerList,
        find: function (id) {
            return _.find(playerList, {
                id: id
            });

        },
        hasPlayerWithName: function (name) {
            return _.find(playerList, {
                name: name
            });

        }
    }
}