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
var hex;
var hexagons;

function preload() {
    this.load.image('background', 'assets/Background.png');
    this.load.image('hex', 'assets/HexagonPiece50Rot.png');

}

var size;
var text;

function create() {
    this.add.image(400, 300, 'background');
    //color order: yellow, green, blue, red
    colors = [0xffc219, 0x5ae63e, 0x4e57f5, 0xf04848];
    hexagons = [];
    var horHexNum = 6;
    var verHexNum = 6;
    var y = ( game.config.height - (50 - 13) * verHexNum ) / 2;
    var startingX = ( game.config.width - 43 * horHexNum ) / 2;
    var x = startingX;
    for (var j = 0; j < verHexNum; j++) {
        if ((j + 1) % 2 == 0) {
            x = startingX + hexagons[hexagons.length - 1].width / 2.0;
        }
        else {
            x = startingX;
        }
        for (var i = 0; i < horHexNum; i++) {
            var randomTint = colors[Math.floor(Math.random() * Math.floor(colors.length))];
            hexagons.push(new Hexagon({scene: this, x: x, y: y, texture: 'hex', tint: randomTint}));
            x +=  hexagons[hexagons.length - 1].width;
        }
        y += hexagons[0].height - 13;
    }
    size = 0;
    text = this.add.text(16, 16, 'length: ' + size, { fontSize: '32px', fill: '#000' });
    // recText = this.add.text(16, 46, 'width: ' +  + ", texture width: " + hexImage.width, { fontSize: '32px', fill: '#000' });
}

var recText;
var mouseX, mouseY;


function update() {
    mouseX = game.input.mousePointer.x;
    mouseY = game.input.mousePointer.y;
    text.setText("x: " + game.input.mousePointer.x + ", y: " + game.input.mousePointer.y);

    hexagons.forEach(
        hexagon => {hexagon.update()}
    );
}