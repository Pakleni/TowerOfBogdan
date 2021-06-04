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

var numberPositions = [24, 4, 23, 0, 19, 34, 15, 30, 11, 26, 7, 29, 10, 3, 22, 37, 18, 33, 14, 12, 31, 16, 35, 20, 1, 8, 27, 6, 25, 9, 28, 13, 32, 17, 36, 21, 2, 5];

var canBet = false;

var wheel;
var ball;
var box;
var table;
var err;
var balance;
var totalBetText;
var clearBut;
var playBut;
var helpText;
var rewardAmountText;
var loadingScreen;

var totalBetAmmount = 0;

var wheelX = WIDTH / 5.5;
var wheelY = HEIGHT / 2.5;
var wheelHolesRadius = 153;
var wheelOuterRadius = 203;

var wheelSpeed = 0.075;
var ballSpeed = 0.1;
var ballDownSpeed = 15;

var chosenField = Math.floor(Math.random() * numberPositions.length);
var minAngleTreshold = 2 * Math.PI / 38 * 8;
var maxAngleTreshold = 2 * Math.PI / 38 * 16;

var numOfLaps = 4;
var decceleration = 0.0002;

/*function setZoneClick(chipZone) {
    chipZone.zone.on('pointerdown', function (pointer) {
        if (pointer.rightButtonDown()) {
            chipZone.clear();
        }
        else if (pointer.leftButtonDown() && chipZone.getVisible() === false) {
            var checkVal = chipZone.chip.setValue(betBox.getText());
            if (checkVal !== true) {
                err.setText(checkVal);
                err.setVisible(true);
            }
            else {
                chipZone.setVisible(true);
                err.setVisible(false);
            }
        }
    });
}*/

class ChipZone {
    constructor(owner, left, top, width, height, name) {
        this.name = name;
        this.zone = owner.add.zone(left, top, width, height).setOrigin(0, 0).setInteractive();

        this.chip = new Chip(owner, left + width / 2, top + height / 2);
        this.chip.setVisible(false);

        let that = this;
        this.zone.on('pointerdown', function (pointer) {
            if (canBet) {
                if (pointer.rightButtonDown()) {
                    that.clear();
                }
                else if (pointer.leftButtonDown() && that.getVisible() === false) {
                    var checkVal = that.chip.setValue(box.getText());
                    if (checkVal !== true) {
                        err.setText(checkVal);
                        err.setVisible(true);
                    }
                    else {
                        that.setVisible(true);
                        err.setVisible(false);
                    }
                }
            }
        });
        // setZoneClick(this);

        this.getVisible = function () { return this.chip.getVisible(); };
        this.setVisible = function (visible) { this.chip.setVisible(visible); };
        this.clear = function () {
            if (this.getVisible() === true) {
                totalBetText.decBalance(this.getValue());
                this.setVisible(false);
                err.setVisible(false);
            }
        }
        this.getValue = function () { return this.chip.val; }
        this.setValue = function (newVal) { this.chip.setValue(newVal); };
    }
}

class Table {
    constructor(owner, x, y) {
        this.bg = owner.add.image(x, y, 'table').setInteractive();

        this.chipZones = [];
        this.chipZones.push(new ChipZone(owner, x - 392, y - 188, 69, 111, '00'));
        this.chipZones.push(new ChipZone(owner, x - 392, y - 77, 69, 111, '0'));

        for (var i = 0; i < 12; i++) {
            for (var j = 0; j < 3; j++) {
                this.chipZones.push(new ChipZone(owner, x - 323 + i * 55.5, y - 38 - j * 75, 55.5, 75, String(i * 3 + j + 1)));
            }
        }

        for (var i = 0; i < 3; i++) {
            this.chipZones.push(new ChipZone(owner, x + 343, y - 38 - i * 75, 49, 75, 'col' + (i + 1)));
        }

        this.chipZones.push(new ChipZone(owner, x - 323, y + 37, 220, 71, '1st12'));
        this.chipZones.push(new ChipZone(owner, x - 103, y + 37, 220, 71, '2nd12'));
        this.chipZones.push(new ChipZone(owner, x + 117, y + 37, 220, 71, '3rd12'));

        this.chipZones.push(new ChipZone(owner, x - 323, y + 108, 110, 79, '1to18'));
        this.chipZones.push(new ChipZone(owner, x - 213, y + 108, 110, 79, 'even'));
        this.chipZones.push(new ChipZone(owner, x - 103, y + 108, 110, 79, 'red'));
        this.chipZones.push(new ChipZone(owner, x + 7, y + 108, 110, 79, 'black'));
        this.chipZones.push(new ChipZone(owner, x + 117, y + 108, 110, 79, 'odd'));
        this.chipZones.push(new ChipZone(owner, x + 227, y + 108, 110, 79, '19to36'));

        this.clearZones = function () {
            this.chipZones.forEach(element => element.clear());
        }

        this.getZonesWithBets = function () {
            return this.chipZones.filter(element => element.getVisible());
        }
    }
}

class Chip {
    constructor(owner, x, y) {
        this.val = 0n;
        this.bg = owner.add.image(x, y, 'chip');
        this.text = owner.add.text(x, y, '0 β', { fontSize: '12px', fontFamily: "Arial Black", fill: '#ffffff' }).setOrigin(0.5, 0.5);

        this.setValue = function (newVal) {
            var checkVal = totalBetText.incBalance(newVal);
            if (checkVal === true) {
                this.val = BigInt(newVal);

                var valString;
                if (this.val > 999_999_999_999n)
                    valString = 'A lot';
                else if (this.val > 999_999_999n)
                    valString = String(this.val / 1_000_000_000n) + 'B';
                else if (this.val > 999_999n)
                    valString = String(this.val / 1_000_000n) + 'M';
                else if (this.val > 9999n)
                    valString = String(this.val / 1000n) + 'K';
                else
                    valString = String(this.val);

                this.text.setText(valString + ' β');
            }
            return checkVal;
        }

        this.getVisible = function () { return this.bg.visible; }

        this.setVisible = function (visible) {
            this.bg.setVisible(visible);
            this.text.setVisible(visible);
        }
    }
}

function getRoulette() {
    let totalBet = 0n;
    let betsData = [];
    let selectedFields = table.getZonesWithBets();
    selectedFields.forEach(e => {
        let fieldObj = {
            field: e.name,
            bet: e.getValue().toString()
        };
        betsData.push(fieldObj);
        totalBet += e.getValue();
    });

    let bets = JSON.stringify({
        bets: betsData
    });
    
    $.ajax({
        method: "POST",
        url: reqUrl + "REST/getRoulette.php",
        dataType: "text",
        headers: {
            "Authorization": "Basic " + btoa(username + ":" + password)
        },
        data: bets,
        success: function (data, status, xhr) {
            let json = JSON.parse(data);
            rewardAmountText.setVisible(false);
            rewardAmountText.setBalance(json[0]);
            chosenField = json[1];
            balance.decBalance(totalBet);
            wheel.startMove();
        },
        error: function (data, status, xhr) {
            err.setText(defaultServerErrorMessage);
            err.setVisible(true);
            wheel.spun = false;
            playBut.setText("Spin");
        }
    });
}

function showRewardAmount() {
    if (rewardAmountText.balance == 0)
        return;
    balance.incBalance(rewardAmountText.balance);
    rewardAmountText.setVisible(true);
}

class Wheel {
    constructor(owner) {
        this.wheel = owner.add.image(wheelX, wheelY, 'wheel').setScale(0.5);
        this.ball = null;
        this.spun = false;
        this.moving = false;
        this.angle = 0;
        this.angularSpeed = 0;
        this.decceleration = 0;
    }
    setBall(ball) {
        this.ball = ball;
    }
    startMove() {
        this.moving = true;
        this.angularSpeed = wheelSpeed;
        this.decceleration = 0;
        this.ball.startMove();
    }
    spin() {
        if (!this.spun) {
            let checkBal = balance.isPossibleBet(totalBetText.balance);
            if (checkBal !== true) {
                err.setText(checkBal);
                err.setVisible(true);
            }
            else {
                this.spun = true;
                playBut.setText("Spinning...");
                err.setVisible(false);
                getRoulette();
            }
        }
    }
    move() {
        if (this.moving) {
            this.angle += this.angularSpeed;
            if (this.angle >= 2 * Math.PI)
                this.angle -= 2 * Math.PI;

            this.wheel.rotation = this.angle;
            this.ball.move();

            this.angularSpeed -= this.decceleration;
            if (this.angularSpeed <= 0) {
                this.angularSpeed = 0;
                this.moving = false;
                this.spun = false;
                playBut.setText("Spin");
                showRewardAmount();
            }
        }
    }
    startDecceleration() {
        this.decceleration = decceleration;
    }
}

class Ball {
    constructor(owner, wheel) {
        this.wheel = wheel;
        this.ball = owner.add.circle(wheelX + wheelOuterRadius, -100, 7, 0xFFFFFF);
        this.moving = false;
        this.onWheel = false;

        this.radius = wheelOuterRadius;
        this.angle = 0;
        this.angularSpeed = 0;
        this.linearSpeed = 0;
        this.lapsPassed = 0;
        this.decceleration = 0;
    }
    startMove() {
        this.moving = true;
        this.onWheel = false;

        this.ball.x = wheelX + wheelOuterRadius;
        this.ball.y = -100;
        this.angle = 0;
        this.radius = wheelOuterRadius;
        this.angularSpeed = 0;
        this.linearSpeed = ballDownSpeed;
        this.lapsPassed = 0;
        this.decceleration = 0;
    }
    move() {
        if (this.moving) {
            if (!this.onWheel) {
                this.ball.y += this.linearSpeed;
                if (this.ball.y >= wheelY) {
                    this.ball.y = wheelY;
                    this.onWheel = true;
                    this.linearSpeed = 0;
                    this.angularSpeed = ballSpeed;
                }
            }
            else {
                this.angle += this.angularSpeed;
                if (this.angle >= 2 * Math.PI) {
                    this.angle -= 2 * Math.PI;
                    ++this.lapsPassed;
                }

                let targetAngle = this.wheel.angle + (2 * Math.PI / 38 * numberPositions[chosenField]);
                if (this.linearSpeed == 0) {
                    if (this.lapsPassed >= numOfLaps) {
                        if (targetAngle >= 2 * Math.PI)
                            targetAngle -= 2 * Math.PI;

                        if (this.angle + minAngleTreshold <= targetAngle && this.angle + maxAngleTreshold >= targetAngle) {
                            this.linearSpeed = (wheelOuterRadius - wheelHolesRadius) / ((targetAngle - this.angle) / (this.angularSpeed - this.wheel.angularSpeed));
                        }

                    }
                }
                else {
                    this.radius -= this.linearSpeed;
                    if (this.radius - wheelHolesRadius < 0.5) {
                        this.radius = wheelHolesRadius;
                        this.angularSpeed = this.wheel.angularSpeed;
                        this.angle = targetAngle;
                        this.linearSpeed = 0;
                        this.decceleration = decceleration;
                        this.wheel.startDecceleration();
                    }
                }

                this.ball.x = wheelX + this.radius * Math.cos(this.angle);
                this.ball.y = wheelY + this.radius * Math.sin(this.angle);

                this.angularSpeed -= this.decceleration;
                if (this.angularSpeed <= 0) {
                    this.angularSpeed = 0;
                    this.moving = false;
                }
            }
        }
    }
}

function authUserCallback(bogdinars) {
    if (isNaN(bogdinars)) {
        loadingScreen.loadingText.setText(bogdinars);
    }
    else {
        balance.setBalance(bogdinars);
        balance.setVisible(true);
        totalBetText.setVisible(true);
        box.setVisible(true);
        helpText.setVisible(true);
        clearBut.setVisible(true);
        playBut.setVisible(true);
        loadingScreen.setVisible(false);
        canBet = true;
    }
}

function preload() {
    loadCoreSprites(this);
    this.load.image('wheel', 'sprites/roulette-wheel-fat-rotated.png');
    this.load.image('table', 'sprites/roulette-table-text.png');
    this.load.image('chip', 'sprites/chip.png');
}

function create() {
    this.input.mouse.disableContextMenu();

    wheel = new Wheel(this);
    ball = new Ball(this, wheel);
    wheel.setBall(ball);

    table = new Table(this, WIDTH / 3 * 2, HEIGHT / 2.5);
    balance = new BalanceText(this, WIDTH, 16, "Balance: ");
    balance.setVisible(false);
    rewardAmountText = new BalanceText(this, WIDTH, 48, "+");
    rewardAmountText.setVisible(false);
    totalBetText = new BalanceText(this, WIDTH, 80, "Total bet: ");
    totalBetText.setVisible(false);
    helpText = this.add.text(60, HEIGHT - 120, "Place your bet by entering the amount and clicking on the layout:", { fontSize: '22px', fontFamily: "Arial Black", fill: '#ffffff' }).setOrigin(0, 0.5);
    helpText.setVisible(false);
    box = new TextBox(this, 460, HEIGHT - 57);
    box.setVisible(false);

    clearBut = new Button(this, WIDTH - 240, HEIGHT - 50, "Clear", function () { table.clearZones(); err.setVisible(false); });
    clearBut.setVisible(false);
    playBut = new Button(this, WIDTH - 240, HEIGHT - 120, "Spin", function () {
        wheel.spin();
    });
    playBut.setVisible(false);

    err = new ErrorMsg(this, 640, 85, "Sample Text");
    err.setVisible(false);

    loadingScreen = new LoadingScreen(this);
    authUser(authUserCallback);
}

function update() {
    wheel.move();
}

var game = new Phaser.Game(config);