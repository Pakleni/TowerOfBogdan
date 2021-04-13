// Autor: Aleksandar Dincic 2018/0028

var WIDTH = 1280;
var HEIGHT = 720;

var config = {
    type: Phaser.AUTO,
    backgroundColor: '#35654d',
    width: WIDTH,
    height: HEIGHT,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var balance;
var err;
var box;
var playButton;

function preload() {
    loadCoreSprites(this);
    this.load.image('card', 'sprites/card-small.png');
}

function create() {
    for (var i = 0; i < 5; i++)
        this.add.image(110 - i * 2, 150 - i * 2, 'card').setScale(0.75);
    
    balance = new BalanceText(this, WIDTH, 16);
    balance.setBalance(100n);
    var bet = this.add.text(WIDTH / 2, 320, "Place your bet:", { fontSize: '32px', fontFamily: "Arial Black", fill: '#ffffff' }).setOrigin(0.5, 0.5);

    box = new TextBox(this, WIDTH / 2, 400);

    playButton = new Button(this, WIDTH / 2, 520, 'Play', function () {
        var checkBal = balance.isPossibleBet(box.getText());
        if (checkBal !== true) {
            err.setText(checkBal);
            err.setVisible(true);
        }
        else {
            err.setVisible(false);
        }
    });


    err = new ErrorMsg(this, 640, 85, "Sample Text");
    err.setVisible(false);
}

function update() {

}

var game = new Phaser.Game(config);