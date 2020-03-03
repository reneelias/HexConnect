class HexBoard {

    constructor(config) {
        //Stores all hexagons on the board
        this.hexagons = [];
        //Positions stores the x,y coords of all positions and whether they are currently occupied
        this.positions = [];
        /*Because I am object-pooling and because of time constraints, I decided to have two separate arrays
        keeping track of hexagons and possible board positions instead of having hexagons
        keep track of that themselves*/

        this.selectedHexagons = [];
        this.removedHexagons = [];

        //Initialize variables associated with flashing animation for a closed loop
        this.flashTexture = config.scene.add.sprite(game.config.width / 2, game.config.height / 2, 'whiteDot');
        this.flashTexture.setScale(game.config.width, game.config.height);
        this.flashTexture.alpha = 0;
        this.flashTriggered = false;
        this.flashTextureAlpha = 0;

        //color order: yellow, green, blue, red, purple, orange, pink, dark blue
        this.colors = [0xe8db15, 0x2ad413, 0x42adf5, 0xf04848, 0x9042f5, 0xf78b25, 0xff87df, 0x0031d1];
        this.colorsAmount = 5;

        this.dragging = false;
        this.mouseX = 0;
        this.mouseY = 0;
        this.scene = config.scene;

        this.score = 0;
        this.scoreText = config.scene.add.text(game.config.width / 2, 20, 'Score: ' + this.score, { fontSize: '32px', fill: '#000' });
        this.scoreText.x = game.config.width / 2 - this.scoreText.width / 2;

        this.totalTime = 60;

        this.timer = config.scene.time.addEvent({ delay: this.totalTime * 1000, loop: false });

        this.timeLeft = this.totalTime;
        this.timeText = config.scene.add.text(game.config.width / 2, 32, 'Time: ' + this.timeLeft, { fontSize: '32px', fill: '#000' });
        this.timeText.x = game.config.width / 2 - this.timeText.width / 2;
        this.timeText.y = game.config.height - this.timeText.height - 20;

        this.gameOverText = config.scene.add.text(1000, 32, 'Game Over', { fontSize: '48px', fill: '#000' });
        this.gameOverText.x = game.config.width / 2 - this.gameOverText.width / 2;
        this.gameOverText.y = game.config.height / 2 - this.gameOverText.height * 2;

        //Boolean that controls whether all hexagons of the same color will be removed from the entire board
        this.clearAllColor = false;
        //Color of all hexagons to be cleared
        this.clearColor;

        //Array that holds all lines drawn between selected hexagons
        this.lineSprites = [];

        this.gameOver = true;
        /*Hacky variable that keeps game over on screen for a while before
        menu pops back up. Better ways to handle this, but time.*/
        this.gameOverCounter = 0;

        this.clearSound = config.scene.sound.add('clearSound');
    }

    update(game, scene) {
        this.mouseX = game.input.activePointer.x;
        this.mouseY = game.input.activePointer.y;

        if (this.timeLeft > 0) {
            //Updating hexagons and check for first hex click
            this.hexagons.forEach(hexagon => {
                hexagon.update(game.input.activePointer, this.selectedHexagons.length == 0);

                if (hexagon.clicked && this.selectedHexagons.length == 0) {
                    this.dragging = true;
                    this.selectedHexagons.push(hexagon);
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

            //Counter used to delay menu popping back up
            this.gameOverCounter++;
            if (this.gameOverCounter > 60) {
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
        this.timeLeft = this.totalTime - this.totalTime * this.timer.getProgress();

        //Time Text
        this.timeText.setText('Time: ' + Math.floor(this.timeLeft));
        this.timeText.x = game.config.width / 2 - this.timeText.width / 2;
    }

    hexSelection(scene) {

        //Fixes a bug where more lines than normal would appear
        //when performing a closed loop
        if (this.lineSprites.length >= this.selectedHexagons.length) {
            this.lineSprites[this.lineSprites.length - 1].destroy();
            this.lineSprites.pop();
        }

        this.hexagons.forEach(hexagon => {
            var lastClickedHex = this.selectedHexagons[this.selectedHexagons.length - 1];
            var distanceBetweenHexs = Math.ceil(Phaser.Math.Distance.Between(hexagon.x, hexagon.y, lastClickedHex.x, lastClickedHex.y));

            if (hexagon.getBounds().contains(this.mouseX, this.mouseY)) {
                //Adds hexagons to selection
                if (!this.selectedHexagons.includes(hexagon) && hexagon.color == lastClickedHex.color &&
                    distanceBetweenHexs == hexagon.width && hexagon != lastClickedHex) {
                    hexagon.click();
                    this.selectedHexagons.push(hexagon);

                    this.addLine(scene, hexagon, lastClickedHex);
                }
                //Removes hexagons from selection when back tracking
                else if ((this.selectedHexagons.includes(hexagon) && this.selectedHexagons.length > 1 &&
                    hexagon == this.selectedHexagons[this.selectedHexagons.length - 2])) {
                    this.selectedHexagons[this.selectedHexagons.length - 1].reset();
                    this.selectedHexagons.pop();
                    this.lineSprites[this.lineSprites.length - 1].destroy();
                    this.lineSprites.pop();
                }
                //Closed loop check
                else if (this.selectedHexagons.includes(hexagon) && this.selectedHexagons.length >= 4 &&
                    hexagon == this.selectedHexagons[0] && distanceBetweenHexs == hexagon.width) {
                    this.clearAllColor = true;
                    this.clearColor = hexagon.color;
                    this.flashTexture.tint = this.clearColor;
                    this.flashTriggered = true;
                    this.flashTextureAlpha = .3;
                    this.flashTexture.alpha = this.flashTextureAlpha;
                    this.addLine(scene, hexagon, lastClickedHex);
                }
                //Makes sure to cancel the clear-all-of-the-same-color function when back tracking
                else if(this.clearAllColor && hexagon != this.selectedHexagons[0] && this.selectedHexagons.includes(hexagon)){
                    this.clearAllColor = false;
                }
            }
        });
    }

    hexDeletion() {
        //If closed loop achieved, all hexagons of the same color set to clicked
        if (this.clearAllColor) {
            this.hexagons.forEach(hexagon => {
                if (!this.selectedHexagons.includes(hexagon) && hexagon.color == this.clearColor) {
                    hexagon.click();
                    this.selectedHexagons.push(hexagon);
                }
            });
            this.clearAllColor = false;
            this.clearSound.play();
        }

        //All selected hexagons being added for removal
        //Board spots are being set to unoccupied
        this.selectedHexagons.forEach(hexagon => {
            hexagon.reset();
            if (this.selectedHexagons.length > 1) {
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
        this.selectedHexagons = [];

        //Remove all line sprites between hexagons
        for (var i = 0; i < this.lineSprites.length; i++) {
            this.lineSprites[i].destroy();
        }
        this.lineSprites = [];

        //An array with starting y positions to build a separation between
        //hexagons falling in the same column
        var startingYs = [];
        for (var i = 0; i < this.boardSize; i++) {
            startingYs.push(-100);
        }
        //Keep track of which column we are on in order to add
        //to the correct starting y position
        var currentCol = this.boardSize - 1;

        //Nested for loops that remove hexagons from the board
        //and queue up paths for hexagons to move into new spots

        //We start from the bottom right position
        for (var i = this.positions.length - 1; i >= 0; i--) {
            //If this position is not occcupied, queue it up to be occupied
            if (!this.positions[i].occupied) {
                //This is an array that will keep track of all positions a hexagon
                //will have to travel to in order to finally reach its final destination
                var destinationPositions = [{ x: this.positions[i].x, y: this.positions[i].y }]

                //This for loop traverses up the column of the current hexagon in search of
                //a hexagon that can occupy the current empty position
                for (var k = i - this.boardSize; ; k -= this.boardSize) {
                    //If we find a position actually on the board that has a hexagon in it
                    if (k >= 0 && this.positions[k].occupied) {
                        //Loop through the hexagons to find the hexagon that occupies the position
                        for (var j = 0; j < this.hexagons.length; j++) {
                            /*Once the hexagon is found, send it all the positions it will traverse,
                            which x,y coords it will begin its journey from, and tell it to start moving.
                            Set the current position to occupied.*/
                            if (this.hexagons[j].x == this.positions[k].x && this.hexagons[j].y == this.positions[k].y) {
                                this.hexagons[j].startMoving(destinationPositions, this.hexagons[j].x, this.hexagons[j].y);
                                this.positions[i].occupied = true;
                                this.positions[k].occupied = false;
                                break;
                            }
                        }
                        break;
                    } 
                    /*If there was no hexagon on the board that could occupy the current position,
                    go to the list of removed hexagons, randomize its color,
                    give it the list of destination positions, and tell it to fall from the top*/
                    else if (k < 0) {
                        this.removedHexagons[0].reset();
                        this.removedHexagons[0].startMoving(destinationPositions, this.positions[k + this.boardSize].x, startingYs[currentCol]);
                        this.removedHexagons[0].randomizeColor(this.colors, this.colorsAmount);
                        this.removedHexagons.shift();

                        this.positions[i].occupied = true;
                        startingYs[currentCol] -= this.hexagons[0].height * 4;
                        break;
                    } else {
                        //If we are still searching the board but the current position is unoccupied,
                        //add this position to the list of positions a hexagon will have to traverse.
                        destinationPositions.unshift({ x: this.positions[k].x, y: this.positions[k].y })
                    }
                }
            }
            currentCol--;
            if (currentCol < 0) {
                currentCol = this.boardSize - 1;
            }
        }
    }

    createBoard(scene, game, size, colorsAmount) {
        this.resetVariables(scene);

        this.boardSize = size;
        this.colorsAmount = colorsAmount;

        var hexagons = [];
        //A temporary hexagon is created to get width and height dimensions to use in board creation
        var tempHex = scene.add.sprite(100, 100, 'hex');
        var y = (game.config.height - (tempHex.height - tempHex.height * .26) * this.boardSize) / 2;
        var startingX = (game.config.width - tempHex.width * this.boardSize + tempHex.width / 2) / 2;
        var x = startingX;
        //The offset for each hexagon being pushed into the row above it slightly
        var yInsertOffset = .26;

        //Creating hexagons and setting them to proper locations
        for (var j = 0; j < this.boardSize; j++) {
            //This if-else offsets every other row slightly to achieve hive effect
            if ((j + 1) % 2 == 0) {
                x = startingX + tempHex.width / 2.0;
            }
            else {
                x = startingX;
            }

            for (var i = 0; i < size; i++) {
                //Choose a random color from the colors array up to the alotted amount of colors chosen by user
                var randomTint = this.colors[Math.floor(Math.random() * this.colorsAmount)];
                hexagons.push(new Hexagon({ scene: scene, x: x, y: y, texture: 'hex', tint: randomTint }));
                this.positions.push({ x: x, y: y, occupied: true });
                x += tempHex.width;
            }
            y += tempHex.height - tempHex.height * yInsertOffset;
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

        //Make sure the flash texture when closing loops resets
        if (this.flashTexture.alpha != 0) {
            this.flashTexture.alpha = 0;
            this.flashTriggered = false;
            this.flashTextureAlpha = 0;
        }
    }

    resetVariables(scene) {
        this.hexagons = [];
        this.positions = [];
        this.selectedHexagons = [];
        this.removedHexagons = [];
        this.score = 0;
        this.timeLeft = this.totalTime;
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