var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

function preload() {
    this.load.image('background', 'assets/Background.png');
    this.load.image('hex', 'assets/HexagonPiece.png');
    this.load.image('whiteHex', 'assets/HexagonPieceThick15BorderWhite50.png');
    this.load.image('whiteDot', 'assets/WhiteDot.png');
    this.load.image('button', 'assets/SquareButton.png')
}

var size;
var text;
var recText;
var mouseX, mouseY;
var background;
var restartButton;
var menu;
var playing;

function create() {
    background = this.add.sprite(game.config.width / 2, game.config.height / 2, 'background');
    background.setScale(game.config.width / 800, game.config.height / 600);
    size = 6;
    hexboard = new HexBoard({ scene: this, game: game, size: size });
    menu = new Menu({ scene: this, x: game.config.width / 2, y: game.config.height / 2, texture: 'whiteDot', tint: 0xffffff, width: 500, height: 400, buttonSize: 50 });
    playing = false;
}

function update() {
    // mouseX = game.input.activePointer.x;
    // mouseY = game.input.activePointer.y;
    // text.setText("x: " + game.input.activePointer.x + ", y: " + game.input.activePointer.y);
    // recText.setText('Elapsed seconds: ' + game.time.getElapsed());

    if (playing) {
        hexboard.update(game, this);
        
        if (hexboard.gameOver) {
            playing = false;
        }

        if (menu.visible) {
            menu.setVisible(false);
        }
    } else {
        if (!menu.visible) {
            menu.setVisible(true);
        }
        menu.update(game.input.activePointer);
        if (menu.playButton.clicked) {
            playing = true;
            menu.playButton.unclick();
            hexboard.createBoard(this, game, 6);
        }
    }

}
