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
            }
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
            }
        }
    }

    function getStoneBiome() {
        return {
            uniform: function () {
                return Math.floor(Math.random() * 40 + 80)
            }
        }
    }
    return {
        generate: function () {
            var biome = Math.floor(Math.random() * 10)
            if (biome <= 8) {
                if (biome >= 6) {
                    return getAutumnBiome()
                } else {
                    return getGrassBiome()
                }
            } else {
                return getStoneBiome()
            }

        }
    }
}