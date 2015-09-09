var canvas = document.getElementById('screen');
var ctx = canvas.getContext('2d');

function init() {
    var update = createUpdate();
    var events = createEventHandler();

    events.registerEventHandlers(update);
    setInterval(update.mainLoop, 50);
    console.log('initialised');
}

window.onload = init;