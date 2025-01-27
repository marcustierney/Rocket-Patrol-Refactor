//Marcus Tierney
//Rocket Patrol Modded
//10 hours
// (1) Add your own (copyright-free) looping background music to the Play scene (keep the volume low and be sure that multiple instances of your music don't play when the game restarts) 
// (3) Create 4 new explosion sound effects and randomize which one plays on impact
// (3) Display the time remaining (in seconds) on the screen
// (3) Using a texture atlas, create a new animated sprite (three frames minimum) for the enemy spaceships
// (5) Create a new enemy Spaceship type (w/ new artwork) that's smaller, moves faster, and is worth more points
// (5) Implement a new timing/scoring mechanism that adds time to the clock for successful hits and subtracts time for misses
//Citations: 
// - Tomentum+. Upbeat Japanese Gaming Music. freesound.org/people/Tomentum+/sounds/721634/.
// - MrFossy. SFX_STICKERRIPPER_foilBooms_01.Wav. freesound.org/people/MrFossy/sounds/590360/.
// - magnuswaker. Explosion 1. freesound.org/people/magnuswaker/sounds/523089/.
// - ryansnook. Small Explosion.wav. freesound.org/people/ryansnook/sounds/110115/.
// - SamsterBirdies. Gun / Cannon / Explosion. freesound.org/people/SamsterBirdies/sounds/580040/.
            
let config = {
    type: Phaser.AUTO,
    width: 640,
    height: 480,
    scene: [ Menu, Play ]
  }

let game = new Phaser.Game(config)

// set UI sizes
let borderUISize = game.config.height / 15
let borderPadding = borderUISize / 3

// reserve keyboard bindings
let keyFIRE, keyRESET, keyLEFT, keyRIGHT

