class Hexagon extends Phaser.GameObjects.Sprite {

    // clicked = false;
    // color = 0x000000;
    constructor(config) {
        super(config.scene, config.x, config.y, config.texture, config.tint);

        this.clicked = false;
        this.color = config.tint;
        this.tint = this.color;
        config.scene.add.existing(this);

        this.setInteractive();
        this.on('pointerdown', this.click, this);
        this.on('pointerup', this.unclicked, this);

        this.shrinkActivated = false;
        // config.game.time.events.add(Phaser.Timer.QUARTER, this.shrink, config.scene);
    }

    update() {
        if (this.shrinkActivated) {
            this.shrink();
        }
    }

    click() {
        this.clicked = true;
        this.setTexture('whiteHex');
    }

    unclicked() {
        // this.clicked = false;
    }

    reset() {
        this.setTexture('hex');
        this.clicked = false;
    }

    shrink() {
        this.setScale(this.scale.x * .9, this.scale.y * .9);
        if (this.scale.x < .05) {
            this.shrinkActivated = false;
        }
    }
}