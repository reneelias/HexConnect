class Button extends Phaser.GameObjects.Sprite {
    constructor(config) {
        super(config.scene, config.x, config.y, config.texture, config.tint);

        this.clicked = false;
        this.color = config.tint;
        this.tint = this.color;
        config.scene.add.existing(this);

        this.previouslyClicked = false;
        this.text = config.scene.add.text(this.x, this.y, config.text, { fontSize: '30px', fill: '#000' });
        this.text.x -= this.text.width / 2;
        this.text.y -= this.text.height / 2;
    }

    update(activePointer) {
        if (this.previouslyClicked && !activePointer.isDown &&
            this.getBounds().contains(activePointer.x, activePointer.y)) {
            this.click();
        } else if (!this.previouslyClicked && !activePointer.isDown ||
            this.getBounds().contains(activePointer.x, activePointer.y)) {
        }

        if (this.getBounds().contains(activePointer.x, activePointer.y)) {
            this.tint = 0x33a7ff;
        } else if (!this.clicked) {
            this.tint = this.color;
        }

        this.previouslyClicked = activePointer.isDown && this.getBounds().contains(activePointer.x, activePointer.y);
    }

    click() {
        this.clicked = true;
        this.tint = 0x33a7ff;
    }

    unclick() {
        this.clicked = false;
        this.tint = this.color;
    }

    setVisible(visible) {
        this.visible = visible;
        this.text.visible = visible;
    }
}