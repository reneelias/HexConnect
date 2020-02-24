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


        // this.clicked = false;
    }

    update() {
        if (this.clicked) {
            this.tint = 0x000000;
            console.log(this.clicked);
        }
        else {
            this.tint = this.color;
        }
    }

    click() {
        this.clicked = true;
        // console.log(clicked);
    }

    unclicked() {
        this.clicked = false;
    }
}