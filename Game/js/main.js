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
}

var size;
var text;
var recText;
var mouseX, mouseY;
var background;

function create() {
    // this.add.image(game.config.width / 2, game.config.height / 2, 'background');
    background = this.add.sprite(game.config.width / 2, game.config.height / 2, 'background');
    background.setScale(game.config.width / 800, game.config.height / 600);
    // game.input.mouse.capture = true;
    hexboard = new HexBoard({scene: this, game: game, size: 6});
    // text = this.add.text(16, 16, 'length: ' + size, { fontSize: '32px', fill: '#000' });
    // recText = this.add.text(16, 100, "okay", { fontSize: '32px', fill: '#000' });
}

function update() {
    // mouseX = game.input.activePointer.x;
    // mouseY = game.input.activePointer.y;
    // text.setText("x: " + game.input.activePointer.x + ", y: " + game.input.activePointer.y);
    // recText.setText('Elapsed seconds: ' + game.time.getElapsed());

    hexboard.update(game);
}
