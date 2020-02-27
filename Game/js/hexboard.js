class HexBoard {
    constructor(config) {
        this.size = config.size;
        this.hexagons = [];
        this.positions = [];
        this.clickedHexagons = [];
        this.removedHexagons = [];

        this.flashTexture = config.scene.add.sprite(game.config.width / 2, game.config.height / 2, 'whiteDot');
        this.flashTexture.setScale(game.config.width, game.config.height);
        this.flashTexture.alpha = 0;
        this.flashTriggered = false;
        this.flashTextureAlpha = 0;

        //color order: yellow, green, blue, red, purple
        this.colors = [0xffc219, 0x5ae63e, 0x42adf5, 0xf04848, 0x9042f5];

        this.dragging = false;
        this.mouseX = 0;
        this.mouseY = 0;
        this.scene = config.scene;

        // this.lineSprite = config.scene.add.sprite(50, 50, 'whiteDot', 0xffffff);
        // this.lineSprite.setScale(20, 100);
        // this.containsText = config.scene.add.text(16, 45, 'leftButton.isUp: ' + this.dragging, { fontSize: '32px', fill: '#000' });
        this.score = 0;
        this.scoreText = config.scene.add.text(game.config.width / 2, 20, 'Score: ' + this.score, { fontSize: '32px', fill: '#000' });
        this.scoreText.x = game.config.width / 2 - this.scoreText.width / 2;


        this.totalTime = 60;

        this.timer = config.scene.time.addEvent({ delay: this.totalTime * 1000, loop: false });

        this.time = this.totalTime;
        this.timeText = config.scene.add.text(game.config.width / 2, 32, 'Time: ' + this.time, { fontSize: '32px', fill: '#000' });
        this.timeText.x = game.config.width / 2 - this.timeText.width / 2;
        this.timeText.y = game.config.height - this.timeText.height - 20;

        this.gameOverText = config.scene.add.text(1000, 32, 'Game Over', { fontSize: '48px', fill: '#000' });
        this.gameOverText.x = game.config.width / 2 - this.gameOverText.width / 2;
        this.gameOverText.y = game.config.height / 2 - this.gameOverText.height * 2;
        this.clearAllColor = false;
        this.clearColor;

        this.lineSprites = [];
        this.gameOver = true;
        this.gameOverCounter = 0;
        // this.createBoard(config.scene, config.game, this.size);
    }

    update(game, scene) {
        this.mouseX = game.input.activePointer.x;
        this.mouseY = game.input.activePointer.y;

        if (this.time > 0) {
            //Updating hexagons and check for first hex click
            this.hexagons.forEach(hexagon => {
                hexagon.update(game.input.activePointer, this.clickedHexagons.length == 0);

                if (hexagon.clicked && this.clickedHexagons.length == 0) {
                    this.dragging = true;
                    this.clickedHexagons.push(hexagon);
                }
            });

            if (!game.input.activePointer.isDown && this.dragging) {
                this.dragging = false;
                this.hexDeletion();
            }

            if (this.dragging) {
                this.hexSelection(scene);
            }

            if (this.flashTriggered) {
                this.flashAnimation();
            }
        } else {
            //Game is over
            this.gameOverCleanup();

            this.gameOverCounter++;
            if(this.gameOverCounter > 60){
                this.gameOver = true;
            }

            if (!this.gameOverText.visible) {
                this.gameOverText.visible = true;
            }
        }

        //Score text
        this.scoreText.setText('Score: ' + this.score);
        this.scoreText.x = game.config.width / 2 - this.scoreText.width / 2;

        //Time remaining calculation
        this.time = this.totalTime - this.totalTime * this.timer.getProgress();

        //Time Text
        this.timeText.setText('Time: ' + Math.floor(this.time));
        this.timeText.x = game.config.width / 2 - this.timeText.width / 2;
        this.timeText.y = game.config.height - this.timeText.height - 20;
    }

    hexSelection(scene) {

        if (this.lineSprites.length >= this.clickedHexagons.length) {
            this.lineSprites[this.lineSprites.length - 1].destroy();
            this.lineSprites.pop();
        }

        this.hexagons.forEach(hexagon => {
            var lastClickedHex = this.clickedHexagons[this.clickedHexagons.length - 1];
            var distanceBetweenHexs = Math.ceil(Phaser.Math.Distance.Between(hexagon.x, hexagon.y, lastClickedHex.x, lastClickedHex.y));

            if (hexagon.getBounds().contains(this.mouseX, this.mouseY)) {
                //Adds hexagons to selection
                if (!this.clickedHexagons.includes(hexagon) && hexagon.color == lastClickedHex.color &&
                    distanceBetweenHexs == hexagon.width && hexagon != lastClickedHex) {
                    hexagon.click();
                    this.clickedHexagons.push(hexagon);

                    this.addLine(scene, hexagon, lastClickedHex);
                }
                //Removes hexagons from selection
                else if (this.clickedHexagons.includes(hexagon) && this.clickedHexagons.length > 1 &&
                    hexagon == this.clickedHexagons[this.clickedHexagons.length - 2]) {
                    this.clickedHexagons[this.clickedHexagons.length - 1].reset();
                    this.clickedHexagons.pop();
                    this.lineSprites[this.lineSprites.length - 1].destroy();
                    this.lineSprites.pop();
                }
                //Closed loop check
                else if (this.clickedHexagons.includes(hexagon) && this.clickedHexagons.length >= 4 &&
                    hexagon == this.clickedHexagons[0] && distanceBetweenHexs == hexagon.width) {
                    this.clearAllColor = true;
                    this.clearColor = hexagon.color;
                    this.flashTexture.tint = this.clearColor;
                    this.flashTriggered = true;
                    this.flashTextureAlpha = .3;
                    this.flashTexture.alpha = this.flashTextureAlpha;
                    this.addLine(scene, hexagon, lastClickedHex);
                }
            }
        });
    }

    hexDeletion() {
        //If closed loop achieved, all hexagons of the same color set to clicked
        if (this.clearAllColor) {
            this.hexagons.forEach(hexagon => {
                if (!this.clickedHexagons.includes(hexagon) && hexagon.color == this.clearColor) {
                    hexagon.click();
                    this.clickedHexagons.push(hexagon);
                }
            });
            this.clearAllColor = false;
        }

        //All clicked hexagons added for removal
        //Board spots are set to unoccupied
        this.clickedHexagons.forEach(hexagon => {
            hexagon.reset();
            if (this.clickedHexagons.length > 1) {
                hexagon.shrinkActivated = true;
                this.removedHexagons.push(hexagon);
                this.score++;

                for (var i = 0; i < this.positions.length; i++) {
                    if (this.positions[i].x == hexagon.x && this.positions[i].y == hexagon.y) {
                        this.positions[i].occupied = false;
                        break;
                    }
                }
            }
        });
        this.clickedHexagons = [];

        //Remove all line sprites between hexagons
        for (var i = 0; i < this.lineSprites.length; i++) {
            this.lineSprites[i].destroy();
        }
        this.lineSprites = [];

        //An array with starting y positions to build a separation between
        //hexagons falling in the same column
        var startingYs = [];
        for (var i = 0; i < this.size; i++) {
            startingYs.push(-100);
        }
        var currentCol = this.size - 1;

        //Nested for loops that remove hexagons from the board
        //and queue up paths for hexagons to move into new spots
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

    createBoard(scene, game, size) {
        this.resetVariables(scene);

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

    flashAnimation() {
        this.flashTextureAlpha -= .035;
        this.flashTexture.alpha = this.flashTextureAlpha;
        if (this.flashTexture.alpha <= 0) {
            this.flashTriggered = false;
        }
    }

    addLine(scene, hexagon, previousHexgon) {
        var tempLineSprite = scene.add.sprite(hexagon.x, hexagon.y, 'whiteDot', 0xffffff);
        tempLineSprite.setOrigin(0, 0.5);
        tempLineSprite.setScale(hexagon.width, 5);
        tempLineSprite.angle = Phaser.Math.RadToDeg(Phaser.Math.Angle.Between(hexagon.x, hexagon.y, previousHexgon.x, previousHexgon.y));
        tempLineSprite.tint = hexagon.color;

        this.lineSprites.push(tempLineSprite);
    }

    gameOverCleanup() {
        //All hexagons disappear when game is over
        this.hexagons.forEach(hexagon => {
            if (hexagon.scale > .075) {
                hexagon.shrink();
            } else {
                hexagon.destroy();
            }
        });

        //Remove any remaining line sprites
        for (var i = 0; i < this.lineSprites.length; i++) {
            this.lineSprites[i].destroy();
        }
        if (this.lineSprites.length > 0) {
            this.lineSprites = [];
        }

        if (this.flashTexture.alpha != 0) {
            this.flashTexture.alpha = 0;
            this.flashTriggered = false;
            this.flashTextureAlpha = 0;
        }
    }

    resetVariables(scene) {
        this.hexagons = [];
        this.positions = [];
        this.clickedHexagons = [];
        this.removedHexagons = [];
        this.score = 0;
        this.time = this.totalTime;
        this.timer.destroy();
        this.timer = scene.time.addEvent({ delay: this.totalTime * 1000, loop: false });
        this.gameOverText.visible = false;
        this.flashTexture.alpha = 0;
        this.flashTriggered = false;
        this.flashTextureAlpha = 0;
        this.gameOver = false;
        this.gameOverCounter = 0;
    }
}