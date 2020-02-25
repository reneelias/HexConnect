class HexBoard {
    constructor(config) {
        this.size = config.size;
        this.hexagons;
        this.positions = [];
        this.clickedHexagons = [];
        this.removedHexagons = [];
        this.colors = [0xffc219, 0x5ae63e, 0x4e57f5, 0xf04848];
        this.createBoard(config.scene, config.game, this.size);
        this.dragging = false;
        this.boardRectangle;
        this.mouseX = 0;
        this.mouseY = 0;
        this.scene = config.scene;

        // this.lineSprite = config.scene.add.sprite(50, 50, 'whiteDot', 0xffffff);
        // this.lineSprite.setScale(20, 100);
        // this.containsText = config.scene.add.text(16, 45, 'leftButton.isUp: ' + this.dragging, { fontSize: '32px', fill: '#000' });
        // this.text = config.scene.add.text(16, 70, 'leftButton.isUp: ' + this.dragging, { fontSize: '32px', fill: '#000' });
        this.score = 0;
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
            }
        });


        if (!game.input.activePointer.isDown && this.dragging) {
            this.dragging = false;
            this.hexDeletion();
        }

        //Selection of multiple hexagons and removal of hexagons
        if (this.dragging) {
            this.hexagons.forEach(hexagon => {
                var lastClickedHex = this.clickedHexagons[this.clickedHexagons.length - 1];
                var distanceBetweenHexs = Math.ceil(Phaser.Math.Distance.Between(hexagon.x, hexagon.y, lastClickedHex.x, lastClickedHex.y));

                if (hexagon.getBounds().contains(this.mouseX, this.mouseY) && !this.clickedHexagons.includes(hexagon)
                    && hexagon.color == lastClickedHex.color && distanceBetweenHexs == hexagon.width
                    && hexagon != lastClickedHex) {
                    hexagon.click();
                    this.clickedHexagons.push(hexagon);
                }
            });
        }

        //Debug Text
        // this.text.setText('activePointer.isDown: ' + game.input.activePointer.isDown);
        // var rect = this.hexagons[0].getBounds();
        // this.containsText.setText('contains: ' + rect.contains(this.mouseX, this.mouseY));
        // this.text.setText('rect: ' + rect.x + ' ' + rect.y + '|| mouse: ' + this.mouseX + ' ' + this.mouseY);
    }

    createBoard(scene, game, size) {
        var hexagons = [];
        var tempHex = scene.add.sprite(100, 100, 'hex');
        var y = (game.config.height - (tempHex.height - tempHex.height * .26) * this.size) / 2;
        var startingX = (game.config.width - tempHex.width * this.size + tempHex.width / 2) / 2;
        var x = startingX;

        for (var j = 0; j < this.size; j++) {
            if ((j + 1) % 2 == 0) {
                x = startingX + tempHex.width / 2.0;
            }
            else {
                x = startingX;
            }
            for (var i = 0; i < size; i++) {
                var randomTint = this.colors[Math.floor(Math.random() * Math.floor(this.colors.length))];
                hexagons.push(new Hexagon({ scene: scene, x: x, y: y, texture: 'hex', tint: randomTint }));
                this.positions.push({ x: x, y: y, occupied: true });
                x += tempHex.width;
            }
            y += tempHex.height - tempHex.height * .26;
        }

        tempHex.destroy();
        this.hexagons = hexagons;
    }

    hexDeletion() {
        this.clickedHexagons.forEach(hexagon => {
            hexagon.reset();
            if (this.clickedHexagons.length > 1) {
                hexagon.shrinkActivated = true;
                this.removedHexagons.push(hexagon);

                for (var i = 0; i < this.positions.length; i++) {
                    if (this.positions[i].x == hexagon.x && this.positions[i].y == hexagon.y) {
                        this.positions[i].occupied = false;
                        break;
                    }
                }
            }
        });
        this.clickedHexagons = [];

        var startingYs = [];
        for (var i = 0; i < this.size; i++) {
            startingYs.push(-100);
        }
        var currentCol = this.size - 1;

        for (var i = this.positions.length - 1; i >= 0; i--) {
            if (!this.positions[i].occupied) {
                var destinationPositions = [{ x: this.positions[i].x, y: this.positions[i].y }]
                for (var k = i - this.size; ; k -= this.size) {
                    if (k >= 0 && this.positions[k].occupied) {
                        for (var j = 0; j < this.hexagons.length; j++) {
                            if (this.hexagons[j].x == this.positions[k].x && this.hexagons[j].y == this.positions[k].y) {
                                this.hexagons[j].startMoving(destinationPositions, this.hexagons[j].x, this.hexagons[j].y);
                                this.positions[i].occupied = true;
                                this.positions[k].occupied = false;
                                break;
                            }
                        }
                        break;
                    } else if (k < 0) {
                        this.removedHexagons[0].reset();
                        this.removedHexagons[0].startMoving(destinationPositions, this.positions[k + this.size].x, startingYs[currentCol]);
                        this.removedHexagons[0].randomizeColor(this.colors);
                        this.removedHexagons.shift();
                        this.positions[i].occupied = true;
                        startingYs[currentCol] -= this.hexagons[0].height * 4;
                        break;
                    } else {
                        destinationPositions.unshift({ x: this.positions[k].x, y: this.positions[k].y })
                    }
                }
            }
            currentCol--;
            if (currentCol < 0) {
                currentCol = this.size - 1;
            }
        }
    }
}