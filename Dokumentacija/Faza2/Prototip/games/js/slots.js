// Autor: Aleksandar Dincic 2018/0028

var WIDTH = 1280;
var HEIGHT = 720;

var config = {
    type: Phaser.AUTO,
    backgroundColor: '#600003',
    width: WIDTH,
    height: HEIGHT,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

function preload() {
    loadCoreSprites(this);
    this.load.image('slot', 'sprites/slot-screen-fruit.png');
}

function create() {
    this.add.image(WIDTH / 2, HEIGHT / 2.5, 'slot');

    var balance = new BalanceText(this, WIDTH, 16);
    
    var betText = this.add.text(60, HEIGHT - 120, "Place your bet:", { fontSize: '22px', fontFamily: "Arial Black", fill: '#ffffff' }).setOrigin(0, 0.5);
    var betBox = new TextBox(this, 460, HEIGHT - 57);
    var playBut = new Button(this, WIDTH - 240, HEIGHT - 58, "Play", function () { });

}

function update() {

}

var game = new Phaser.Game(config);