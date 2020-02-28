class Menu extends Phaser.GameObjects.Sprite {
    constructor(config) {
        super(config.scene, config.x, config.y, config.texture, config.tint);

        //Color and tint seem redundant, but I hit a weird bug when changing tint values
        //Didn't have enough time to go back and check for a solution
        this.color = config.tint;
        this.tint = this.color;
        config.scene.add.existing(this);

        this.setScale(config.width / this.width, config.height / this.height)

        this.buttonSize = config.buttonSize;

        //Initializing size buttons
        this.sizeButtons = [];
        //Where to place first button
        var buttonX = this.x - this.buttonSize * 2;
        var hexBoardSize = 6;

        for (var i = 0; i < 5; i++) {
            this.sizeButtons.push(new Button({ scene: config.scene, x: buttonX, y: this.y - this.buttonSize * 2, texture: 'button', tint: 0xa4d6fc, text: hexBoardSize }));
            this.sizeButtons[i].setScale(this.buttonSize / this.sizeButtons[i].width, this.buttonSize / this.sizeButtons[i].height);
            hexBoardSize += 1;
            buttonX += this.buttonSize;
        }
        this.sizeButtons[0].click();

        //Initializing "Board Size" text
        var yOffset = 1.25;

        this.sizeText = config.scene.add.text(this.x, this.sizeButtons[0].y - this.buttonSize * yOffset, 'Board Size', { fontSize: '30px', fill: '#000' });
        this.sizeText.x -= this.sizeText.width / 2;

        //Initializing color buttons
        this.colorButtons = [];
        //Where to place first button
        buttonX = this.x - this.buttonSize * 1.5;
        var colorSize = 5;

        for (var i = 0; i < 4; i++) {
            this.colorButtons.push(new Button({ scene: config.scene, x: buttonX, y: this.y + this.buttonSize, texture: 'button', tint: 0xa4d6fc, text: colorSize }));
            this.colorButtons[i].setScale(this.buttonSize / this.colorButtons[i].width, this.buttonSize / this.colorButtons[i].height);
            colorSize++;
            buttonX += this.buttonSize;
        }
        this.colorButtons[0].click();

        //Initializing "Number of Colors" text
        this.colorsText = config.scene.add.text(this.x, this.colorButtons[0].y - this.buttonSize * yOffset, 'Number of Colors', { fontSize: '30px', fill: '#000' });
        this.colorsText.x -= this.colorsText.width / 2;

        yOffset = 3;
        this.playButton = new Button({ scene: config.scene, x: this.x, y: this.y + this.buttonSize * yOffset, texture: 'button', tint: 0xa4d6fc, text: 'Play' });
        this.playButton.setScale((this.buttonSize * 3) / this.playButton.width, this.buttonSize / this.playButton.height);

        this.boardSize = 6;
        this.colorsAmount = 5;
    }

    update(activePointer) {
        this.sizeButtons.forEach(button => {
            button.update(activePointer);
            //This if and for loop checks for the most recently clicked size button
            //and unclicks all other size buttons
            if (button.justClicked) {
                for (var i = 0; i < this.sizeButtons.length; i++) {
                    if (button != this.sizeButtons[i]) {
                        this.sizeButtons[i].unclick()
                    } else {
                        this.boardSize = 6 + i
                    }
                }
            }
        });

        this.colorButtons.forEach(button => {
            button.update(activePointer);
            //This if and for loop checks for the most recently clicked color button
            //and unclicks all other color buttons
            if (button.justClicked) {
                for (var i = 0; i < this.colorButtons.length; i++) {
                    if (button != this.colorButtons[i]) {
                        this.colorButtons[i].unclick()
                    } else {
                        this.colorsAmount = 5 + i
                    }
                }
            }
        });

        this.playButton.update(activePointer);
    }

    setVisible(visible) {
        this.visible = visible;

        this.sizeText.visible = visible;
        this.colorsText.visible = visible;

        this.sizeButtons.forEach(button => {
            button.setVisible(visible);
        });
        this.colorButtons.forEach(button => {
            button.setVisible(visible);
        });
        this.playButton.setVisible(visible);
    }
}
