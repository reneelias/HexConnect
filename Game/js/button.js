class Button extends Phaser.GameObjects.Sprite {
    constructor(config) {
        super(config.scene, config.x, config.y, config.texture, config.tint);

        this.clicked = false;
        this.color = config.tint;
        this.tint = this.color;
        config.scene.add.existing(this);
        this.setScale(1, .4);

        this.previouslyClicked = false;
        this.text = config.scene.add.text(this.x, this.y, config.text, { fontSize: '30px', fill: '#000' });
        this.text.x -= this.text.width / 2;
        this.text.y -= this.text.height / 2;
    }

    update(activePointer) {
        if (this.previouslyClicked && !activePointer.isDown &&
            this.getBounds().contains(activePointer.x, activePointer.y)) {
            this.click();
        } else if(!this.previouslyClicked && !activePointer.isDown || 
            this.getBounds().contains(activePointer.x, activePointer.y)) {
            this.clicked = false;
        }

        if(this.getBounds().contains(activePointer.x, activePointer.y)){
            this.tint = 0x33a7ff;
        } else {
            this.tint = this.color;
        }

        this.previouslyClicked = activePointer.isDown && this.getBounds().contains(activePointer.x, activePointer.y);
    }

    click() {
        this.clicked = true;
    }

    unclick() {
        this.clicked = false;
    }

    setVisible(visible) {
        if (visible) {
            this.visible = true;
            this.text.visible = true;
        }
        else {
            this.visible = false;
            this.text.visible = false;
        }
    }
}