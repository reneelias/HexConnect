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
        this.destinationPosition = { x: 0, y: 0 };
        this.moving = false;
        this.speed = { x: 2, y: 2 };
        this.destinations = [];
        this.resetX;
        this.resetY;
    }

    update() {
        if (this.shrinkActivated) {
            this.shrink();
        }
        if (this.moving && !this.shrinkActivated) {
            this.move();
        }
    }

    click() {
        console.log("color: " + this.color)
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
        var scaleRate = .75;
        this.setScale(this.scale * scaleRate, this.scale * scaleRate);
        // this.setScale(.5, .5);
        if (this.scale < .05) {
            this.shrinkActivated = false;
            this.setScale(1, 1);
            this.y = this.resetY;
            this.x = this.resetX;
        }
    }

    startMoving(destinationPositions, startingX, startingY) {
        this.moving = true;
        var speed = 6;
        this.resetY = startingY;
        this.resetX = startingX;

        if (this.y <= -startingY || this.shrinkActivated) {
            speed = 25;
        }

        if (this.x - startingX < 0) {
            this.speed.x = speed;
        } else {
            this.speed.x = -speed;
        }
        this.speed.y = speed;

        this.destinationPosition.x = destinationPositions[0].x;
        this.destinationPosition.y = destinationPositions[0].y;

        this.destinations = destinationPositions;
    }

    move() {
        //move x coordinate
        if ((this.x > this.destinationPosition.x && this.speed.x < 0) ||
            (this.x < this.destinationPosition.x && this.speed.x > 0)) {
            this.x += this.speed.x;
        }
        else if ((this.x <= this.destinationPosition.x && this.speed.x < 0) ||
            (this.x >= this.destinationPosition.x && this.speed.x > 0)) {
            this.x = this.destinationPosition.x;
        }
        //move y coordinate
        if (this.y < this.destinationPosition.y) {
            this.y += this.speed.y;
        }
        else if (this.y >= this.destinationPosition.y) {
            this.y = this.destinationPosition.y;
        }
        //check if hexagon has arrived to position
        if (this.x == this.destinationPosition.x && this.y == this.destinationPosition.y) {
            this.destinations.shift();
            if (this.destinations.length == 0) {
                this.moving = false;
                this.destinations = [];
            } else {
                this.destinationPosition.x = this.destinations[0].x;
                this.destinationPosition.y = this.destinations[0].y;

                this.speed.x = 6;
                this.speed.y = 6;

            }
        }
    }

    randomizeColor(colors) {
        this.color = colors[Math.floor(Math.random() * Math.floor(colors.length))];
        this.setTint(this.color);
    }
}