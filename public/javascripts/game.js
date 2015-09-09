var canvas = document.getElementById('screen');
var ctx = canvas.getContext('2d');

function init() {
	var player = createPlayer();
    var update = createUpdate(player);
    var events = createEventHandler();

    events.registerEventHandlers(update);
    setInterval(update.mainLoop, 50);
    console.log('initialised');
}

window.onload = init;