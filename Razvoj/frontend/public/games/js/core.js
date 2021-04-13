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

function setErrorMsgClose(msg) {
    msg.closeButton.on('pointerover', function () {
        msg.closeButton.setTint(defaultHoverTint);
    });
    msg.closeButton.on('pointerout', function () {
        msg.closeButton.setTint(defaultNormalTint);
    });
    msg.closeButton.on('pointerdown', function (pointer) {
        msg.closeButton.setTint(defaultNormalTint);
        msg.setVisible(false);
    });
}

class ErrorMsg {
    constructor(owner, x, y, text) {
        this.bg = owner.add.image(x, y, 'errormsg');
        this.text = owner.add.text(x, y - 25, text, { fontSize: '24px', fontFamily: "Arial Black", fill: '#FFFFFF' }).setOrigin(0.5, 0.5);

        this.closeButton = owner.add.image(x + 375, y - 50, 'closebutton').setTint(defaultNormalTint).setInteractive();

        setErrorMsgClose(this);

        this.setVisible = function (visible) {
            this.bg.setVisible(visible);
            this.text.setVisible(visible);
            this.closeButton.setVisible(visible);
        }

        this.setText = function (newText) {
            this.text.setText(newText);
        }
    }
}

class BalanceText {
    constructor(owner, x, y) {
        this.balance = 0n;
        this.text = owner.add.text(x, y, 'Balance: ' + this.balance + ' β', { fontSize: '32px', fontFamily: "Arial Black", fill: '#FFD700' }).setOrigin(1.0, 0.5);

        this.setBalance = function (newBalance) {
            if (!this.isValidAmount(newBalance))
                return "Invalid input, please enter a number.";

            this.balance = BigInt(newBalance);
            this.text.setText('Balance: ' + this.balance + ' β');
            return true;
        };

        this.isValidAmount = function (amount) {
            return /^[0-9]+$/.test(String(amount));
        }

        this.isPossibleBet = function (amount) {
            if (!this.isValidAmount(amount))
                return "Invalid input, please enter a number.";
            amount = BigInt(amount);
            if (amount == 0)
                return "Bet amount can't be zero."
            if (amount > this.balance)
                return "You don't have enough Bogdinars."
            return true;
        }

        this.decBalance = function (amount) {
            var retVal = this.isPossibleBet(amount);
            if (retVal === true)
                this.setBalance(this.balance - BigInt(amount));
            return retVal;
        }

        this.incBalance = function (amount) {
            if (!this.isValidAmount(amount))
                return "Invalid input, please enter a number.";

            this.setBalance(this.balance + BigInt(amount));
            return true;
        }
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
    game.load.image('errormsg', 'sprites/errorMsg.png');
    game.load.image('closebutton', 'sprites/closeButton.png')
}