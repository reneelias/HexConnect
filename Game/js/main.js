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
var background;
var menu;
var playing;
var hexboard;

function preload() {
    this.load.image('background', 'assets/Background.png');
    this.load.image('hex', 'assets/HexagonPiece.png');
    this.load.image('whiteHex', 'assets/HexagonPieceThick15BorderWhite50.png');
    this.load.image('whiteDot', 'assets/WhitePixel.png');
    this.load.image('button', 'assets/SquareButton.png')

    this.load.audio('hitSound', 'assets/WoodenHit3.mp3');
    this.load.audio('clearSound', 'assets/ClearSound.mp3');
}


function create() {
    background = this.add.sprite(game.config.width / 2, game.config.height / 2, 'background');
    background.setScale(game.config.width / 800, game.config.height / 600);
    hexboard = new HexBoard({ scene: this, game: game });
    menu = new Menu({ scene: this, x: game.config.width / 2, y: game.config.height / 2, texture: 'whiteDot', tint: 0xffffff, width: 500, height: 400, buttonSize: 50 });
    playing = false;
}

function update() {

    if (playing) {
        hexboard.update(game, this);

        if (hexboard.gameOver) {
            playing = false;
            menu.setVisible(true);
        }
    } else {
        menu.update(game.input.activePointer);

        if (menu.playButton.clicked) {
            playing = true;
            menu.playButton.unclick();
            menu.setVisible(false);
            hexboard.createBoard(this, game, menu.boardSize, menu.colorsAmount);
        }
    }

}
