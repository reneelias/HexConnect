class Button extends Phaser.GameObjects.Sprite {
    constructor(config) {
        super(config.scene, config.x, config.y, config.texture, config.tint);

        //Initialize click states and whether pointer is contained or not
        this.clicked = false;
        this.previouslyClicked = false;
        this.justClicked = false;
        this.pointerContained = false;

        //Color and tint seem redundant, but I hit a weird bug when changing tint values
        //Didn't have enough time to go back and check for a solution
        this.color = config.tint;
        this.tint = this.color;
        config.scene.add.existing(this);

        //Text associated with the button
        this.text = config.scene.add.text(this.x, this.y, config.text, { fontSize: '30px', fill: '#000' });
        this.text.x -= this.text.width / 2;
        this.text.y -= this.text.height / 2;

        this.highlightColor = 0x33a7ff;
    }

    update(activePointer) {
        this.pointerContained = this.getBounds().contains(activePointer.x, activePointer.y)
        this.justClicked = !this.previouslyClicked && activePointer.isDown && this.pointerContained;

        if (this.previouslyClicked && !activePointer.isDown &&
            this.pointerContained) {
            this.click();
        } 

        if (this.pointerContained) {
            this.tint = this.highlightColor;
        } else if (!this.clicked) {
            this.tint = this.color;
        }

        this.previouslyClicked = activePointer.isDown && this.pointerContained;
    }

    click() {
        this.clicked = true;
        this.tint = this.highlightColor;
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