class Menu extends Phaser.GameObjects.Sprite {
    constructor(config) {
        super(config.scene, config.x, config.y, config.texture, config.tint);

        this.color = config.tint;
        this.tint = this.color;
        config.scene.add.existing(this);

        this.setScale(config.width / this.width, config.height / this.height)

        this.buttonSize = config.buttonSize;
        this.sizeButtons = [];
        var buttonX = this.x - this.buttonSize;
        var hexBoardsize = 6;

        for (var i = 0; i < 3; i++) {
            this.sizeButtons.push(new Button({ scene: config.scene, x: buttonX, y: this.y - this.buttonSize * 2, texture: 'button', tint: 0xa4d6fc, text: hexBoardsize }));
            this.sizeButtons[i].setScale(this.buttonSize / this.sizeButtons[i].width, this.buttonSize / this.sizeButtons[i].height);
            hexBoardsize += 2;
            buttonX += this.buttonSize;
        }

        this.sizeText = config.scene.add.text(this.x, this.sizeButtons[0].y - this.buttonSize * 1.25, 'Board Size', { fontSize: '30px', fill: '#000' });
        this.sizeText.x -= this.sizeText.width / 2;

        this.colorButtons = [];
        var buttonX = this.x - this.buttonSize * 1.5;
        var colorSize = 5;

        for (var i = 0; i < 4; i++) {
            this.colorButtons.push(new Button({ scene: config.scene, x: buttonX, y: this.y + this.buttonSize, texture: 'button', tint: 0xa4d6fc, text: colorSize }));
            this.colorButtons[i].setScale(this.buttonSize / this.colorButtons[i].width, this.buttonSize / this.colorButtons[i].height);
            colorSize++;
            buttonX += this.buttonSize;
        }

        this.colorsText = config.scene.add.text(this.x, this.colorButtons[0].y - this.buttonSize * 1.25, 'Number of Colors', { fontSize: '30px', fill: '#000' });
        this.colorsText.x -= this.colorsText.width / 2;

        this.playButton = new Button({ scene: config.scene, x: this.x, y: this.y + this.buttonSize * 3, texture: 'button', tint: 0xa4d6fc, text: 'Play' });
        this.playButton.setScale((this.buttonSize * 3) / this.playButton.width, this.buttonSize / this.playButton.height);
    }

    update(activePointer) {
        this.sizeButtons.forEach(button => {
            button.update(activePointer);
        });

        this.colorButtons.forEach(button => {
            button.update(activePointer);
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
