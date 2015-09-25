var _ = require('lodash');

module.exports = function createBiomeGenerator() {
    function getGrassBiome() {
        return {
            r: {
                base: 10,
                multiplier: 10
            },
            g: {
                base: 170,
                multiplier: 40
            },
            b: {
                base: 35,
                multiplier: 20
            },
            name: 'grass'
        }
    }

    function getAutumnBiome() {
        return {
            r: {
                base: 60,
                multiplier: 70
            },
            g: {
                base: 170,
                multiplier: 40
            },
            b: {
                base: 35,
                multiplier: 20
            },
            name: 'autumn'
        }
    }

    function getStoneBiome() {
        return {
            uniform: function () {
                return Math.floor(Math.random() * 40 + 80)
            },
            r: {
                base: 10,
                multiplier: 10
            },
            g: {
                base: 170,
                multiplier: 40
            },
            b: {
                base: 35,
                multiplier: 20
            },
            name: 'stone'
        }
    }

    function getPercentages(neighbourList) {
        var autumnPercentage = 40;
        var stonePercentage = 20;
        var counts = _.countBy(neighbourList, 'biome');
        counts.autumn = counts.autumn || 0;
        counts.stone = counts.stone || 0;
        var percentages = {
            autumn: Math.floor(autumnPercentage * (0.25 * counts.autumn + 1)),
            stone: Math.floor(stonePercentage * (counts.stone + 1))
        };
        console.log(percentages);
        return percentages;
    }

    return {
        generate: function (neighbourList) {
            var biome = Math.floor(Math.random() * 100)
            var percentages = getPercentages(neighbourList);

            if (biome <= percentages.stone) {
                return getStoneBiome();
            }
            if (biome <= percentages.autumn) {
                return getAutumnBiome()
            }
            return getGrassBiome();
        }
    }
}