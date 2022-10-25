var gameSettings = {
    playerSpeed: 200,
}

var config = {
    width: 600,
    height: 272,
    backgroundColor: "#eee",
    scene: [Scene1],
    pixelArt: true,
    physics: {
        default: "arcade",
        arcade: {
            debug: false
        }
    }
}
window.onload = function(){
    var game = new Phaser.Game(config);
}