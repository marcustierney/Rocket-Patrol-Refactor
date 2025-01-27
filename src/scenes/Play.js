class Play extends Phaser.Scene {
    constructor() {
        super('playScene')
    }

    create() {
        // place tile sprite
        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0, 0)
        // green UI background
        this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0x00FF00).setOrigin(0, 0)
        // white borders
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0)
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0)
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0)
        // add rocket (p1)
        this.p1Rocket = new Rocket(this, game.config.width/2, game.config.height - borderUISize - borderPadding, 'rocket').setOrigin(0.5, 0)

        // define the 'fly' animation using the frames from the spritesheet
        this.anims.create({
            key: 'fly', // animation key
            frames: this.anims.generateFrameNumbers('spaceship-sprite', {
                start: 0,  // starting frame 
                end: 2    
            }),
            frameRate: 3, 
            repeat: -1      // loop the animation indefinitely
        });

        this.ship01 = new Spaceship(this, game.config.width + borderUISize*6, borderUISize*4, 'spaceship-sprite', 0, 30).setOrigin(0, 0)
        this.ship01.play('fly');

        this.ship02 = new Spaceship(this, game.config.width + borderUISize*3, borderUISize*5 + borderPadding*2, 'spaceship', 0, 20).setOrigin(0,0)
        this.ship02.play('fly');

        this.ship03 = new Spaceship(this, game.config.width, borderUISize*6 + borderPadding*4, 'spaceship', 0, 10).setOrigin(0,0)
        this.ship03.play('fly');

        this.ship04 = new Spaceship(this, game.config.width + borderUISize*9, borderUISize*7 + borderPadding*6, 'newspaceship', 0, 40).setOrigin(0,0)
        this.ship04.setScale(0.5); // 50% smaller

        this.ship04.setSize(31, 16); // Set the width and height of the hitbox


        this.ship04.moveSpeed = 5
        
        // define keys
        keyFIRE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F)
        keyRESET = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R)
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT)
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT)
        // initialize score
        this.p1Score = 0
        // display score
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*2, this.p1Score, scoreConfig)
        // GAME OVER flag
        this.gameOver = false
        // 60-second play clock
        scoreConfig.fixedWidth = 0

        this.remainingTime = game.settings.gameTimer; // Total game time in milliseconds or seconds

        /*
        this.clock = this.time.delayedCall(this.remainingTime, () => {
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5)
            this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or ← for Menu', scoreConfig).setOrigin(0.5)
            this.gameOver = true
        }, null, this)*/

        // text to display the timer inside the box
        this.timerText = this.add.text(borderUISize*16 + borderPadding, borderUISize + borderPadding*4, `Time: ${this.remainingTime / 1000}`, {
            fontSize: '24px',
            color: '#ffffff',
            fontStyle: 'bold',
        }).setOrigin(0.5);
        this.clock = this.time.addEvent({
            delay: 1000, // Update every second (1000ms)
            callback: () => {        
                this.remainingTime -= 1000; // Subtract 1 second
                this.timerText.setText(`Time: ${Math.max(this.remainingTime / 1000, 0)}`); // Update timer text

                // check if time has run out
                if (this.remainingTime <= 0) {
                    this.clock.remove(false); // Stop the timer
                    this.add.text(game.config.width / 2, game.config.height / 2, 'GAME OVER', scoreConfig).setOrigin(0.5);
                    this.add.text(game.config.width / 2, game.config.height / 2 + 64, 'Press (R) to Restart or ← for Menu', scoreConfig).setOrigin(0.5);
                    this.gameOver = true;
                }
            },
            callbackScope: this,
            loop: true, // Ensure the callback repeats every second
        });
        // display timer
        let timeConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        // this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*2, this.p1Score, timeConfig)
    }
    update() {
        // check key input for restart
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyRESET)) {
            this.scene.restart()
            console.log("restart")
        }
        this.starfield.tilePositionX -= 4
        if(!this.gameOver) { 
            let checkHit = this.p1Rocket.update()   
            this.ship01.update()               // update spaceships 
            this.ship02.update()
            this.ship03.update()
            this.ship04.update()
            if (checkHit) {
                this.remainingTime -= 2000
                console.log(this.remainingTime)
            }
        }
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene")
        }
        // check collisions
        if(this.checkCollision(this.p1Rocket, this.ship03)) {
            console.log('kaboom ship 03')
            this.p1Rocket.reset()
            this.shipExplode(this.ship03) 
            this.remainingTime += 2000
            console.log(this.remainingTime)
        }
        if (this.checkCollision(this.p1Rocket, this.ship02)) {
            console.log('kaboom ship 02')
            this.p1Rocket.reset()
            this.shipExplode(this.ship02)
            this.remainingTime += 2000
            console.log(this.remainingTime)
        }
        if (this.checkCollision(this.p1Rocket, this.ship01)) {
            console.log('kaboom ship 01')
            this.p1Rocket.reset()
            this.shipExplode(this.ship01)
            this.remainingTime += 2000
            console.log(this.remainingTime)

        }
        if (this.checkCollision(this.p1Rocket, this.ship04)) {
            console.log('kaboom ship 04')
            this.p1Rocket.reset()
            this.shipExplode(this.ship04)
            this.remainingTime += 2000
            console.log(this.remainingTime)
        }
    }
    checkCollision(rocket, ship) {
        // simple AABB checking
        if (rocket.x < ship.x + ship.width && 
          rocket.x + rocket.width > ship.x && 
          rocket.y < ship.y + ship.height &&
          rocket.height + rocket.y > ship. y) {
          return true
        } else {
          return false
        }
    }
    shipExplode(ship) {
        // temporarily hide ship
        ship.alpha = 0
        // create explosion sprite at ship's position

        let boom = this.add.sprite(ship.x, ship.y, "explosion").setOrigin(0, 0);
        boom.anims.play('explode')             // play explode animation
        boom.on('animationcomplete', () => {   // callback after anim completes
          ship.reset()                         // reset ship position
          ship.alpha = 1                       // make ship visible again
          boom.destroy()                       // remove explosion sprite
        })
        // score add and text update
        this.p1Score += ship.points
        this.scoreLeft.text = this.p1Score
        const explosions = [
            "sfx-explosion",
            "sfx-explosion1",
            "sfx-explosion2",
            "sfx-explosion3",
            "sfx-explosion4"
        ];
        const randomIndex = Math.floor(Math.random() * explosions.length);
        this.sound.play(explosions[randomIndex]);           
    }
}