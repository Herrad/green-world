function createPlayer(){
	var up = new Image;
	up.src = "/images/player/up.png"
	var down = new Image;
	down.src = "/images/player/down.png"
	var left = new Image;
	left.src = "/images/player/left.png"
	var right = new Image;
	right.src = "/images/player/right.png"
	imageToDraw = down

	return {
		draw: function(ctx){
			ctx.drawImage(imageToDraw,480,328);
		},
		faceLeft: function(){
			imageToDraw = left
		},
		faceUp: function(){
			imageToDraw = up
		},
		faceRight: function(){
			imageToDraw = right
		},
		faceDown: function(){
			imageToDraw = down
		}
	};
}