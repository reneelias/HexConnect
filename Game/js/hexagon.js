class Hexagon extends Phaser.GameObjects.Sprite {
    constructor(config) {
        super(config.scene, config.x, config.y, config.texture, config.tint);

        this.clicked = false;
        //Color and tint seem redundant, but I hit a weird bug when changing tint values
        //Didn't have enough time to go back and check for a solution
        this.color = config.tint;
        this.tint = this.color;
        config.scene.add.existing(this);

        this.shrinkActivated = false;
        this.destinationPosition = { x: 0, y: 0 };
        this.moving = false;
        this.speed = { x: 2, y: 2 };
        this.destinations = [];
        this.resetX;
        this.resetY;

        this.hitSound = config.scene.sound.add('hitSound');

        //Next random color
        this.nextColor = this.color;
    }

    update(activePointer, firstClick) {
        if (this.shrinkActivated) {
            this.shrink();
        } else if (this.moving) {
            this.move();
        }

        if (activePointer.isDown && this.getBounds().contains(activePointer.x, activePointer.y) &&
            firstClick) {
            this.click();
        }
    }

    click() {
        /*NOTE: There is some overlap between click() in Hexagon and Button.
        Ideally I'd have some sort of inheritance/overriding happening,
        but because of time constraints, I was not able to implement that.*/
        this.clicked = true;
        this.setTexture('whiteHex');
    }

    reset() {
        this.setTexture('hex');
        this.clicked = false;
    }

    shrink() {
        var scaleRate = .75;
        this.setScale(this.scale * scaleRate, this.scale * scaleRate);

        if (this.scale < .05) {
            this.shrinkActivated = false;
            this.setScale(1, 1);
            this.y = this.resetY;
            this.x = this.resetX;
            this.color = this.nextColor;
            this.setTint(this.color);
        }
    }

    startMoving(destinationPositions, startingX, startingY) {
        this.moving = true;
        var speed = 10;
        this.resetY = startingY;
        this.resetX = startingX;

        //If hexagon is above screen, set a fast speed
        if (this.y <= -startingY || this.shrinkActivated) {
            speed = 25;
        }

        //Determine whether hexagon will move left or right
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
        //Move x coordinate
        if ((this.x > this.destinationPosition.x && this.speed.x < 0) ||
            (this.x < this.destinationPosition.x && this.speed.x > 0)) {
            this.x += this.speed.x;
        }
        //If we have passed destination x, snap to destination x
        else if ((this.x <= this.destinationPosition.x && this.speed.x < 0) ||
            (this.x >= this.destinationPosition.x && this.speed.x > 0)) {
            this.x = this.destinationPosition.x;
        }
        //Move y coordinate
        if (this.y < this.destinationPosition.y) {
            this.y += this.speed.y;
        }
        //If we have passed destination y, snap to destination y
        else if (this.y >= this.destinationPosition.y) {
            this.y = this.destinationPosition.y;
        }
        //Check if hexagon has arrived to position
        if (this.x == this.destinationPosition.x && this.y == this.destinationPosition.y) {
            this.hitSound.play();

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

    randomizeColor(colors, colorsAmount) {
        this.nextColor = colors[Math.floor(Math.random() * colorsAmount)];
    }
}