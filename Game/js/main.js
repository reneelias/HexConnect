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

function create() {
    this.add.image(400, 300, 'background');
    // game.input.mouse.capture = true;
    hexboard = new HexBoard({scene: this, game: game, size: 6});
    size = 0;
    text = this.add.text(16, 16, 'length: ' + size, { fontSize: '32px', fill: '#000' });
    // recText = this.add.text(16, 100, "okay", { fontSize: '32px', fill: '#000' });
}

var recText;
var mouseX, mouseY;


function update() {
    mouseX = game.input.activePointer.x;
    mouseY = game.input.activePointer.y;
    text.setText("x: " + game.input.activePointer.x + ", y: " + game.input.activePointer.y);
    // recText.setText('Elapsed seconds: ' + game.time.getElapsed());

    hexboard.update(game);
}
