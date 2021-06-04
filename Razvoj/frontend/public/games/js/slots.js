// Autor: Aleksandar Dincic 2018/0028

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

var loadingScreen;
var balance;
var box;
var betText;
var err;
var playBut;
var rewardAmmountText;

var symbols = ['Cherry', 'Lemon', 'Eggplant', 'Grapes', 'Banana', 'Seven', 'Egg', 'Diamond', 'Treasure', 'Bogdan'];

var neededCombo = null;
var reward = null;
var rewardAmmount = 0;
var highlight = [];

var slotCenterX = WIDTH / 2;
var slotCenterY = HEIGHT / 2.5;

var slotFullW = 960;
var slotFullH = 540;
var slotPlayableW = 880;
var slotPlayableH = 460;
var slotPlayableX = slotCenterX - slotFullW / 2 + 40;
var slotPlayableY = slotCenterY - slotFullH / 2 + 40;
var symbolSize = 125;
var symbolHGap = (slotPlayableH / 3 - symbolSize);

var finalPos = slotPlayableY - (symbolHGap + symbolSize) / 2 + 3 * (symbolSize + symbolHGap);


function convertCombo(matrix) {
    neededCombo = [[], [], [], [], []];
    for (let i = 0; i < matrix[0].length; ++i) {
        for (let j = 0; j < matrix.length; ++j) {
            neededCombo[i][j] = matrix[j][i];
        }
    }
}

function getSlots() {
    let betAmount = box.getText();
    $.ajax({
        method: "POST",
        url: reqUrl + "REST/getSlots.php",
        dataType: "text",
        headers: {
            "Authorization": "Basic " + btoa(username + ":" + password)
        },
        data: {
            bet: betAmount
        },
        success: function (data, status, xhr) {
            let json = JSON.parse(data);
            convertCombo(json[1]);
            reward = (json[0][2] !== null) ? { symbol: json[0][2], length: json[0][1] } : null;
            rewardAmmount = json[0][0];
            rewardAmmountText.setVisible(false);
            findReward();
            balance.decBalance(betAmount);
            slotsObj.startMove();
            setTimeout(function () {
                slotsObj.announceCombo();
            }, 0 + Math.floor(Math.random() * 1000));
        },
        error: function (data, status, xhr) {
            err.setText(defaultServerErrorMessage);
            err.setVisible(true);
            neededCombo = null;
            slotsObj.spun = false;
            playBut.setText("Spin");
        }
    });
}


function preload() {
    loadCoreSprites(this);
    this.load.image('slot', 'sprites/slot-screen.png');
    this.load.image('Cherry', 'sprites/slots-symbols/cherry.png');
    this.load.image('Lemon', 'sprites/slots-symbols/lemon.png');
    this.load.image('Eggplant', 'sprites/slots-symbols/eggplant.png');
    this.load.image('Grapes', 'sprites/slots-symbols/grapes.png');
    this.load.image('Banana', 'sprites/slots-symbols/banana.png');
    this.load.image('Seven', 'sprites/slots-symbols/seven.png');
    this.load.image('Egg', 'sprites/slots-symbols/egg.png');
    this.load.image('Diamond', 'sprites/slots-symbols/diamond.png');
    this.load.image('Treasure', 'sprites/slots-symbols/treasure.png');
    this.load.image('Bogdan', 'sprites/slots-symbols/bogdan-praise.png');
}

class slotSymbol {
    constructor(x, y, symbol, owner, mask, column) {
        this.symbol = symbol;
        this.symbolImg = owner.add.image(x, y, symbol).setScale(0.5).setMask(mask);
        this.neededSymbol = null;
        this.column = column;
    }
    move(deltaY) {
        let newY = this.symbolImg.y + deltaY;
        if (newY > (slotPlayableY + slotPlayableH + (symbolHGap + symbolSize) / 2)) {
            newY -= (slotPlayableY + slotPlayableH + (symbolHGap + symbolSize) / 2);
            if (this.neededSymbol != null) {
                this.symbolImg.setTexture(this.neededSymbol);
                this.symbol = this.neededSymbol;
                this.column.announceFinishThisSpin(this);
                this.neededSymbol = null;
            }
            else {
                let newSymbol = symbols[Math.floor(Math.random() * symbols.length)];
                this.symbolImg.setTexture(newSymbol);
                this.symbol = newSymbol;
            }
        }
        this.symbolImg.y = newY;
    }
    setNeededSymbol(neededSymbol) {
        this.neededSymbol = neededSymbol;
    }
    isInFinalPos() {
        let retVal = this.symbolImg.y >= finalPos;
        return retVal;
    }
    alignToGrid(index) {
        this.symbolImg.y = slotPlayableY - (symbolHGap + symbolSize) / 2 + index * (symbolSize + symbolHGap);
    }
    getY() {
        return this.symbolImg.y;
    }
};

class symbolColumn {
    constructor(colIndex) {
        this.symbols = [];
        this.moving = false;
        this.speed = 0;
        this.colIndex = colIndex;
        this.finishThisSpin = false;
        this.symbolToFollow = null;
    }
    addSymbol(symbol) {
        this.symbols.push(symbol);
    }
    startMove(speed) {
        this.moving = true;
        this.speed = speed;
        this.finishThisSpin = false;
        this.symbolToFollow = null;
    }
    move() {
        if (this.moving) {
            for (let i = 0; i < this.symbols.length; ++i) {
                this.symbols[i].move(this.speed);
            }
            if (this.finishThisSpin && this.symbolToFollow.isInFinalPos()) {
                for (let i = 0; i < this.symbols.length; ++i) {
                    if (this.symbols[i] == this.symbolToFollow) {
                        let deltaIndex = 3 - i;
                        for (let j = 0; j < this.symbols.length; ++j) {
                            this.symbols[j].alignToGrid((j + deltaIndex) % 4);
                        }
                        break;
                    }
                }
                this.moving = false;
                slotsObj.announceStop();
            }
        }
    }
    announceCombo() {
        let deepest = this.symbols[0];
        let deepestIndex = 0;
        for (let i = 0; i < this.symbols.length; ++i) {
            if (this.symbols[i].getY() > deepest.getY()) {
                deepest = this.symbols[i];
                deepestIndex = i;
            }
        }
        for (let i = 2; i >= 0; --i) {
            this.symbols[deepestIndex].setNeededSymbol(neededCombo != null ? (neededCombo[this.colIndex][i]) : (symbols[Math.floor(Math.random() * symbols.length)]));
            if (--deepestIndex < 0)
                deepestIndex = 3;
        }
    }
    announceFinishThisSpin(symbol) {
        this.finishThisSpin = true;
        if (this.symbolToFollow == null)
            this.symbolToFollow = symbol;
    }
}

function findPath(x, y, length) {
    highlight.push([x, y]);
    if (length == 0)
        return true;
    if (neededCombo[x + 1][y] === reward.symbol) {
        let retVal = findPath(x + 1, y, length - 1);
        if (retVal)
            return retVal;
    }
    if (y > 0 && neededCombo[x + 1][y - 1] === reward.symbol) {
        let retVal = findPath(x + 1, y - 1, length - 1);
        if (retVal)
            return retVal;
    }
    if (y < 4 && neededCombo[x + 1][y + 1] === reward.symbol) {
        let retVal = findPath(x + 1, y + 1, length - 1);
        if (retVal)
            return retVal;
    }
    highlight.pop([x, y]);
    return false;
}

function findReward() {
    highlight = [];
    if (reward === null)
        return;
    for (let i = 0; i < 5; ++i)
        for (let j = 0; j < 3; ++j)
            if (neededCombo[i][j] === reward.symbol)
                if (findPath(i, j, reward.length - 1))
                    return;
}

function showRewardAmmount() {
    if (rewardAmmount === 0)
        return;
    balance.incBalance(rewardAmmount);
    rewardAmmountText.setBalance(rewardAmmount);
    rewardAmmountText.setVisible(true);
}

class slots {
    constructor() {
        this.slotCols = [];
        this.rewardRects = [];
        this.moving = false;
        this.spun = false;
        this.stoppedCols = 0;
    }
    addSlotCol(col) {
        this.slotCols.push(col);
    }
    addRectCol(col) {
        this.rewardRects.push(col);
    }
    startMove() {
        this.rewardRects.forEach(e => {
            e.forEach(ee => {
                ee.setVisible(false);
            });
        });

        this.moving = true;
        this.stoppedCols = 0;
        this.slotCols.forEach(e => {
            e.startMove(20 + Math.floor(Math.random() * 10));
        });
    }
    spin() {
        if (!this.spun) {
            var checkBal = balance.isPossibleBet(box.getText());
            if (checkBal !== true) {
                err.setText(checkBal);
                err.setVisible(true);
            }
            else {
                this.spun = true;
                playBut.setText("Spinning...");
                err.setVisible(false);
                getSlots();
            }
        }
    }
    move() {
        if (this.moving) {
            this.slotCols.forEach(e => { e.move() });
        }
    }
    announceCombo() {
        this.slotCols.forEach(e => { e.announceCombo() });
    }
    announceStop() {
        if (++this.stoppedCols == this.slotCols.length) {
            showRewardAmmount();
            highlight.forEach(e => {
                this.rewardRects[e[0]][e[1]].setVisible(true);
            });
            this.moving = false;
            this.spun = false;
            playBut.setText("Spin");
        }
    }
}

let slotsObj = new slots();

function authUserCallback(bogdinars) {
    if (isNaN(bogdinars)) {
        loadingScreen.loadingText.setText(bogdinars);
    }
    else {
        balance.setBalance(bogdinars);
        balance.setVisible(true);
        box.setVisible(true);
        betText.setVisible(true);
        playBut.setVisible(true);
        loadingScreen.setVisible(false);
    }
}

function create() {
    this.add.image(slotCenterX, slotCenterY, 'slot');

    let shape = this.make.graphics();
    shape.fillStyle(0xffffff);
    shape.beginPath();
    shape.fillRect(slotPlayableX, slotPlayableY, slotPlayableW, slotPlayableH);

    let mask = shape.createGeometryMask();

    for (let i = 0; i < 5; ++i) {
        let rectCol = [];
        for (let j = 0; j < 3; ++j) {
            let x = slotPlayableX + slotPlayableW / 10 + i * slotPlayableW / 5;
            let y = slotPlayableY + (symbolHGap + symbolSize) / 2 + j * (symbolSize + symbolHGap);

            let rewardRect = this.add.rectangle(x, y, symbolSize, symbolSize, 0xFF0000).setAlpha(0.2).setMask(mask).setVisible(false);

            this.tweens.add({

                targets: rewardRect,
                alpha: 0.5,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'

            });

            rectCol.push(rewardRect);
        }
        slotsObj.addRectCol(rectCol);
    }

    for (let i = 0; i < 5; ++i) {
        let currentCol = new symbolColumn(i);
        for (let j = 0; j < 4; ++j) {
            let x = slotPlayableX + slotPlayableW / 10 + i * slotPlayableW / 5;
            let y = slotPlayableY - (symbolHGap + symbolSize) / 2 + j * (symbolSize + symbolHGap);
            currentCol.addSymbol(new slotSymbol(x, y, symbols[Math.floor(Math.random() * symbols.length)], this, mask, currentCol));
        }
        slotsObj.addSlotCol(currentCol);
    }

    balance = new BalanceText(this, WIDTH, 16, "Balance: ");
    balance.setVisible(false);

    rewardAmmountText = new BalanceText(this, WIDTH, 48, "+");
    rewardAmmountText.setVisible(false);

    betText = this.add.text(60, HEIGHT - 120, "Place your bet:", { fontSize: '22px', fontFamily: "Arial Black", fill: '#ffffff' }).setOrigin(0, 0.5);
    betText.setVisible(false);
    box = new TextBox(this, 460, HEIGHT - 57);
    box.setVisible(false);
    playBut = new Button(this, WIDTH - 240, HEIGHT - 58, "Spin", function () { slotsObj.spin(); });
    playBut.setVisible(false);

    err = new ErrorMsg(this, 640, 85, "Sample Text");
    err.setVisible(false);

    loadingScreen = new LoadingScreen(this);
    authUser(authUserCallback);
}

function update() {
    slotsObj.move();
}

var game = new Phaser.Game(config);