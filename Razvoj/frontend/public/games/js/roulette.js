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

var numberPositions = [24, 4, 23, 0, 19, 34, 15, 30, 11, 26, 7, 29, 10, 3, 22, 37, 18, 33, 14, 12, 31, 16, 35, 20, 1, 8, 27, 6, 25, 9, 28, 13, 32, 17, 36, 21, 2, 5];

var wheel;
var ball;
var betBox;
var table;
var err;
var balance;

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

function setZoneClick(chipZone) {
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
}

class ChipZone {
    constructor(owner, left, top, width, height, name) {
        this.name = name;
        this.zone = owner.add.zone(left, top, width, height).setOrigin(0, 0).setInteractive();

        this.chip = new Chip(owner, left + width / 2, top + height / 2);
        this.chip.setVisible(false);

        setZoneClick(this);

        this.getVisible = function () { return this.chip.getVisible(); };
        this.setVisible = function (visible) { this.chip.setVisible(visible); };
        this.clear = function () {
            if (this.getVisible() === true) {
                balance.incBalance(this.getValue());
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
            this.chipZones.push(new ChipZone(owner, x + 343, y - 38 - i * 75, 49, 75, '2_to_1_' + (i + 1)));
        }

        this.chipZones.push(new ChipZone(owner, x - 323, y + 37, 220, 71, '1st_12'));
        this.chipZones.push(new ChipZone(owner, x - 103, y + 37, 220, 71, '2nd_12'));
        this.chipZones.push(new ChipZone(owner, x + 117, y + 37, 220, 71, '3rd_12'));

        this.chipZones.push(new ChipZone(owner, x - 323, y + 108, 110, 79, '1_to_18'));
        this.chipZones.push(new ChipZone(owner, x - 213, y + 108, 110, 79, 'even'));
        this.chipZones.push(new ChipZone(owner, x - 103, y + 108, 110, 79, 'red'));
        this.chipZones.push(new ChipZone(owner, x + 7, y + 108, 110, 79, 'black'));
        this.chipZones.push(new ChipZone(owner, x + 117, y + 108, 110, 79, 'odd'));
        this.chipZones.push(new ChipZone(owner, x + 227, y + 108, 110, 79, '19_to_36'));

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
            var checkVal = balance.decBalance(newVal);
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
    spin() {
        if (!this.spun) {
            this.spun = true;


            //TODO prebaci u startMove()
            this.moving = true;
            this.angularSpeed = wheelSpeed;
            this.decceleration = 0;
            this.ball.startMove();
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
                this.spun = false;//TODO premesti
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
    balance = new BalanceText(this, WIDTH, 16);
    balance.setBalance(1_000_000_000n);
    var helpText = this.add.text(60, HEIGHT - 120, "Place your bet by entering the amount and clicking on the layout:", { fontSize: '22px', fontFamily: "Arial Black", fill: '#ffffff' }).setOrigin(0, 0.5);
    betBox = new TextBox(this, 460, HEIGHT - 57);

    var clearBut = new Button(this, WIDTH - 240, HEIGHT - 50, "Clear", function () { table.clearZones(); err.setVisible(false); });
    var playBut = new Button(this, WIDTH - 240, HEIGHT - 120, "Play", function () {
        if (table.getZonesWithBets().length == 0) {
            err.setText("You must place a bet on the table.");
            err.setVisible(true);
        }
        else {
            err.setVisible(false)
            wheel.spin();
        };
    });

    err = new ErrorMsg(this, 640, 85, "Sample Text");
    err.setVisible(false);

}

function update() {
    wheel.move();
}

var game = new Phaser.Game(config);