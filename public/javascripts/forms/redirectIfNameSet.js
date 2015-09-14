window.onload = function () {
    var characterName = $.cookie('character-name');
    if (characterName) {
        document.location.href = "/game"
    }
};