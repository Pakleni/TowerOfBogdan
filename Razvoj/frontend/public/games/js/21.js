// Autor: Aleksandar Dincic 2018/0028

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

var sessionId = "";

var balance;
var rewardAmmountText;
var err;
var betMsg;
var loadingScreen;
var playBtns;
var endRsl;
var playerHand, dealerHand;

var spaceBetweenCards = 25;
var deckX = 110;
var deckY = 150;
var lerpFactor = 0.2;
var lerpTreshold = 1;
var lerpMin = 0;

var canPlay = true;

function preload() {
    loadCoreSprites(this);
    this.load.image('card', 'sprites/card-small.png');

    for (let i = 1; i <= 11; ++i) {
        this.load.image('card-' + i, 'sprites/card-' + i + '.png');
    }
}

function keepAlive() {
    $.ajax({
        method: "POST",
        url: reqUrl + "REST/get21.php",
        dataType: "text",
        headers: {
            "Authorization": "Basic " + btoa(username + ":" + password)
        },
        data: {
            operation: "keepalive",
            sessionId: sessionId
        }
    });
}

function evaluate(json) {
    if (json[0] == 0)
        return;
    let winnerName = json[0] == 1 ? "Player" : "Dealer";
    if (json[2] != 0) {
        rewardAmmountText.setBalance(json[2]);
        balance.incBalance(json[2]);
        rewardAmmountText.setVisible(true);
    }
    endRsl.setWinner(winnerName);
    endRsl.setVisible(true);
    playBtns.setVisible(false);
}

function startGame() {
    betMsg.playButton.setText("Playing...");
    let betAmount = betMsg.box.getText();

    $.ajax({
        method: "POST",
        url: reqUrl + "REST/get21.php",
        dataType: "text",
        headers: {
            "Authorization": "Basic " + btoa(username + ":" + password)
        },
        data: {
            operation: "start",
            bet: betAmount
        },
        success: function (data, status, xhr) {
            let json = JSON.parse(data);
            sessionId = json[3];
            betMsg.setVisible(false);
            playerHand.setVisible(true);
            dealerHand.setVisible(true);
            playBtns.setVisible(true);
            balance.decBalance(betAmount);
            playerHand.addCard(json[1][0][0], function () {
                dealerHand.addCard(json[1][1][0], function () {
                    playerHand.addCard(json[1][0][1], function () {
                        dealerHand.addCard(json[1][1][1], function () {
                            evaluate(json);
                            playBtns.hitButton.setText("Hit");
                            playBtns.standButton.setText("Stand");
                            canPlay = true;
                        })
                    })
                })
            });
        },
        error: function (data, status, xhr) {
            err.setText(defaultServerErrorMessage);
            err.setVisible(true);
            betMsg.playButton.setText("Play");
            canPlay = true;
        }
    });
}

function dealerDraw(json, numOfCards) {
    if (numOfCards == 0) {
        evaluate(json);
        playBtns.hitButton.setText("Hit");
        playBtns.standButton.setText("Stand");
        canPlay = true;
    }
    else {
        dealerHand.addCard(json[1][1][json[1][1].length - numOfCards], function () {
            dealerDraw(json, numOfCards - 1);
        });
    }
}

function hit() {
    playBtns.hitButton.setText("Playing...");
    playBtns.standButton.setText("Playing...");
    $.ajax({
        method: "POST",
        url: reqUrl + "REST/get21.php",
        dataType: "text",
        headers: {
            "Authorization": "Basic " + btoa(username + ":" + password)
        },
        data: {
            operation: "hit",
            sessionId: sessionId
        },
        success: function (data, status, xhr) {
            let json = JSON.parse(data);
            playerHand.addCard(json[1][0][json[1][0].length - 1], function () {
                let numOfCards = json[1][1].length - dealerHand.numOfCards;
                dealerDraw(json, numOfCards);
            });
        },
        error: function (data, status, xhr) {
            err.setText(defaultServerErrorMessage);
            err.setVisible(true);
            playBtns.hitButton.setText("Hit");
            playBtns.standButton.setText("Stand");
            canPlay = true;
        }
    });
}

function stand() {
    playBtns.hitButton.setText("Playing...");
    playBtns.standButton.setText("Playing...");
    $.ajax({
        method: "POST",
        url: reqUrl + "REST/get21.php",
        dataType: "text",
        headers: {
            "Authorization": "Basic " + btoa(username + ":" + password)
        },
        data: {
            operation: "stand",
            sessionId: sessionId
        },
        success: function (data, status, xhr) {
            let json = JSON.parse(data);

            let numOfCards = json[1][1].length - dealerHand.numOfCards;
            dealerDraw(json, numOfCards);
        },
        error: function (data, status, xhr) {
            err.setText(defaultServerErrorMessage);
            err.setVisible(true);
            playBtns.hitButton.setText("Hit");
            playBtns.standButton.setText("Stand");
            canPlay = true;
        }
    });
}

class BetMessage {
    constructor(owner) {
        this.betText = owner.add.text(WIDTH / 2, 320, "Place your bet:", { fontSize: '32px', fontFamily: "Arial Black", fill: '#ffffff' }).setOrigin(0.5, 0.5);
        this.box = new TextBox(owner, WIDTH / 2, 400);
        let that = this;
        this.playButton = new Button(owner, WIDTH / 2, 520, 'Play', function () {
            if (canPlay) {
                var checkBal = balance.isPossibleBet(that.box.getText());
                if (checkBal !== true) {
                    err.setText(checkBal);
                    err.setVisible(true);
                }
                else {
                    canPlay = false;
                    err.setVisible(false);
                    startGame();
                }
            }
        });
    }
    setVisible(visible) {
        this.betText.setVisible(visible);
        this.box.setVisible(visible);
        this.playButton.setText("Play");
        this.playButton.setVisible(visible);
    }
};

class Card {
    constructor(owner, hand, x, y) {
        this.card = owner.add.image(x, y, 'card').setScale(0.75).setVisible(false);
        this.hand = hand;
        this.number = 0;
        this.targetX = x;
        this.targetY = y;
        this.moving = false;
    }
    startMove() {
        this.moving = true;
        this.card.x = deckX;
        this.card.y = deckY;
        this.card.setVisible(true);
    }
    move() {
        if (this.moving) {
            this.card.x += (this.targetX - this.card.x) * lerpFactor;
            this.card.y += (this.targetY - this.card.y) * lerpFactor;

            if (Math.sqrt(Math.pow(this.targetX - this.card.x, 2) + Math.pow(this.targetY - this.card.y, 2)) <= lerpTreshold) {
                this.card.x = this.targetX;
                this.card.y = this.targetY;
                this.moving = false;
                this.hand.finishMove();
            }
        }
    }
};

class Hand {
    constructor(owner, x, y, handHolder, isBottom) {
        this.cards = [];
        this.numOfCards = 0;
        this.amount = 0;
        this.handHolder = handHolder;
        this.amountText = owner.add.text(x + 2.5 * spaceBetweenCards, isBottom ? (y - 150) : (y + 150), handHolder + ": 0", { fontSize: '36px', fontFamily: "Arial Black", fill: '#ffffff' }).
            setOrigin(0.5, 0.5);
        this.callback = null;
        for (let i = 0; i < 6; ++i) {
            this.cards.push(new Card(owner, this, x + i * spaceBetweenCards, y));
        }
    }
    move() {
        this.cards.forEach(e => { e.move(); });
    }
    addCard(number, callback) {
        this.callback = callback;
        let card = this.cards[this.numOfCards];
        card.card.setTexture('card-' + number);
        card.number = number;
        card.startMove();
        ++this.numOfCards;
    }
    finishMove() {
        this.amount += this.cards[this.numOfCards - 1].number;
        this.amountText.setText(this.handHolder + ": " + this.amount);
        this.callback();
    }
    setVisible(visible) {
        this.cards.forEach(e => { e.card.setVisible(false); }); //uvek false!!
        this.numOfCards = 0;
        this.amount = 0;
        this.amountText.setText(this.handHolder + ": " + this.amount);
        this.amountText.setVisible(visible);
    }
}

class PlayButtons {
    constructor(owner) {
        this.hitButton = new Button(owner, WIDTH / 2 + 300, 586, 'Hit', function () {
            if (canPlay) {
                canPlay = false;
                hit();
            }
        });

        this.standButton = new Button(owner, WIDTH / 2 + 300, 666, 'Stand', function () {
            if (canPlay) {
                canPlay = false;
                stand();
            }
        });
    }
    setVisible(visible) {
        playBtns.hitButton.setText("Hit");
        playBtns.standButton.setText("Stand");
        this.hitButton.setVisible(visible);
        this.standButton.setVisible(visible);
    }
};

class EndResult {
    constructor(owner) {
        this.winnerText = owner.add.text(WIDTH / 2, HEIGHT / 2, "Player wins!", { fontSize: '36px', fontFamily: "Arial Black", fill: '#ffffff' }).setOrigin(0.5, 0.5);
        let that = this;
        this.finishButton = new Button(owner, WIDTH / 2 + 300, 506, "Finish", function () {
            rewardAmmountText.setVisible(false);
            betMsg.setVisible(true);
            playerHand.setVisible(false);
            dealerHand.setVisible(false);
            playBtns.setVisible(false);
            that.setVisible(false);
        });
    }
    setWinner(winner) {
        this.winnerText.setText(winner + " wins!");
    }
    setVisible(visible) {
        this.winnerText.setVisible(visible);
        this.finishButton.setVisible(visible);
    }
};

function authUserCallback(bogdinars) {
    if (isNaN(bogdinars)) {
        loadingScreen.loadingText.setText(bogdinars);
    }
    else {
        balance.setBalance(bogdinars);
        balance.setVisible(true);
        betMsg.setVisible(true);
        loadingScreen.setVisible(false);
    }
}

function create() {

    for (var i = 0; i < 5; i++)
        this.add.image(deckX - i * 2, deckY - i * 2, 'card').setScale(0.75);

    playerHand = new Hand(this, WIDTH / 2 - 2.5 * spaceBetweenCards, 570, "Player", true);
    playerHand.setVisible(false);
    dealerHand = new Hand(this, WIDTH / 2 - 2.5 * spaceBetweenCards, 150, "Dealer", false);
    dealerHand.setVisible(false);

    balance = new BalanceText(this, WIDTH, 16, "Balance: ");
    balance.setVisible(false);

    betMsg = new BetMessage(this);
    betMsg.setVisible(false);

    playBtns = new PlayButtons(this);
    playBtns.setVisible(false);

    endRsl = new EndResult(this);
    endRsl.setVisible(false);

    rewardAmmountText = new BalanceText(this, WIDTH, 48, "+");
    rewardAmmountText.setVisible(false);

    err = new ErrorMsg(this, 640, 85, "Sample Text");
    err.setVisible(false);

    loadingScreen = new LoadingScreen(this, WIDTH, HEIGHT);
    authUser(authUserCallback);


    setInterval(keepAlive, 600_000);
}


function update() {
    playerHand.move();
    dealerHand.move();
}

$(window).on("unload", function () {
    $.ajax({
        method: "POST",
        url: reqUrl + "REST/get21.php",
        dataType: "text",
        headers: {
            "Authorization": "Basic " + btoa(username + ":" + password)
        },
        data: {
            operation: "end",
            sessionId: sessionId
        }
    });
});

var game = new Phaser.Game(config);