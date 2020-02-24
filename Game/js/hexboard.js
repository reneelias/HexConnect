class HexBoard {
    constructor(config) {
        this.size = config.size;
        this.hexagons;
        this.clickedHexagons = [];
        this.createBoard(config.scene, config.game, this.size);
        this.dragging = false;
        this.boardRectangle;
        this.mouseX = 0;
        this.mouseY = 0;
        this.scene = config.scene;

        // this.lineSprite = config.scene.add.sprite(50, 50, 'whiteDot', 0xffffff);
        // this.lineSprite.setScale(20, 100);
        this.containsText = config.scene.add.text(16, 45, 'leftButton.isUp: ' + this.dragging, { fontSize: '32px', fill: '#000' });
        this.text = config.scene.add.text(16, 70, 'leftButton.isUp: ' + this.dragging, { fontSize: '32px', fill: '#000' });
    }

    update(game) {
        this.mouseX = game.input.activePointer.x;
        this.mouseY = game.input.activePointer.y;

        //Updating hexagons and check for first hex click
        this.hexagons.forEach(hexagon => {
            hexagon.update();
            if (hexagon.clicked && this.clickedHexagons.length == 0) {
                this.dragging = true;
                this.clickedHexagons.push(hexagon);
                // line
            }
        });

        //Check if pointer is no longer clicking.
        if (!game.input.activePointer.isDown) {
            this.dragging = false;
            this.clickedHexagons.forEach(hexagon => {
                hexagon.reset();
                if (this.clickedHexagons.length > 1) {
                    hexagon.y = -100;
                }
            });
            this.clickedHexagons = [];
        }

        //Selection of multiple hexagons and removal of hexagons
        if (this.dragging) {
            this.hexagons.forEach(hexagon => {
                var lastClickedHex = this.clickedHexagons[this.clickedHexagons.length - 1];
                var distanceBetweenHexs = Math.ceil(Phaser.Math.Distance.Between(hexagon.x, hexagon.y, lastClickedHex.x, lastClickedHex.y));

                if (hexagon.getBounds().contains(this.mouseX, this.mouseY) && !this.clickedHexagons.includes(hexagon)
                    && hexagon.color == lastClickedHex.color && distanceBetweenHexs == hexagon.width) {
                    hexagon.click();
                    this.clickedHexagons.push(hexagon);
                }
            });
        }

        //Debug Text
        this.text.setText('activePointer.isDown: ' + game.input.activePointer.isDown);
        var rect = this.hexagons[0].getBounds();
        this.containsText.setText('contains: ' + rect.contains(this.mouseX, this.mouseY));
        this.text.setText('rect: ' + rect.x + ' ' + rect.y + '|| mouse: ' + this.mouseX + ' ' + this.mouseY);
    }

    createBoard(scene, game, size) {
        var colors = [0xffc219, 0x5ae63e, 0x4e57f5, 0xf04848];
        var hexagons = [];
        var hexHeight = 50;
        var hexWidth = 43;
        var y = (game.config.height - (hexHeight - 13) * this.size) / 2;
        var startingX = (game.config.width - hexWidth * this.size) / 2;
        var x = startingX;
        for (var j = 0; j < this.size; j++) {
            if ((j + 1) % 2 == 0) {
                x = startingX + hexagons[hexagons.length - 1].width / 2.0;
            }
            else {
                x = startingX;
            }
            for (var i = 0; i < size; i++) {
                var randomTint = colors[Math.floor(Math.random() * Math.floor(colors.length))];
                hexagons.push(new Hexagon({ scene: scene, x: x, y: y, texture: 'hex', tint: randomTint }));
                x += hexagons[hexagons.length - 1].width;
            }
            y += hexHeight - 13;
        }

        this.hexagons = hexagons;
    }
}