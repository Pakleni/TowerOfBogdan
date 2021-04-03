// Autor: Aleksandar Dincic 2018/0028

var defaultNormalTint = 0xb5a8a8;
var defaultHoverTint = 0xdad3d3;
var defaultClickTint = 0x968585;

var defaultTextColor = '#ffffff';

function setButtonHover(button) {
    button.bg.on('pointerover', function () {
        button.bg.setTint(button.hoverTint);
    });
    button.bg.on('pointerout', function () {
        button.bg.setTint(button.normalTint);
    });
    button.bg.on('pointerdown', function () {
        button.bg.setTint(button.clickTint);
        button.onDown();
    });
    button.bg.on('pointerup', function () {
        button.bg.setTint(button.hoverTint);
    })
}

class Button {
    constructor(owner, x, y, text, onDown) {
        this.normalTint = defaultNormalTint;
        this.hoverTint = defaultHoverTint;
        this.clickTint = defaultClickTint;
        this.normalTextColor = defaultTextColor;

        this.onDown = onDown;

        this.bg = owner.add.image(x, y, 'button').setTint(this.normalTint).setScale(0.4).setInteractive();
        this.text = owner.add.text(x, y, text, { fontSize: '32px', fontFamily: "Arial Black", fill: this.normalTextColor }).setOrigin(0.5, 0.5);
        setButtonHover(this);

        this.setVisible = function (visible) {
            this.bg.setVisible(visible);
            this.text.setVisible(visible);
        };
    }
}

class BalanceText {
    constructor(owner, x, y) {
        this.balance = 0;
        this.text = owner.add.text(x, y, 'Balance: ' + this.balance + ' β', { fontSize: '32px', fontFamily: "Arial Black", fill: '#FFD700' }).setOrigin(1.0, 0.5);

        this.setBalance = function (newBalance) {
            this.balance = newBalance;
            this.text.setText('Balance: ' + newBalance + ' β');
        };
    }
}

class TextBox {
    constructor(owner, x, y) {
        this.bg = owner.add.image(x, y, 'textbox');
        this.currency = owner.add.text(x + 380, y, 'β', { fontSize: '32px', fontFamily: "Arial Black", fill: '#000000' }).setOrigin(1.0, 0.5);

        this.box = document.createElement("input");
        this.box.setAttribute("type", "text");
        this.box.classList.add("gameInput");
        this.box.style.width = 745 + "px";
        this.box.style.height = 65 + "px";
        this.box.style.top = (y - 32) + "px";
        this.box.style.left = (x - 395) + "px";
        document.body.appendChild(this.box);

        this.setVisible = function (visible) {
            this.bg.setVisible(visible);
            this.currency.setVisible(visible);
            this.box.style.display = visible ? "block" : "none";
        }

        this.getText = function () {
            return this.box.value;
        }
    }
}

function loadCoreSprites(game) {
    game.load.image('button', 'sprites/button.png');
    game.load.image('textbox', 'sprites/textbox.png');
}