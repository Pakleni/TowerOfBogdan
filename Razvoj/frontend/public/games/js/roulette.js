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

var wheel;
var betBox;
var table;

var err;
var balance;

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

function preload() {
    loadCoreSprites(this);
    this.load.image('wheel', 'sprites/roulette-wheel.png');
    this.load.image('table', 'sprites/roulette-table-text.png');
    this.load.image('chip', 'sprites/chip.png');
}

function create() {
    this.input.mouse.disableContextMenu();

    wheel = this.add.image(WIDTH / 5.5, HEIGHT / 2.5, 'wheel').setScale(0.5);
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
        else err.setVisible(false);
    });

    err = new ErrorMsg(this, 640, 85, "Sample Text");
    err.setVisible(false);
}

function update() {
    wheel.rotation += 0.001;
}

var game = new Phaser.Game(config);